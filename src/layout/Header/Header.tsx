"use client";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Button, Container } from "react-bootstrap";
import Select, { components } from "react-select";
import HeaderProfileNav from "./HeaderProfileNav";
import ChangeLanguage from "src/components/ChangeLanguage";
import {
  ACCEPTED,
  NOT_ACCEPT,
  PENDING_ACCEPTED,
  TYPE_ACCOUNT_ADMIN,
  TYPE_ACCOUNT_SCHOOL,
  TYPE_ACCOUNT_TEACHER,
} from "src/constant";
import useDeviceDetect from "src/hooks/useDetectDevice";
import {
  checkTypeAccount,
  getDataModelsStorage,
  getRoleAccount,
  getSchoolId,
  getUserIdFromSession,
} from "src/selection";
import { useAppStore } from "src/stores/appStore";
import useTrans from "src/hooks/useTrans";
import { getInfoSchool, sendNotiRequestJoinSchool } from "src/services/common";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { getDetailSchoolFetched, setDetailSchoolFetched } from "src/global";
import ToastInfoHeader from "src/components/ToastInfoHeader";
import ToastHookDowloadApp from "src/components/ToastHookDowloadApp";
import HeaderNotificationNav from "./HeaderNotificationNav";
import Image from "next/image";
import { toast } from "react-toastify";
import useNotificationStore from "src/stores/notiStore";
import { useSchoolStore } from "src/stores/schoolStore";
// import useWebSocket from "src/hooks/useWebSocket";
import { debounce } from "lodash";
import { getOS } from "src/hooks/useGetOs";
import useWebSocketStore from "src/stores/webSocketStore";
import { useTeacherStore } from "src/stores/teacherStore";

type HeaderProps = {
  toggleSidebar: () => void;
  toggleNavbar: () => void;
};

interface OptionType {
  value: string;
  label: string;
}

interface AddSchoolOptionProps {
  selectOption: (option: OptionType) => void;
}

