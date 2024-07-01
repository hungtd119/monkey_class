import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "react-bootstrap";
import { PENDING_ACCEPTED } from "src/constant";
import { globalPath } from "src/global";
import { useAppStore } from "src/stores/appStore";
import { useSchoolStore } from "src/stores/schoolStore";

const FormRequestVerifySuccess = ({ onSelectSchool, selectedSchool }: any) => {
  const router = useRouter()
  const fetchDataModels = useAppStore((state: any) => state.fetchDataModels);
  const { schoolActive, setSchoolActive } = useSchoolStore((state: any) => ({
    schoolActive: state.schoolActive,
    setSchoolActive: state.setSchoolActive,
  }));
    const handleContinue = async () => {
        // onSelectSchool(selectedSchool, "createFormSchool")
      await fetchDataModels();
      if (selectedSchool?.value) {
        router.push(`/danh-sach-lop-hoc?s=${selectedSchool.value}`);
        setSchoolActive({
          value: schoolActive?.value,
          isAccept: PENDING_ACCEPTED,
          label: schoolActive?.label
        })
      } else {
        router.back();
      }
    }
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div className="mt-8 mb-4">
        <Image
          src={`${globalPath.pathImg}/img_ request_done.png`}
          width={408}
          height={280}
          className="d-flex"
          alt="Monkey Class"
        />
      </div>
      <p className="fw-bold fs-5 pt-3">Hoàn tất</p>
      <p className="text-center max-w-560px py-3" style={{ fontSize: 18 }}>
        Chúng tôi đã gửi thông báo đến đội ngũ nhà trường. Trong lúc chờ đợi,
        bạn có thể quản lý lớp học cá nhân của bạn
      </p>
      <Button
        className="px-4 w-100 fw-bold mt-3 text-secondary bg-button-v2 input-custom"
        variant="primary"
        type="submit"
        onClick={()=> handleContinue()}
      >
        Tiếp tục
      </Button>
    </div>
  );
};

export default FormRequestVerifySuccess;
