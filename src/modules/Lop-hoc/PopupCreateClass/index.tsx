import { useEffect } from "react";
import Select from "react-select";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { COURSE_ID, LEARN_MODELS, levelDefault } from "src/constant";
import useTrans from "src/hooks/useTrans";
import { createClassroom } from "src/services/common";
import { toast } from "react-toastify";

type ModalProps = {
  show: boolean;
  onClose: () => void;
};

type FormData = {
  name: string;
  level_id: number | string;
  model_id: number | string;
};

const schema: any = yup
  .object()
  .shape({
    name: yup.string().required("Vui lòng nhập tên lớp"),
    level_id: yup.number().required("Vui lòng chọn cấp độ"),
    model_id: yup.number().required("Vui lòng chọn mô hình"),
  })
  .required();

function PopupCreateClass(props: ModalProps) {
  const { show, onClose } = props;
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    register,
  } = useForm<FormData>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      level_id: "",
      model_id: "",
    }
  });

  const trans = useTrans();

  const onSubmit: SubmitHandler<FormData> = (data: FormData) => {

    const params = {
      school_id: "",
      name: data.name.trim(),
      course_id: COURSE_ID,
      model_id: data.model_id,
      level_id: data.level_id
    }
    createClassroom(params).then((res: any) => {
      if (res && res.meta.code === 200) {
        toast.success("Tạo lớp học thành công");
        onClose();
        handleReset();
      } else {
        toast.error("Tạo lớp học thất bại!");
        onClose();
      }
    })
    .catch((error) => {
      toast.error(error);
    });
    
  };

  useEffect(()=> {
    reset();
    handleReset();
  },[show])

  const handleReset = () => {
    setValue("name", "");
    setValue("level_id", "");
    setValue("model_id", "");
  }

  return (
    <>
      <Modal
        show={show}
        onHide={onClose}
        centered
        keyboard={false}
        backdrop="static"
      >
        <Modal.Header closeButton className="border-0 fw-bold">
          {trans.info_classroom}
        </Modal.Header>

          <Modal.Body className="fw-bold"> 
            <Form.Group className="mb-3">
              <Form.Label htmlFor="classroom_name">
                {trans.classroom_name} <span>*</span>
              </Form.Label>
              <input
                type="text"
                className="form-control"
                placeholder={trans.classroom_name}
                {...register("name")}
              />

              {errors.name?.message && (
                <p className="mt-2 text-danger">
                  {trans.validateForm.classroom_name}
                </p>
              )}
            </Form.Group>

            <Form.Label className="mt-2">
              {trans.rank} <span>*</span>
            </Form.Label>
            <Controller
              name="level_id"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <Select
                  placeholder={trans.selectHolder["choose_level"]}
                  options={levelDefault}
                  // value={value}
                  onChange={(selectedOption: any) => {
                    onChange(selectedOption ? selectedOption.value : ""); // Use an empty string or null based on your requirements
                  }}
                />
              )}
              control={control}
            />
            {errors.level_id?.message && (
              <p className="mt-2 text-danger">{trans.validateForm.level}</p>
            )}

            <Form.Label className="mt-2">
              {trans.model} <span>*</span>
            </Form.Label>

            <Controller
              name="model_id"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <Select
                  placeholder={trans.selectHolder["model"]}
                  options={LEARN_MODELS}
                  // value={value}
                  onChange={(selectedOption: any) => {
                    onChange(selectedOption ? selectedOption.value : ""); // Use an empty string or null based on your requirements
                  }}
                />
              )}
              control={control}
            />

            {errors.model_id?.message && (
              <p className="mt-2 text-danger">{trans.validateForm.model}</p>
            )}
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
              {trans.create_classroom}
            </Button>
          </Modal.Footer>
      </Modal>
    </>
  );
}

export default PopupCreateClass;
