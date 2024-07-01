import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./OptionStatus.module.scss";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useTaiLieuStore } from "src/stores/tailieuStore";
import { useRouter } from "next/router";
import { MODE_SMART_CLASS, TYPE_ACCOUNT_ADMIN, levelDefault } from "src/constant";
import { checkTypeAccount } from "src/selection";
const OptionStatusUnit = (props: any) => {
  const router = useRouter();
  const { model } = router.query;
  const modelId = useTaiLieuStore((state: any) => state.modelId) ?? model;
  const { innerProps, innerRef } = props;

  return (
    <article
      ref={innerRef}
      {...innerProps}
      className={`${(props.data.available === 0 && checkTypeAccount() !== TYPE_ACCOUNT_ADMIN) ? styles.disable_event : ""} pointer px-4 py-2 ${
        props.isSelected ? styles.is_active : ""
      } ${styles.option_cus} ${
        (props.data.available === 0 && checkTypeAccount() !== TYPE_ACCOUNT_ADMIN) ? styles.is_disabled : ""
      }`}
    >
      <div className={`d-flex align-items-center justify-content-between`}>
        <div>
          {props.data.label}
        </div>
        {(props.data.available === 0 && checkTypeAccount() !== TYPE_ACCOUNT_ADMIN) && <FontAwesomeIcon icon={faLock} />}
      </div>
    </article>
  );
};

export default OptionStatusUnit;
