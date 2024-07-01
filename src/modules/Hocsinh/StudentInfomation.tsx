import React, { useEffect, useState } from 'react'
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from 'react-hook-form';
import { Button, Col, Form, Image } from 'react-bootstrap';
import useTrans from 'src/hooks/useTrans';
import { useRouter } from 'next/router';
import { useStudentStore } from 'src/stores/studentStore';
import * as yup from "yup";
import { checkTypeAccount, getSchoolId } from 'src/selection';
import { updateStudent, updateStudentV2 } from 'src/services/common';
import { toast } from 'react-toastify';
import { TYPE_ACCOUNT_TEACHER } from 'src/constant';
import { globalPath } from 'src/global';
import ReactDatePicker from 'react-datepicker';

const phoneRegExp = /([+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/;
interface FormValues {
    name: string | null;
    date_of_birth: number | null;
    gender: number | null;
    parent_name: string | null;
    parent_phone: string | null;
    parent_email: string | null;
}
const schema: any = yup
    .object()
    .shape({
        name: yup.string().required("Vui lòng nhập tên học sinh"),
        date_of_birth: yup.string().required("Vui lòng chọn ngày sinh"),
        gender: yup.number().required("Vui lòng giới tính"),
        parent_name: yup.string().required("Vui lòng nhập tên bố/ mẹ"),
        parent_email: yup
            .string()
            .email("Email không hợp lệ"),
        parent_phone: yup
            .string()
            .required("Vui lòng nhập SĐT phụ huynh")
            .matches(phoneRegExp, "SĐT không hợp lệ"),
    })
    .required();
const StudentInfomation = (props: any) => {
    const { detailStudent } = props;
    const router = useRouter();
    const trans = useTrans();
    const { id, class_id } = router.query;

    const [typeAccount, setTypeAccount] = useState(null);

    const infoClassroom = useStudentStore((state: any) => state.infoClassroom);

    const [disabledFormEditInfoStudent, setDisabledFormEditInfoStudent] =
        useState(true);
    const [disabledFormEditInfoParent, setDisabledFormEditInfoParent] =
        useState(true);

    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const {
        handleSubmit,
        control,
        formState: { errors },
        watch,
        setValue,
        register,
    } = useForm<FormValues>({
        mode: "onChange",
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            gender: null,
            date_of_birth: null,
            parent_name: "",
            parent_email: "",
            parent_phone: "",
        },
    });
    useEffect(() => {
        if (detailStudent) {
            const dateOfBirth = detailStudent.date_of_birth
                ? new Date(detailStudent.date_of_birth * 1000)
                : null;
            setValue("name", detailStudent.name);
            setValue("date_of_birth", dateOfBirth?.getTime() || null);
            setValue("gender", detailStudent.gender);
            setValue("parent_name", detailStudent.parent_name);
            setValue("parent_phone", detailStudent.phone);
            setValue("parent_email", detailStudent.email);
            setSelectedDate(dateOfBirth);
        }
    }, [detailStudent, setValue]);

    useEffect(() => {
        setTypeAccount(checkTypeAccount());
    }, []);

    const viewDetailClass = () => {
        router.push('/thong-tin-lop-hoc/' + infoClassroom?.id);
    };

    const onSubmit = (data: any) => {
        setIsSaving(true);
        const dateOfBirth = new Date(data.date_of_birth);
        const isDateValid = !isNaN(dateOfBirth.getTime());
        const params = {
            ...data,
            date_of_birth: isDateValid ? dateOfBirth.getTime() / 1000 : selectedDate?.getTime() / 1000,
            id: Number(id),
	          school_id:Number(getSchoolId())
        };

        updateStudentV2(params)
            .then((res: any) => {
                setIsSaving(false);
                if (res.code === 200) {
                    toast.success(res.message);
                    if (class_id !== "undefined") {
                        router.push("/chi-tiet-lop-hoc/" + class_id);
                    }
                    else {
                        router.push("/danh-sach-hoc-sinh/");
                    }
                } else {
                    toast.error("Đã có lỗi xảy ra");
                }
            })
            .catch((error) => {
                setIsSaving(false);
                console.log(error);
            });
    };

    const handleDateChange = (date: any) => {
        setSelectedDate(date);
    };
    return (
        <>
            <div className="detail-student p-5 mb-7">
                <div className="">
                    <div className="d-flex align-items-center justify-content-between px-2 fw-bold">
                        <p className="title">Thông tin học sinh</p>
                        {
                            typeAccount !== TYPE_ACCOUNT_TEACHER ? <Image
                                src={`${globalPath.pathSvg}/edit.svg`}
                                width={24}
                                height={24}
                                alt="edit"
                                onClick={() => setDisabledFormEditInfoStudent(false)}
                            /> : <></>
                        }
                    </div>

                    <div className="info-detail px-2 my-2 mt-5 row">
                        <Col md={6}>
                            <Form.Group className="mb-3 mw-50 fw-bold">
                                <Form.Label htmlFor="name">
                                    Tên học sinh <span>*</span>
                                </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    defaultValue={detailStudent?.name || ""}
                                    placeholder="Tên học sinh"
                                    {...register("name")}
                                    disabled={disabledFormEditInfoStudent}
                                />

                                {errors.name?.message && (
                                    <p className="mt-2 text-danger">{errors.name?.message}</p>
                                )}
                            </Form.Group>
                        </Col>

                        <Col md={6} sm={6}>
                            <Form.Group className="mb-3 fw-bold">
                                <Form.Label htmlFor="classroom_name">
                                    {trans.gender} <span>*</span>
                                </Form.Label>
                                <div className="d-flex align-items-center">
                                    <div className="d-flex align-items-center gap-1 me-4">
                                        <span>Nam</span>

                                        <input
                                            type="radio"
                                            id="male"
                                            value={1}
                                            {...register("gender")}
                                            checked={watch("gender") === 1}
                                            onChange={() => setValue("gender", 1)}
                                            disabled={disabledFormEditInfoStudent}
                                        />
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <span>Nữ</span>

                                        <input
                                            type="radio"
                                            id="female"
                                            {...register("gender")}
                                            checked={watch("gender") === 0}
                                            disabled={disabledFormEditInfoStudent}
                                            value={0}
                                            onChange={() => setValue("gender", 0)}
                                        />
                                    </div>
                                </div>

                                {errors?.gender?.message && (
                                    <p className="mt-2 text-danger">
                                        {trans.validateForm.gender}
                                    </p>
                                )}
                            </Form.Group>
                        </Col>
                        <Col md={6} className="my-4">
                            <Form.Group className="mb-3 mw-50 fw-bold">
                                <Form.Label htmlFor="date_of_birth" className="me-4">
                                    Ngày sinh <span>*</span>
                                </Form.Label>
                                <Controller
                                    control={control}
                                    name="date_of_birth"
                                    render={({ field }: any) => (
                                        <ReactDatePicker
                                            onChange={(date: any) => {
                                                handleDateChange(date);
                                                field.onChange(date);
                                            }}
                                            selected={selectedDate}
                                            onBlur={field.onBlur}
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText="Chọn ngày"
                                            className="form-control"
                                            disabled={disabledFormEditInfoStudent}
                                        />
                                    )}
                                />
                                {errors?.date_of_birth?.message && (
                                    <p className="mt-2 text-danger">
                                        {errors?.date_of_birth?.message}
                                    </p>
                                )}
                            </Form.Group>
                        </Col>
                    </div>
                </div>
            </div>

            <div className="detail-student p-5 mb-7">
                <div className="">
                    <div className="d-flex align-items-center justify-content-between px-2 fw-bold">
                        <p className="title">Thông tin phụ huynh</p>
                        {
                            typeAccount !== TYPE_ACCOUNT_TEACHER ? <Image
                                src={`${globalPath.pathSvg}/edit.svg`}
                                width={24}
                                height={24}
                                alt="edit"
                                onClick={() => setDisabledFormEditInfoParent(false)}
                            /> : <></>
                        }
                    </div>

                    <div className="info-detail px-2 my-2 mt-5 row">
                        <Col md={6}>
                            <Form.Group className="mb-3 mw-50 fw-bold">
                                <Form.Label>
                                    Tên bố/ mẹ <span>*</span>
                                </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tên bố/ mẹ"
                                    {...register("parent_name")}
                                    disabled={disabledFormEditInfoParent}
                                />

                                {errors.parent_name?.message && (
                                    <p className="mt-2 text-danger">
                                        {errors.parent_name?.message}
                                    </p>
                                )}
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3 mw-50 fw-bold">
                                <Form.Label htmlFor="teacher_email">
                                    SĐT phụ huynh <span>*</span>
                                </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    disabled={disabledFormEditInfoParent}
                                    placeholder="SĐT phụ huynh"
                                    {...register("parent_phone")}
                                />
                                {errors?.parent_phone?.message && (
                                    <p className="mt-2 text-danger">
                                        {errors?.parent_phone?.message}
                                    </p>
                                )}
                            </Form.Group>
                        </Col>

                        <Col md={6} className="">
                            <Form.Group className="mb-3 mw-50 fw-bold">
                                <Form.Label htmlFor="teacher_email">
                                    Email bố/ mẹ
                                </Form.Label>
                                <input
                                    type="text"
                                    className="form-control"
                                    defaultValue={detailStudent?.email}
                                    disabled={disabledFormEditInfoParent}
                                    placeholder="Email bố/ mẹ"
                                    {...register("parent_email")}
                                />
                                {errors?.parent_email?.message && (
                                    <p className="mt-2 text-danger">
                                        {errors?.parent_email?.message}
                                    </p>
                                )}
                            </Form.Group>
                        </Col>
                    </div>
                </div>
            </div>

            <div className="detail-student p-5">
                <div className="">
                    <div className="d-flex align-items-center justify-content-between px-2 fw-bold">
                        <p className="title">Lớp học</p>
                        {
                            typeAccount !== TYPE_ACCOUNT_TEACHER ? <Image
                                src={`${globalPath.pathSvg}/edit.svg`}
                                width={24}
                                height={24}
                                alt="edit"
                            // onClick={() => handleEditFormInfoClass()}
                            /> : <></>
                        }
                    </div>

                    <div className="info-detail px-2 my-2 mt-5 row">
                        <Col md={6}>
                            <div className="mb-3 mw-50 fw-bold">
                                <p>Tên lớp: {infoClassroom?.name}</p>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div
                                className="d-flex align-items-center mb-3 mw-50"
                                onClick={() => viewDetailClass()}
                            >
                                <Image
                                    src={`${globalPath.pathSvg}/icon-info.svg`}
                                    width={38}
                                    height={38}
                                    alt="info"
                                />
                                <p className="text-decoration-underline pointer">
                                    Xem thông tin lớp học
                                </p>
                            </div>
                        </Col>

                        <Col md={6}>
                            <div className="d-flex align-items-center gap-3">
                                <Image
                                    src={`${globalPath.pathSvg}/icon-online.svg`}
                                    width={12}
                                    height={12}
                                    alt="active"
                                />
                                <p style={{ fontStyle: "italic" }}>Đang hoạt động</p>
                            </div>
                        </Col>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-end gap-6 mt-7">
                {
                    typeAccount !== TYPE_ACCOUNT_TEACHER ? <Button
                        variant="success"
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSaving}
                    >
                        {
                            isSaving ? "Đang lưu ..." : "Cập nhật thông tin"
                        }
                    </Button> : <></>
                }
            </div>
        </>
    )
}

export default StudentInfomation
