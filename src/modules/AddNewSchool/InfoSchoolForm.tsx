import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  createAccountSchool,
  getListDistrict,
  getListProvince,
} from "src/services/common";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { HTTP_STATUS_CODE_OK, PENDING_ACCEPTED } from "src/constant";
import { useSchoolStore } from "src/stores/schoolStore";
import { useAppStore } from "src/stores/appStore";
import Image from "next/image";
import { globalPath } from "src/global";

const schema = yup
  .object()
  .shape({
    school_name: yup.string().required("Vui lòng nhập tên trường"),
    address: yup.string().required("Vui lòng nhập Địa chỉ"),
    email: yup
      .string()
      .required("Vui lòng nhập email")
      .email("Email không hợp lệ"),
    province_id: yup.number().required("Vui lòng chọn Tỉnh/Thành phố*"),
    district_id: yup.number().required("Vui lòng chọn Quận/ Huyện"),
    hotline: yup
      .string()
      .required("Vui lòng nhập Hotline")
      .matches(/^\d+$/, "Vui lòng chỉ nhập số"),
  })
  .required();

const InfoSchoolForm = ({ onSelectSchool, selectedSchool }: any) => {
  const router = useRouter()
  const {
    register,
    control,
    setValue,
    formState: { errors },
    clearErrors,
    setError,
    handleSubmit,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      school_name: selectedSchool?.label || "",
      province_id: "" || null,
      district_id: "" || null,
      address: "",
      email: "",
      hotline: "",
      avatar: "",
    },
  });

  useEffect(() => {
    if (selectedSchool?.label) {
      setValue("school_name", selectedSchool.label);
    }
  }, [selectedSchool]);

  useEffect(() => {
    getListProvince({ country_code: 84 }).then((res: any) => {
      if (res.status === "success") {
        const convertedListProvince = Object.entries(res.data).map(
          ([value, label]: any) => ({
            value: parseInt(value, 10),
            label,
          })
        );
        setListProvince(convertedListProvince);
      }
    });
  }, []);

  const getListDistrictFromProvince = (idProvince: number) => {
    const params = {
      parent_id: idProvince,
      country_code: 84,
    };
    getListDistrict(params)
      .then((res: any) => {
        if (res.status === "success") {
          const convertedListDistrict = Object.entries(res.data).map(
            ([value, label]: any) => ({
              value: parseInt(value, 10),
              label,
            })
          );
          setListDistrict(convertedListDistrict);
          setCurrentDistrictId(null);
        } else {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const { setShowNotiVerifying, setSchoolActive } = useSchoolStore((state: any) => ({
    setSchoolActive: state.setSchoolActive,
    setShowNotiVerifying: state.setShowNotiVerifying
  }));
  const fetchDataModels = useAppStore((state: any) => state.fetchDataModels);

  const fileInputRef = useRef<any>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [listProvince, setListProvince] = useState<any>();
  const [listDistrict, setListDistrict] = useState<any>();
  const [currentDistrictId, setCurrentDistrictId] = useState(null);
  const [loading, setLoading] = useState(false)

  const handleImageClick = () => {
    fileInputRef?.current.click();
  };

  const handleChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("school_name", value);
    if (errors.school_name) {
      clearErrors("school_name");
    }
    if (value.trim().length === 0) {
      setError("school_name", { message: "Tên trường không đươc trống" });
    } else {
      clearErrors("school_name");
    }
  };

  const  onSubmit = async (data: any) => {
    const dataFile = new FormData();
    if (selectedFile) {
      dataFile.append("avatar", selectedFile);
    }
    dataFile.append("school_name", data.school_name);
    dataFile.append("address", data.address);
    dataFile.append("email", data.email);
    dataFile.append("province_id", data.province_id);
    dataFile.append("district_id", data.district_id);
    dataFile.append("hotline", data.hotline);

    try {
      setLoading(true)
      const res = await createAccountSchool(dataFile);
      if (res.meta.code === HTTP_STATUS_CODE_OK) {
        toast.success("Thiết lập thông tin trường thành công");
        setShowNotiVerifying(true);
        setSchoolActive({
          id: res.result.school_id,
          value: res.result.school_id,
          label: data.school_name,
          isVerify: PENDING_ACCEPTED,
          isAccept: PENDING_ACCEPTED,
        })
        await fetchDataModels();
        router.push(`danh-sach-lop-hoc?s=${res.result.school_id}`);
      }
    } catch (err) {
      toast.error("Thiết lập thông tin trường thất bại");
    } finally{
      setLoading(false)
    }
  };

  return (
    <>
      <p className="pe-32 py-8 fw-bold fs-3">Thiết lập thông tin trường</p>
      <Row className="mt-3 col-md-6">
        <Col md={12} className="mb-4">
          <div className="mb-3">
            <Form.Control
              autoFocus
              {...register("school_name")}
              aria-label="SchoolName"
              className="input-custom custom-input"
              placeholder="Tên trường*"
              onChange={handleInputChange}
            />
            {errors.school_name?.message && (
              <p className="mt-2 text-danger-v2">
                {errors.school_name?.message as any}
              </p>
            )}
          </div>
        </Col>
        <Col md={6} className="mb-6">
          <Controller
            render={({ field: { onChange } }: any) => (
              <Select
                placeholder="Tỉnh/Thành phố*"
                className="input-custom custom-input"
                options={listProvince}
                onChange={(selectedOption: any) => {
                  onChange(selectedOption ? selectedOption.value : "");
                  getListDistrictFromProvince(selectedOption?.value);
                  setValue("district_id", null);
                }}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderRadius: "12px",
                    padding: "9px 12px",
                    fontWeight: "600",
                  }),
                }}
              />
            )}
            name="province_id"
            control={control}
          />
          {errors.province_id?.message && (
            <p className="mt-2 text-danger-v2">{errors.province_id?.message}</p>
          )}
        </Col>
        <Col md={6} className="mb-6">
          <Controller
            render={({ field: { onChange } }: any) => (
              <Select
                placeholder="Quận/ Huyện*"
                options={listDistrict}
                value={currentDistrictId || null}
                onChange={(selectedOption: any) => {
                  onChange(selectedOption ? selectedOption.value : "");
                  setCurrentDistrictId(selectedOption ?? null);
                }}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderRadius: "12px",
                    padding: "9px 12px",
                    fontWeight: "600",
                  }),
                }}
              />
            )}
            name="district_id"
            control={control}
            defaultValue={null}
          />
          {errors.district_id?.message && (
            <p className="mt-2 text-danger-v2">{errors.district_id?.message}</p>
          )}
        </Col>

        <Col md={12} className="mb-4">
          <div className="mb-3">
            <Form.Control
              {...register("address")}
              aria-label="Address"
              className="input-custom custom-input"
              placeholder="Địa chỉ*"
            />
            {errors.address?.message && (
              <p className="mt-2 text-danger-v2">{errors.address?.message}</p>
            )}
          </div>
        </Col>
        <Col md={6} className="mb-4">
          <div className="mb-3">
            <Form.Control
              {...register("email")}
              aria-label="Email"
              className="input-custom custom-input"
              placeholder="Email*"
            />
            {errors.email?.message && (
              <p className="mt-2 text-danger-v2">{errors.email?.message}</p>
            )}
          </div>
        </Col>
        <Col md={6} className="mb-4">
          <div className="mb-3">
            <Form.Control
              {...register("hotline")}
              aria-label="hotline"
              className="input-custom custom-input"
              placeholder="Hotline*"
            />
            {errors.hotline?.message && (
              <p className="mt-2 text-danger-v2">{errors.hotline?.message}</p>
            )}
          </div>
        </Col>

        <div className="mb-3 position-relative">
          <Form.Control
            {...register("avatar")}
            aria-label="Avatar"
            className="input-custom custom-input"
            placeholder={
              selectedFile ? selectedFile?.name : "Upload ảnh đại diện"
            }
            onClick={handleImageClick}
          />

          <input
            type="file"
            {...register("avatar")}
            className="input-custom custom-input visually-hidden"
            ref={fileInputRef}
            onChange={handleChange}
          />

          <Image
            src={`${globalPath.pathSvg}/upload-02.svg`}
            width={24}
            height={24}
            alt="upload"
            className="position-absolute"
            style={{ top: "30%", right: "5%" }}
            onClick={handleImageClick}
          />
        </div>
        <Col lg={12}>
          <Button
            className="px-4 w-100 fw-bold mt-3 text-secondary bg-button-v2 input-custom"
            variant="primary"
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Tiếp tục"}
          </Button>
        </Col>

        <Col lg={12}>
          <Button
            className="px-4 w-100 mt-3 input-custom fw-bold"
            variant="primary"
            type="button"
            style={{ border: "1px solid #E5E5E5", color: "#4b4B4B" }}
            onClick={() => onSelectSchool(selectedSchool, "addNewSchool")}
          >
            Quay lại
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default InfoSchoolForm;
