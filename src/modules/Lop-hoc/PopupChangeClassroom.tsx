import { yupResolver } from "@hookform/resolvers/yup";
import { nunito } from "@styles/font";
import React, { useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import useTrans from "src/hooks/useTrans";
import * as yup from "yup";

const schema: any = yup.object().shape({
  classroom_id: yup.number().required("Vui lòng chọn lớp học"),

  });

const PopupChangeClassroom = (props: any) => {
  const { show, onClose, dataClassroom, onSubmit } = props;
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),

    defaultValues: {
      classroom_id: "",
    },
  });
  
  const trans = useTrans();
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      keyboard={false}
      backdrop="static"
      className={nunito.className}
    >
      <Modal.Header closeButton className="border-0 fw-bold fs-2" style={{background: '#D9F7F9'}}>
        Chuyển lớp
      </Modal.Header>
      <Modal.Body>
      <Form.Group className="mb-3 mw-50 fw-bold">
            <Form.Label htmlFor="classroom_id">
            Chọn lớp học <span>*</span>
            </Form.Label>
            <Controller
              name="classroom_id"
              rules={{ required: true }}
              render={({ field: { onChange } }: any) => (
                <Select
                  placeholder="Chọn lớp học"
                  options={dataClassroom}
                  onChange={(selectedOption: any) => {
                    onChange(selectedOption ? selectedOption.value : "");
                  }}
                />
              )}
              control={control}
            />

            {errors.classroom_id?.message && (
              <p className="mt-2 text-danger">{errors.classroom_id?.message}</p>
            )}
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
            >
              {trans.save}
            </Button>
          </Modal.Footer>
    </Modal>
  );
};

export default PopupChangeClassroom;
