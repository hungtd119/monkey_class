import {
  Dropdown, Nav, NavItem,
} from 'react-bootstrap'
import {toast} from "react-toastify"; 
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PropsWithChildren } from 'react'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faPowerOff,
} from '@fortawesome/free-solid-svg-icons'
import { logout } from 'src/services/auth';
import useTrans from 'src/hooks/useTrans';
import { getInfoFromLS, getLocalStorageByKey } from 'src/selection';

type NavItemProps = {
  icon: IconDefinition;
} & PropsWithChildren


const ProfileDropdownItem = (props: NavItemProps) => {
  const { icon, children } = props

  return (
    <>
      <FontAwesomeIcon className="me-2" icon={icon} fixedWidth />
      {children}
    </>
  )
}

const logOut = () => {
  logout().then(r => {
    if (r) {
      return toast.success("Đăng xuất thành công!");
    }
  });
}

export default function HeaderProfileNav(props: any) {
  const { schoolName } = props;

  const accountNameFromLS = getLocalStorageByKey("accountName"); 
  const accountName = accountNameFromLS && JSON.parse(accountNameFromLS)
  const trans = useTrans();

  return (
    <Nav className='d-flex align-items-center px-4 py-3' >
        <div className="py-0 rounded-0">
          <div className="avatar position-relative hide-mobile">
            <Image
              className="rounded-circle"
              src={`${global.pathImg}/avatar.png`}
              alt="avatar"
              loading="lazy"
              fill
            />
          </div>
        </div>
      <Dropdown as={NavItem}>

        <Dropdown.Toggle className="bg-secondary border-0 py-3" id="dropdown-profile" style={{padding: "4px"}}>
        <span className='text-decoration-none fw-bold text-value'>{accountName}</span>

        </Dropdown.Toggle>
        <Dropdown.Menu className="pt-0">
          <Dropdown.Header className="bg-light fw-bold rounded-top">{ trans.header.account }</Dropdown.Header>
          
          <Dropdown.Item onClick={() => logOut()}>
            <ProfileDropdownItem icon={faPowerOff}>{ trans.header.logout }</ProfileDropdownItem>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Nav>
  )
}
