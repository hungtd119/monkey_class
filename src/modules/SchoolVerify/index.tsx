import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button, Col, Spinner } from "react-bootstrap";
import { globalPath } from "src/global";
import { capitalizeFirstLetter, getRandomImagePath } from "src/utils";
import { getInfoDetailSchool, requestJoinToSchool } from "src/services/common";
import { getRoleAccount } from "src/selection";
import { toast } from "react-toastify";
import { HTTP_STATUS_CODE_OK } from "src/constant";
import Loading from "src/components/Loading";

interface RequestSchoolVerifyProps {
  onSelectSchool: (value: any, section: string) => void;
  selectedSchool: any;
}

const RequestSchoolVerify = ({
  onSelectSchool,
  selectedSchool,
}: RequestSchoolVerifyProps) => {
  const [listAvatar, setListAvatar] = useState<any>([]);
  const [avatarCount, setAvatarCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  const maxDisplay = 8;

  useEffect(() => {
    const params = {
      school_id: selectedSchool?.value,
    };

    const fetchSchoolData = async () => {
      setLoadingAvatar(true)
      try {
        const res = await getInfoDetailSchool(params);
        if (res.meta.code === 200) {
          const teachers = Object.values(res.result?.teacher);
          setAvatarCount(teachers.length);

          const avatars = teachers.map((teacher: any) => {
            return teacher.avatar || `${globalPath.pathImg}/default-avatar.png`;
          });

          setListAvatar(avatars);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingAvatar(false);
      }
    };

    fetchSchoolData();
  }, [selectedSchool?.value]);

  const combinedAvatars = listAvatar.length > maxDisplay 
    ? listAvatar.slice(0, maxDisplay) 
    : listAvatar;

  const extraCount = avatarCount > maxDisplay ? avatarCount - maxDisplay : 0;

  const handleBackAction = () => {
    onSelectSchool(selectedSchool, "addNewSchool");
  };

  const handleContinue = () => {
    const params = {
      school_id: selectedSchool?.value,
      role: getRoleAccount(),
    };
    setLoading(true);
    requestJoinToSchool(params)
      .then((res: any) => {
        if (res.meta.code === HTTP_STATUS_CODE_OK) {
          onSelectSchool(selectedSchool, "requestVerifySuccess");
          toast.success("Gửi yêu cầu thành công");
        } else {
          toast.error("Yêu cầu thất bại!");
        }
        setLoading(false);
      })
      .catch((err: any) => {
        if(err.response.data.meta.code === 400) {
          return toast.error("Bạn đã ở trong trường này!")
        }
      }).finally(()=> {
        setLoading(false);
      })
  };

  return (
    <div>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <div className="mt-8 mb-4 position-relative">
          <Image
            src={`${globalPath.pathImg}/img_logo_school.png`}
            width={120}
            height={120}
            className="d-flex rounded-50"
            alt="Monkey Class"
          />
          <Image
            src={`${globalPath.pathImg}/tick-circle.png`}
            width={32}
            height={32}
            className="position-absolute bottom-0 end-0"
            alt="Check"
          />
        </div>
        <p className="fw-bold mb-2 fs-5">{selectedSchool?.label}</p>
        <p className="mb-5">{selectedSchool?.address}</p>

        <hr style={{ width: "70%", color: "#ccccccc7" }} />

        <p className="mt-6 mb-3 fw-bold" style={{ fontSize: "18px" }}>
          Tham gia với các đồng nghiệp của bạn tại {selectedSchool?.label}
        </p>
      </div>
      <div className="d-flex justify-content-center align-items-center gap-3">
      {loadingAvatar ? (
        <Loading />
      ) : (
        combinedAvatars.map((path: any, index: number) => {
          const isUploadPath = path.startsWith("upload/");
          const isValidUrl = path.startsWith("http://") || path.startsWith("https://");
          const resolvedPath = isUploadPath ? `${process.env.NEXT_PUBLIC_CDN_MEDIA_URL}${path}` : isValidUrl ? path : `${globalPath.pathImg}/default-avatar.png`;

          return (
            <Image
              key={index}
              src={resolvedPath}
              width={40}
              height={40}
              className="d-flex"
              alt={`Monkey Class ${index + 1}`}
              style={{ borderRadius: "50%" }}
            />
          );
        })
      )}

        {extraCount > 0 && (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              borderRadius: "50%",
              background: "#F7F7F7",
              width: "40px",
              height: "40px",
            }}
          >
            +{extraCount}
          </div>
        )}
      </div>
      <p
        className="d-flex justify-content-center mt-3"
        style={{ color: "#777", fontWeight: 600 }}
      >
        Yêu cầu kết nối sẽ được gửi tới đội ngũ quản trị viên của trường để phê
        duyệt cho bạn
      </p>
      <div className="d-flex flex-column justify-content-center align-items-center mt-6">
        <Col lg={12} md={6} sm={6} className="d-flex justify-content-center">
          <Button
            className="px-4 w-100 fw-bold mt-3 text-secondary bg-button-v2 input-custom"
            variant="primary"
            type="submit"
            onClick={() => handleContinue()}
            disabled={loading || loadingAvatar}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Kết nối với trường"}
          </Button>
        </Col>

        <Col lg={12} md={6} sm={6} className="d-flex justify-content-center">
          <Button
            className="px-4 w-100 mt-3 input-custom fw-bold"
            variant="primary"
            type="button"
            style={{ border: "1px solid #E5E5E5", color: "#4b4B4B" }}
            onClick={() => handleBackAction()}
          >
            Quay lại
          </Button>
        </Col>
      </div>
    </div>
  );
};

export default RequestSchoolVerify;
