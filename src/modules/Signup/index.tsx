import Image from "next/image";
import React, { useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MALE, TYPE_PARENT, TYPE_ROLE, TYPE_TEACHER } from "src/constant";
import styles from "./signUp.module.scss";

const phoneRegExp = /^(?:\+84|84|0)(3|5|7|8|9|1[2689])[0-9]{8}\b/;

const schema = yup
  .object()
  .shape({
    name: yup.string().required("Vui lòng nhập Họ và Tên"),
    email: yup
      .string()
      .required("Vui lòng nhập email")
      .email("Email không hợp lệ"),
    phone: yup
      .string()
      .required("Vui lòng nhập số điện thoại")
      .matches(phoneRegExp, "SĐT không hợp lệ"),
    role: yup.string().required("Vui lòng chọn vai trò"),
  })
  .required();

const SignUp = (props: any) => {
  const { onSubmitSection, loading } = props;
  const {
    register,
    control,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      gender: MALE,
      email: "",
      phone: "",
      role: null,
    },
  });

  const onSubmit = (data: any) => {
    onSubmitSection("verifyOtp", data);
  };

  return (
    <Col lg={5} className="px-8 pt-7 bg-white rounded-left-16">
      <Image
        src={`${global.pathSvg}/logo_monkey_class.svg`}
        width={164}
        height={50}
        className="d-flex"
        alt="Monkey Class"
      />
      <p className="fw-bold fs-3 mt-8">Đăng ký tài khoản</p>
      <div className="d-flex gap-1 py-2">
        <p>Đã có tài khoản?</p>
        <a href="/sign-in" className="text-decoration-underline">
          Đăng nhập
        </a>
      </div>

      <form>
        <Row className="mt-3">
          <Col md={7} className="mb-4">
            <div className="mb-3">
              <Form.Control
                autoFocus
                {...register("name")}
                aria-label="UserName"
                placeholder="Họ và Tên*"
                className="input-custom custom-input"
              />
              {errors?.name?.message && (
                <p className="text-danger-v2 mt-2">{errors?.name?.message}</p>
              )}
            </div>
          </Col>
          <Col md={5} className="mb-4">
            <Controller
              name="gender"
              rules={{ required: true }}
              render={({ field: { onChange, value } }: any) => (
                <Select
                  className="input-custom custom-input"
                  options={TYPE_PARENT}
                  defaultValue={TYPE_PARENT[0]}
                  value={TYPE_PARENT.find(option => option.value === value)}
                  onChange={(option: any) => onChange(option.value)}
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
          </Col>
          <Col md={12} className="mb-4">
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

          <Col md={12} className="mb-4">
            <div className="mb-3">
              <Form.Control
                {...register("phone")}
                aria-label="phone"
                className="input-custom custom-input"
                placeholder="Số điện thoại*"
              />
              {errors.phone?.message && (
                <p className="mt-2 text-danger-v2">{errors.phone?.message}</p>
              )}
            </div>
          </Col>
        </Row>

        <Col md={12} className="mb-4">
          <Controller
            name="role"
            render={({ field: { onChange } }: any) => (
              <Select
                className="input-custom"
                options={TYPE_ROLE}
                placeholder="Chọn vai trò*"
                onChange={option => onChange(option?.value)}
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
          {errors.role?.message && (
          <p className="mt-2 text-danger-v2">{errors.role?.message}</p>
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
      </form>
    </Col>
  );
};

export default SignUp;