export default function Header(props: HeaderProps) {
  const { toggleSidebar, toggleNavbar } = props;
  const trans = useTrans();
  const router = useRouter();
  const { s } = router.query;

  const { isMobile } = useDeviceDetect();
  const currentPageTeacher =
    typeof window !== "undefined" &&
    router.pathname.includes("danh-sach-giao-vien");

  const setOpenLogoutModal = useAppStore(
    (state: any) => state.setOpenLogoutModal
  );
  const dataModels =
    useAppStore((state: any) => state.dataModels) ?? getDataModelsStorage();

  const [typeAccount, setTypeAccount] = useState(null); // dung local storage nen SSR bi loi phai dung state de goi o client

  const schoolId = getSchoolId();
  const setSchoolId = useAppStore((state: any) => state.setSchoolId);
  const setLearnModelId = useAppStore((state: any) => state.setLearnModelId);
  const fetchDataModels = useAppStore((state: any) => state.fetchDataModels);

  const detailSchoolFetched = getDetailSchoolFetched();
  const {
    control,
    formState: { errors },
    watch,
  } = useForm<any>({
    mode: "onChange",
  });

  const selectedSchoolId = watch("school_id");
  const [schoolName, setSchoolName] = useState("");

  const { schoolActive, setSchoolActive, showNotiVerifying, setShowNotiVerifying } = useSchoolStore((state: any) => ({
    schoolActive: state.schoolActive,
    setSchoolActive: state.setSchoolActive,
    showNotiVerifying: state.showNotiVerifying,
    setShowNotiVerifying: state.setShowNotiVerifying
  }));

  const {
    listNoti,
    totalNoti,
    fetchNotifications,
    fetchReadNotification,
  } = useNotificationStore((state) => ({
    listNoti: state.listNoti,
    totalNoti: state.totalNoti,
    fetchNotifications: state.fetchNotifications,
    fetchReadNotification: state.fetchReadNotification,
  }));

  const [downloadLink, setDownloadLink] = useState("");

  useEffect(() => {
    setTypeAccount(checkTypeAccount());
    const modelsSchool =
      (dataModels || []).find((school: any) => school.id === schoolId)
        ?.models || [];
    setLearnModelId(modelsSchool[0]?.id);
    const storedSchoolName = localStorage.getItem("schoolName");
    if (storedSchoolName) {
      setSchoolName(storedSchoolName);
    }
    // if (!detailSchoolFetched && typeAccount !== TYPE_ACCOUNT_TEACHER) {
    //   getDetailSchool()
    //     .then(() => {
    //       setDetailSchoolFetched(true);
    //     })
    //     .catch((err) => {
    //       if (err?.response?.data?.meta?.code === 401) {
    //         setOpenLogoutModal(true);
    //       }
    //     });
    // }

    let link = "";
    switch(getOS()) {
        case "WindowsPhone":
            link = "link_tai_windows_phone";
            break;
        case "Windows":
            link = "https://play.google.com/store/apps/details?id=com.earlystart.monkeyclass";
            break;
        case "iOS":
            link = "https://apps.apple.com/cd/app/monkey-class/id6478106053";
            break;
        case "Android":
            link = "https://play.google.com/store/apps/details?id=com.earlystart.monkeyclass";
            break;
        case "MacOS":
            link = "https://apps.apple.com/cd/app/monkey-class/id6478106053";
            break;
        case "Linux":
            link = "https://play.google.com/store/apps/details?id=com.earlystart.monkeyclass";
            break;
        default:
            link = "https://play.google.com/store/apps/details?id=com.earlystart.monkeyclass";
    }

    setDownloadLink(link);
  }, []);

  useEffect(() => {
    // if (s) {
      const defaultSchool = dataModels.find(
        (school: any) => school.school_id === Number(s)
      );
      if (defaultSchool) {
        setSchoolActive({
          id: defaultSchool.school_id,
          value: defaultSchool.school_id,
          label: defaultSchool.school_name,
          isVerify: defaultSchool.school_is_verify,
          isAccept: defaultSchool.school_is_accept,
        });
      }
    // }
  }, [s]);

  useEffect(() => {
    typeAccount !== TYPE_ACCOUNT_ADMIN &&
      setSchoolId(valueSchoolSelect[0]?.value);
  }, [typeAccount, detailSchoolFetched]);

  useEffect(() => {
    if (selectedSchoolId) {
      setSchoolId(selectedSchoolId);
      const modelsSchool =
        (dataModels || []).find((school: any) => school.id === selectedSchoolId)
          ?.models || [];
      setLearnModelId(modelsSchool[0]?.id);
      const formatDataSessionStorage = [
        {
          id: selectedSchoolId,
        },
      ];
      typeAccount !== TYPE_ACCOUNT_ADMIN &&
        sessionStorage.setItem(
          "school",
          JSON.stringify(formatDataSessionStorage) ?? ""
        );
    }
  }, [selectedSchoolId]);

	const isFirstRender = useRef(true);

  useEffect(()=> {
    if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
    fetchNotifications(schoolActive?.value)
  },[schoolActive?.isAccept])

  // const getDetailSchool = async () => {
  //   return getInfoSchool({ id: s || getSchoolId() || getUserIdFromSession() })
  //     .then((res) => {
  //       if (res.meta.code === 200) {
  //         const name = res.result?.name;
  //         setSchoolName(name);
  //         localStorage.setItem("schoolName", name);
  //       }
  //     })
  //     .catch((err) => {});
  // };

  const valueSchoolSelect = (dataModels || []).flatMap((school: any) => [
    {
      value: school.school_id,
      label: school.school_name,
      isVerify: school.school_is_verify,
      isAccept: school.school_is_accept,
    },
  ]);

  const handleToggleNavbar = () => {
    toggleNavbar();
  };

  const renderSchoolNameAndCourseName = () => {
    return (
      <>
        <div className="fs-2 fw-bolder">{schoolName}</div>
      </>
    );
  };

  const handleChangeSchoolHeader = (
    schoolId: number,
    isAccept: number,
    selectedOption: any
  ) => {
    router.replace(`${router.pathname}?s=` + schoolId);
    setSchoolActive({
      id: selectedOption.value,
      value: selectedOption.value,
      label: selectedOption.label,
      isVerify: selectedOption.isVerify,
      isAccept: selectedOption.isAccept,
    });
  };

  const [showNotiRequestVerify, setShowNotiRequestVerify] = useState(
    schoolActive?.isAccept === PENDING_ACCEPTED
  );
  const [loading, setLoading] = useState(false);

  const handleRequestJoinSchool = () => {
    const params = {
      school_id: s || getSchoolId(),
    };
    setLoading(true);
    sendNotiRequestJoinSchool(params)
      .then((res: any) => {
        if (res.meta.code === 200) {
          toast.success("Gửi yêu cầu thành công!");
        } else {
          toast.error("Gửi yêu cầu thất bại!");
        }
      })
      .catch((err: any) => {
        toast.error("Gửi yêu cầu thất bại!");
      })
      .finally(() => setLoading(false));
  };

  const onHideNotiHookDownloadApp = () => {
    // setShowNotiHookDownloadApp(false);
  };

  const AddSchoolOption: React.FC<AddSchoolOptionProps> = ({
    selectOption,
  }) => {
    return (
      <div
        style={{
          padding: "8px",
          cursor: "pointer",
          color: "#007bff",
          display: "flex",
          alignItems: "center",
        }}
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/add-school?role=${getRoleAccount()}`);
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Image
          src={`/assets/svg/plus-circle.svg`}
          width={24}
          height={24}
          alt="plus"
          className="me-2"
        />
        Thêm trường
      </div>
    );
  };

  const CustomMenuList = (props: any) => {
    return (
      <components.MenuList {...props}>
        {props.children}
        <AddSchoolOption
          selectOption={props.selectOption as (option: OptionType) => void}
        />
      </components.MenuList>
    );
  };

  const userId =
    typeof localStorage !== "undefined" ? localStorage.getItem("userId") : "";

    const socket = useWebSocketStore((state: any) => state.socket);
    const { fetchGetListUserJoinSchool } = useTeacherStore((state: any) => ({
      fetchGetListUserJoinSchool: state.fetchGetListUserJoinSchool,
    }));

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event: any) => {
        
        const formatData = JSON.parse(event.data);
          const userIds = formatData.condition?.user_id;
          const schoolIdCondition = formatData.condition?.school_id;
          const userIdNumber = Number(userId);

          //case qtv nhan noti
          if (
            formatData.type === 'MONKEY_CLASS_WEB' &&
            userIds.includes(userIdNumber) &&
            schoolActive?.value == schoolIdCondition &&
            getRoleAccount() == TYPE_ACCOUNT_SCHOOL &&
            !formatData.data.refresh.includes('reject-school') &&
            !formatData.data.refresh.includes('accepted-school')
          ) {
            fetchNotifications(schoolActive?.value || '');
            setShowNotiRequestVerify(false);
            currentPageTeacher && fetchGetListUserJoinSchool();
            return;
          }
  // case accept
          if (
            formatData.type === 'MONKEY_CLASS_WEB' &&
            userIds.includes(userIdNumber) &&
            schoolActive?.value == schoolIdCondition &&
            formatData.data.refresh.includes('accepted-school')
          ) {
            setShowNotiRequestVerify(false);
            fetchNotifications(schoolActive?.value || '');
            setShowNotiVerifying(false)
            fetchDataModels();
            setSchoolActive({
              id: schoolActive?.value,
              value: schoolActive?.value,
              isAccept: ACCEPTED,
              label: schoolActive.label,
            });
            return;
          }
  // case reject:
          if (
            formatData.type === 'MONKEY_CLASS_WEB' &&
            userIds.includes(userIdNumber) &&
            schoolActive?.value == schoolIdCondition &&
            formatData.data.refresh.includes('reject-school')
          ) {
            setShowNotiRequestVerify(false);
            fetchDataModels();
            fetchNotifications(schoolActive?.value || '');
            setSchoolActive({
              id: schoolActive?.value,
              value: schoolActive?.value,
              isAccept: NOT_ACCEPT,
              label: schoolActive.label,
            });
            return;
          }
      };
    }
  }, [socket]);

  return (
    <>
      {showNotiRequestVerify && !showNotiVerifying && (
        <ToastInfoHeader
          message={
            <p className="text-center">
              <span className="fw-bold">Đang chờ trường phê duyệt •</span> Một
              khi được phê duyệt bạn sẽ có quyền truy cập vào các tính năng
              trường học!
            </p>
          }
          buttonRight={
            <Button
              className="bg-secondary text-noti"
              disabled={loading}
              onClick={() => handleRequestJoinSchool()}
            >
              Gửi thông báo cho quản trị viên
            </Button>
          }
        />
      )}
      {showNotiVerifying && (
        <ToastInfoHeader
          message={
            <p className="text-center">
              Thông tin trường của bạn đang được xác thực
            </p>
          }
          iconLeft
        />
      )}
      {/* {showNotiHookDownloadApp && !showHookRequestedVerify && (
        <ToastHookDowloadApp onClose={onHideNotiHookDownloadApp} downloadLink={downloadLink}/>
      )} */}
      <header className="header p-3 bg-primary">
        <Container
          fluid
          className="header-navbar d-flex align-items-center justify-content-between h-72"
        >
          <Button
            variant="link"
            className="header-toggler d-md-none px-md-0 me-md-3 rounded-0 shadow-none"
            type="button"
            onClick={toggleSidebar}
          >
            <FontAwesomeIcon icon={faBars} />
          </Button>

          <div className="d-flex align-items-center justify-content-center gap-4">
            {!isMobile && (
              <i
                className="fa fa-dedent fa-fw text pointer"
                aria-hidden="true"
                onClick={() => handleToggleNavbar()}
              />
            )}
            {typeAccount !== TYPE_ACCOUNT_TEACHER &&
              typeAccount !== TYPE_ACCOUNT_SCHOOL &&
              schoolName &&
              renderSchoolNameAndCourseName()}

            {(typeAccount === TYPE_ACCOUNT_TEACHER ||
              typeAccount === TYPE_ACCOUNT_SCHOOL) && (
              <Controller
                name="school_id"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <Select
                    placeholder="Chọn trường"
                    options={valueSchoolSelect}
                    defaultValue={schoolActive}
                    onChange={(selectedOption) => {
                      onChange(selectedOption ? selectedOption.value : "");
                      handleChangeSchoolHeader(
                        selectedOption.value,
                        selectedOption?.isAccept,
                        selectedOption
                      );
                    }}
                    components={{ MenuList: CustomMenuList }}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderRadius: "12px",
                        padding: "6px 6px",
                        fontWeight: "600",
                        minWidth: "200px",
                      }),
                    }}
                  />
                )}
              />
            )}
          </div>

          <div className="d-flex align-items-center position-relative gap-2">
            {/* <ChangeLanguage /> */}
            <HeaderNotificationNav
              listNoti={listNoti}
              totalNoti={totalNoti}
              fetchNotifications={fetchNotifications}
              fetchReadNotification={fetchReadNotification}
            />
            <div className="header-nav ms-2 rounded-4 bg-secondary d-flex h-72">
              <HeaderProfileNav schoolName={schoolName} />
            </div>
          </div>
        </Container>
      </header>
    </>
  );
}
