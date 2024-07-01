import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "react-select";
import { toast } from "react-toastify";
import { createClassroomInSchool } from "src/services/common";
import { HTTP_STATUS_CODE_OK, RangeAge, VERIFIED } from "src/constant";
import { useAppStore } from "src/stores/appStore";
import useNotificationStore from "src/stores/notiStore";

const schema = yup
  .object()
  .shape({
    class_name: yup.string().required("Vui lòng nhập tên lớp"),
    age: yup.string().required("Vui lòng nhập độ tuổi"),
  })
  .required();
const CreateClassroom = (props: any) => {
  const { selectedSchool, role } = props;
  const router = useRouter();
  const fetchDataModels = useAppStore((state: any) => state.fetchDataModels);
  const { setIsShowNotificationVerify } =
    useNotificationStore((state: any) => ({
      setIsShowNotificationVerify: state.setIsShowNotificationVerify,
    }));

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("")
  const [isClassroomPersonal, setIsClassroomPersonal] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema), 
    defaultValues: {
      class_name: "",
      age: "" || null,
    },
  });
  useEffect(() => {
    if (selectedSchool == null) {
      setTitle("Tạo lớp học cá nhân đầu tiên của bạn");
      setIsClassroomPersonal(true)
    } else if (role === "Teacher" && selectedSchool.isVerify === VERIFIED) {
      setTitle("Tạo lớp học cá nhân của bạn");
      setIsClassroomPersonal(true)
    } else if (role === "School" && selectedSchool.isVerify === VERIFIED) {
      setTitle("Tạo lớp học cá nhân của bạn");
      setIsClassroomPersonal(true)
    } else if (role === "School" && selectedSchool.isVerify !== VERIFIED) {
      setTitle("Tạo lớp học đầu tiên của trường"); 
    }
  }, [role, selectedSchool]);  

  const onSubmit = async (data: any) => {
    const params = {
      ...data,
      school_id: selectedSchool.value,
      role
    }
    try {
      setLoading(true);
      const res = await createClassroomInSchool(params);
      if(res.meta.code === HTTP_STATUS_CODE_OK) {
        await fetchDataModels();
        toast.success("Tạo lớp thành công!");
        setIsShowNotificationVerify(true);
        router.push(`/danh-sach-lop-hoc?s=${selectedSchool.value}`)
      } else {
        toast.error("Tạo lớp thất bại!"); 
      }
    } catch (error) {
      toast.error("Tạo lớp thất bại!")
    }
    finally {
      setLoading(false);
    }
  };

  const handleRedirectPage = async () => {
    await fetchDataModels();
    setLoading(true);
    if (selectedSchool?.value) {
      router.push(`/danh-sach-lop-hoc?s=${selectedSchool.value}`);
      setIsShowNotificationVerify(true);
    } else {
      router.back();
      setIsShowNotificationVerify(false);
    }
  }

  return (
    <>
      <p className="pe-32 py-8 fw-bold fs-3">{title}</p>
      <Row className="mt-3 col-md-6">
        <Col md={8} className="mb-4">
          <div className="mb-3">
            <Form.Control
              autoFocus
              {...register("class_name")}
              aria-label="SchoolName"
              className="input-custom custom-input"
              placeholder="Tên lớp*"
            />
            {errors.class_name?.message && (
              <p className="mt-2 text-danger-v2">
                {errors.class_name?.message as any}
              </p>
            )}
          </div>
        </Col>
        <Col md={4} className="mb-6">
          <Controller
              name="age"
              render={({ field: { onChange } }: any) => (
                <Select
                  className="input-custom"
                  options={RangeAge}
                  placeholder="Độ tuổi*"
                  onChange={(option: any) => onChange(option?.value)}
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
              control={control}
            />
          {errors.age?.message && (
            <p className="mt-2 text-danger-v2">
              {errors.age?.message as any}
            </p>
          )}
        </Col>

        <Col lg={12}>
          <Button
            className="px-4 w-100 fw-bold mt-3 text-secondary bg-button-v2 input-custom"
            variant="primary"
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={loading || !isValid}
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
            onClick={()=> handleRedirectPage()}
            disabled={loading}
          >
            Bỏ qua bước này
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default CreateClassroom;
 