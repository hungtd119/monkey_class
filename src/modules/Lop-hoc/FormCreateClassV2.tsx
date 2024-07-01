import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { Button, Form } from "react-bootstrap";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import useTrans from "src/hooks/useTrans";
import { HTTP_STATUS_CODE_OK, RangeAge } from "src/constant";
import { createClassroomInSchool } from "src/services/common";
import { getRoleAccount, getSchoolId } from "src/selection";
import { useTeacherStore } from "../../stores/teacherStore";
import { useSchoolStore } from "../../stores/schoolStore";

interface FormValues {
  class_name: string | null;
  age: string | null;
  teacher_ids: [] | null;
}

const schema = yup
  .object()
  .shape({
    class_name: yup.string().required("Vui lòng nhập tên lớp"),
    age: yup.string().required("Vui lòng nhập độ tuổi"),
	  teacher_ids: yup.array()
  })
  .required();

const FormCreateClassV2 = (props: any) => {
  const { onClose, setCreateClassSuccess } = props;

  const trans = useTrans();
  const router = useRouter();
  const { s } = router.query;
	const { schoolActive } = useSchoolStore((state: any) => ({
		schoolActive: state.schoolActive,
	}));

  const [isSaving, setIsSaving] = useState(false);
	

  const {
    control,
    handleSubmit,
	  reset,
    formState: { errors },
    register,
  } = useForm<FormValues>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      class_name: "",
      age: "",
	    teacher_ids: []
    },
  });
	const listTeacherAndAdminSchool = useTeacherStore((state: any) => state.listTeacherAndAdminSchool);
	const fetchListTeacherAndAdminSchoolBySchoolID = useTeacherStore(
		(state: any) => state.fetchListTeacherAndAdminSchoolBySchoolID
	);
	
	useEffect (() => {
		fetchListTeacherAndAdminSchoolBySchoolID({school_id: schoolActive.id})
	}, []);

  const onSubmit = (data: any) => {
    const params = {
        ...data,
        school_id: s || getSchoolId(),
        role: getRoleAccount(),
    };
    setIsSaving(true);
    if (data.class_name.trim().length == 0) {
      setIsSaving(false);
      return toast.error("Tên lớp học không được để trống");
    }

    createClassroomInSchool(params)
      .then((res: any) => {
        if (res.meta.code === HTTP_STATUS_CODE_OK) {
          toast.success("Tạo lớp học thành công");
					reset();
	        setCreateClassSuccess(true);
	        setIsSaving(false);
	        onClose();
        } else {
	        setIsSaving(false);
          toast.error("Tạo lớp học thất bại");
        }
      })
      .catch((err: any) => {
	      setIsSaving(false);
        toast.error("Tạo lớp học thất bại");
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <section className="create-classroom">
      <div className="d-flex align-items-center gap-3 mb-8">
        <i
          className="fa fa-angle-left fs-4 me-3 pointer"
          aria-hidden="true"
          onClick={onClose}
        />
        <p className="fw-bold fs-2">Tạo lớp học</p>
      </div>

      <div className="info-wrapper">
        <div className="header-section d-flex align-items-center justify-content-between px-2 fw-bold">
          <p className="fs-2">
            {trans.info_classroom} <span className="danger">*</span>
          </p>
        </div>

        <div className="info-detail px-2 my-2 row">
          <Form.Group className="mb-3 mw-50 fw-bold">
            <Form.Label htmlFor="classroom_name">
              {trans.classroom_name} <span>*</span>
            </Form.Label>
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
          </Form.Group>

          <Form.Group className="mb-3 mw-50 fw-bold">
            <Form.Label htmlFor="age">
              Độ tuổi <span>*</span>
            </Form.Label>
            <Controller
              name="age"
              rules={{ required: "Vui lòng chọn độ tuổi" }}
              render={({ field: { onChange, value } }: any) => (
                <Select
                  placeholder="Chọn độ tuổi"
                  options={RangeAge}
                  onChange={(selectedOption: any) => {
                    onChange(selectedOption ? selectedOption.value : "");
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
              control={control}
            />
            {errors.age?.message && (
              <p className="mt-2 text-danger-v2">
                {errors.age?.message as any}
              </p>
            )}
          </Form.Group>
	        <Form.Group className="mb-3 mw-50 fw-bold">
		        <Form.Label htmlFor="teacher_ids">
			        Giáo viên chủ nhiệm
		        </Form.Label>
		        <Controller
			        name="teacher_ids"
			        render={({ field: { onChange, value } }: any) => (
				        <Select
					        placeholder="Chọn giáo viên chủ nhiệm"
					        isMulti
					        options={listTeacherAndAdminSchool?.map((item: any) => {
										return {
							        value: item.id,
							        label: item.name,
						        };
					        })}
					        onChange={(selectedOption: any) => {
						        onChange(selectedOption ? selectedOption.map((option:any) => option.value) : []);
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
			        control={control}
		        />
		        {errors.teacher_ids?.message && (
			        <p className="mt-2 text-danger-v2">
				        {errors.teacher_ids?.message as any}
			        </p>
		        )}
	        </Form.Group>
        </div>
      </div>

      <div
        className="d-flex justify-content-end gap-6"
        style={{ maxWidth: "95%" }}
      >
        <Button
          variant="danger"
          className="text-white fw-bold"
          onClick={onClose}
        >
          {trans.cancel}
        </Button>
        <Button
          variant="success"
          type="submit"
          className="text-white fw-bold"
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving}
        >
          {isSaving ? "Đang tạo lớp học ..." : "Tạo lớp học"}
        </Button>
      </div>
    </section>
  );
};

export default FormCreateClassV2;
