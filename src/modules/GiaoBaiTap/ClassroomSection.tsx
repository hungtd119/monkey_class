// ClassroomSection.tsx
import React from "react";
import DatePicker from "react-datepicker";
import { Col, Form } from "react-bootstrap";
import Image from "next/image";
import { Controller } from "react-hook-form";
import useDeviceDetect from "src/hooks/useDetectDevice";
import { globalPath } from "src/global";

type ClassroomSectionProps = {
  index: number;
  data: any,
  classNames: string[];
  quantityStudentAssigns: string[],
  handleAssignStudent: (index: number, classId: number) => void;
  handleDateStartChange: (date: any, index: number) => void;
  handleDateEndChange: (date: any, index: number) => void;
  handleDeleteAssignClass: (index: number) => void;
  control: any;
  trigger: any;
  errors: any;
  fieldDates: any
};

const ClassroomSection: React.FC<ClassroomSectionProps> = ({
  index,
  data,
  classNames,
  quantityStudentAssigns,
  handleAssignStudent,
  handleDateStartChange,
  handleDateEndChange,
  handleDeleteAssignClass,
  control,
  trigger,
  errors,
  fieldDates
}: ClassroomSectionProps) => {
  const { isMobile } = useDeviceDetect();

  return (
    <div className="description-activity p-7 mb-5" key={data.id}>
            <div className="d-flex justify-content-between">
              <p className="fs-2 text-story fw-bold mb-4">
                {classNames[index]}
              </p>
              <div
                className="d-flex align-items-center gap-1"
                onClick={() => handleDeleteAssignClass(index)}
              >
                <Image
                  className=""
                  src={`${globalPath.pathSvg}/icon-remove.svg`}
                  width={32}
                  height={32}
                  alt="icon_plus"
                />
                <p className="pointer">Bỏ lớp học</p>
              </div>
            </div>
            
            <div className="d-flex justify-content-center container">
              <Col md={9} sm={12} className="mb-5">
                <Form.Label className="fw-bold text-story">
                  Danh sách học sinh <span>*</span>
                </Form.Label>
                <div className="input-assign d-flex align-items-center justify-content-between p-4">
                  <p className="text-story fw-bold">
                    {quantityStudentAssigns[index]}
                  </p>
                  <Image
                    src={`${globalPath.pathSvg}/edit.svg`}
                    width={24}
                    height={24}
                    alt="edit"
                    onClick={() =>
                      handleAssignStudent(index, data.id_classroom)
                    }
                  />
                </div>
              </Col>
            </div>
            <div
              className={`d-flex justify-content-center container ${
                isMobile ? "flex-column gap-5" : "gap-72"
              }`}
            >
              <Col md={4} className="d-flex flex-column">
                <Form.Label
                  className="fw-bold text-story"
                  htmlFor={`time_start_${index}`}
                >
                  Ngày bắt đầu <span>*</span>
                </Form.Label>
                <Controller
                  control={control}
                  name={`classrooms[${index}].time_start` as any}
                  render={({ field }: any) => (
                    <DatePicker
                      key={`start-${index}`}
                      onChange={(date: any) => {
                        handleDateStartChange(date, index);
                        field.onChange(date);
                        trigger(`classrooms[${index}].time_start` as any);
                      }}
                      selected={fieldDates[index]?.startDate}
                      onBlur={field.onBlur}
                      minDate={new Date()}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Chọn ngày bắt đầu"
                      className="form-control"
                    />
                  )}
                />
                {errors?.classrooms?.[index]?.time_start && (
                  <p className="mt-2 text-danger">
                    {errors?.classrooms?.[index]?.time_start?.message}
                  </p>
                )}
              </Col>

              <Col md={4} className="d-flex flex-column">
                <Form.Label
                  className="fw-bold text-story"
                  htmlFor={`time_end_${index}`}
                >
                  Ngày hết hạn <span>*</span>
                </Form.Label>
                <Controller
                  control={control}
                  name={`classrooms[${index}].time_end` as any}
                  render={({ field }: any) => (
                    <DatePicker
                      key={`end-${index}`}
                      onChange={(date: any) => {
                        handleDateEndChange(date, index);
                        field.onChange(date);
                        trigger(`classrooms[${index}].time_end` as any);
                      }}
                      selected={fieldDates[index]?.endDate}
                      onBlur={field.onBlur}
                      minDate={
                        fieldDates[index]?.startDate
                          ? new Date(
                              fieldDates[index]?.startDate.getTime() + 86400000
                            )
                          : undefined
                      }
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Chọn ngày hết hạn"
                      className="form-control"
                    />
                  )}
                />
                {errors?.classrooms?.[index]?.time_end && (
                  <p className="mt-2 text-danger">
                    {errors?.classrooms?.[index]?.time_end?.message}
                  </p>
                )}
              </Col>
            </div>
          </div>
  );
};

export default ClassroomSection;
