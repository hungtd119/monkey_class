import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import useTrans from "src/hooks/useTrans";
import * as yup from "yup";
import { nunito } from "@styles/font";

const phoneRegExp = /^(?:\+84|84|0)(3|5|7|8|9|1[2689])[0-9]{8}\b/;

const schema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập tên học sinh"),
  date_of_birth: yup.string().required("Vui lòng nhập ngày sinh"),
  gender: yup.string().required("Vui lòng chọn giới tính"),
  phone: yup
    .string()
    .required("Vui lòng nhập số điện thoại")
    .matches(phoneRegExp, "SĐT không hợp lệ"),
  parent_name: yup.string().required("Vui lòng nhập tên bố/ mẹ"),
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),
}).required();


const PopupAddStudent = (props: any) => {
  const { show, onClose, onSubmit, isSaving } = props;
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      date_of_birth: "",
      gender: null,
      phone: "",
      parent_name: "",
      email: "",
      identifier_code: "",
    },
  });

  const trans = useTrans();

  useEffect(() => {
    reset();
  },[])

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      keyboard={false}
      backdrop="static"
      className={nunito.className}
    >
      <Modal.Header closeButton className="border-0 fw-bold" style={{background: "#D9F7F9"}}>
        Thêm học sinh
      </Modal.Header>

      <Modal.Body className="fw-bold">
        <Form.Group className="mb-3">
          <Form.Label htmlFor="classroom_name">Tên học sinh <span>*</span></Form.Label>
          <input
            type="text"
            autoFocus
            className="form-control"
            placeholder="Nhập tên học sinh"
            {...register("name")}
          />

          {errors.name?.message && (
            <p className="mt-2 text-danger">
              {errors.name?.message}
            </p>
          )}
        </Form.Group>

        <Form.Group className="mb-3 fw-bold">
          <div className="d-flex align-items-center">
            <Form.Label className="min-w-110">
              {trans.gender} <span>*</span>
            </Form.Label>

            <div className="d-flex align-items-center mb-2">
              <div className="d-flex align-items-center gap-1 me-4">
                <span>Nam</span>
                <input
                  type="radio"
                  id="male"
                  value={1}
                  {...register("gender")}
                />
              </div>
              <div className="d-flex align-items-center gap-2">
                <span>Nữ</span>
                <input
                  type="radio"
                  id="female"
                  value={0}
                  {...register("gender")}
                />
              </div>
            </div>
          </div>

          {errors.gender?.message && (
            <p className="mt-2 text-danger">{errors.gender?.message}</p>
          )}
        </Form.Group>

        <Form.Group className="mb-3 fw-bold">
          <Form.Label htmlFor="date_of_birth">
            {trans.birthday} <span>*</span>
          </Form.Label>
          <input
            type="date"
            className="form-control"
            placeholder={trans.birthday}
            {...register("date_of_birth")}
          />

          {errors.date_of_birth?.message && (
            <p className="mt-2 text-danger">
              {errors.date_of_birth?.message}
            </p>
          )}
        </Form.Group>

        <Form.Group className="mb-3 fw-bold">
          <Form.Label htmlFor="parent_name">
            {trans.name_parent} <span>*</span>
          </Form.Label>
          <input
            type="text"
            className="form-control"
            {...register("parent_name")}
          />

          {errors.parent_name?.message && (
            <p className="mt-2 text-danger">{trans.validateForm.name_parent}</p>
          )}
        </Form.Group>

        <Form.Group className="mb-3 fw-bold">
          <Form.Label htmlFor="phone">
            {trans.phone_parent} <span>*</span>
          </Form.Label>
          <input
            type="text"
            className="form-control"
            {...register("phone")}
          />

          {errors.phone?.message && (
            <p className="mt-2 text-danger">
              {errors.phone?.message}
            </p>
          )}
        </Form.Group>

        <Form.Group className="mb-3 fw-bold">
          <Form.Label htmlFor="phone_parent">
            {trans.email_parent} <span>*</span>
          </Form.Label>
          <input
            type="text"
            className="form-control"
            {...register("email")}
          />

          {errors.email?.message && (
            <p className="mt-2 text-danger">
              {errors.email?.message}
            </p>
          )}
        </Form.Group>

        <Form.Group className="mb-3 fw-bold">
          <Form.Label htmlFor="identifier_code">
            {trans.code_active_account}
          </Form.Label>
          <input
            type="text"
            className="form-control"
            {...register("identifier_code")}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="border-0 d-flex gap-4 p-2">
        <Button
          variant="button"
          onClick={onClose}
          className="p-2 text-white fw-bold"
        >
          {trans.cancel}
        </Button>
        <Button
          variant="done"
          onClick={handleSubmit(onSubmit)}
          className="p-2 text-white fw-bold"
          disabled={isSaving}
        >
          {
            isSaving ? "Đang thêm ..." : trans.save
          }
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PopupAddStudent;
