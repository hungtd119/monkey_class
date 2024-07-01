import React, { useState } from "react";
import { Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Controller, useForm } from "react-hook-form";
import { TableFormDanhGia } from "../../constant";
import { sendEmail } from "src/services/common";
import { toast } from "react-toastify";

interface ModalProps {
  phase: number;
  show: boolean;
  handleClose: () => void;
}

const FormEvaluate = (props: ModalProps) => {
  const { phase, show, handleClose } = props;

  const { handleSubmit, register, reset, control } = useForm({
    defaultValues: {
      kid_name: "",
      class: "",
      teacher_name: "",
      comment_weaknesses: "",
      comment_strength: "",
      ...Object.fromEntries(
        TableFormDanhGia[`phase${phase}` as keyof typeof TableFormDanhGia]?.map(
          (item: any) => [`objective_${item.id}`, ""]
        )
      ),
    },
  });

  const [selectedLevels, setSelectedLevels] = useState<Array<string>>(
    TableFormDanhGia[`phase${phase}` as keyof typeof TableFormDanhGia]?.map(
      () => ""
    ) || []
  );
  

  const trimObjectValues = (obj: Record<string, any>): Record<string, any> => {
    const trimmedObject: Record<string, any> = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];

        if (typeof value === "string") {
          trimmedObject[key] = value.trim();
        } else if (typeof value === "object" && value !== null) {
          trimmedObject[key] = trimObjectValues(value);
        } else {
          trimmedObject[key] = value;
        }
      }
    }

    return trimmedObject;
  };

  const onSubmit = (data: any) => {
    const objectives: Record<string, string> = {};
  
    TableFormDanhGia[`phase${phase}` as keyof typeof TableFormDanhGia]?.forEach(
      (item: any, index: number) => {
        const checkboxValue = selectedLevels[index];
        objectives[`objective_${item.id}`] =
          typeof checkboxValue === "string"
            ? checkboxValue
            : "";
      }
    );

    const hardData = {
      email_receiver: "thanhtam.tran@monkey.edu.vn ",
      template_slug: `EMAIL_LEARNING_STAGE_${phase}`,
      account_slug: "MC",
      name: "Tran Thanh Tam "
    }
  
    const newDataForm = { ...data, ...objectives, ...hardData};
  
    const trimmedData = trimObjectValues(newDataForm);

    // reset checked checkbox
    const initialCheckboxValues = TableFormDanhGia[
      `phase${phase}` as keyof typeof TableFormDanhGia
    ]?.map(() => "") || [];
  
    setSelectedLevels(initialCheckboxValues);

    sendEmail(trimmedData).then((res: any) => {
      if(res.status === "success") {
        toast.success(res.message);
        handleClose();
        reset();
      } else {
        toast.error(res.message)
      }

    })
    .catch((error: any) => {
      toast.error(error);
    })
    .finally(() => {
      
    });

  };
  

  const handleCheckboxChange = (rowId: number, level: string) => {
    const newSelectedLevels = [...selectedLevels];
  
    newSelectedLevels[rowId] =
      newSelectedLevels[rowId] === level ? "" : level;
  
    setSelectedLevels(newSelectedLevels);
  };
  

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title>
            <img src={`${global.pathSvg}/monkey_login.svg` ?? ""} alt="logo" />
          </Modal.Title>
        </Modal.Header>
        <div className="m-0-auto text-center fw-bold mw-60">
          BẢNG ĐÁNH GIÁ QUÁ TRÌNH HỌC TẬP – GIAI ĐOẠN {phase} LEARNING
          PROGRESSION FOLLOW-UP – STAGE {phase}
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="column-info d-flex flex-column p-4 gap-2 fw-bold">
              <div>
                <label className="min-w-200">Họ tên trẻ/Name:</label>
                <Controller
                  name="kid_name"
                  control={control}
                  render={({ field }) => <input {...field} />}
                />
              </div>
              <div>
                <label className="min-w-200">Lớp/Class:</label>
                <Controller
                  name="class"
                  control={control}
                  render={({ field }) => <input {...field} />}
                />
              </div>
              <div>
                <label className="min-w-200">Giáo viên/ Teacher:</label>
                <Controller
                  name="teacher_name"
                  control={control}
                  render={({ field }) => <input {...field} />}
                />
              </div>
            </div>

            <Table bordered hover responsive className="overflow-auto">
              <thead>
                <tr>
                  <th>STT/No</th>
                  <th className="mw-200">Mục tiêu/ Objectives</th>
                  <th className="min-w-200">
                    Cần cải thiện <p>Need Improvement</p>
                  </th>
                  <th>Đạt Good</th>
                  <th className="min-w-110">
                    Rất tốt
                    <p>Very good</p>{" "}
                  </th>
                  <th>Vượt trội Excellent</th>
                </tr>
              </thead>

              <tbody>
                {TableFormDanhGia[
                  `phase${phase}` as keyof typeof TableFormDanhGia
                ]?.map((item: any, index: number) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td {...register(item.name_input)}>
                      <p className="fw-bold">{item.objective}</p>
                      <p className="text-justify">{item.description}</p>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        onChange={() =>
                          handleCheckboxChange(index, "Need Improvement")
                        }
                        checked={selectedLevels[index] === "Need Improvement"}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange(index, "Good")}
                        checked={selectedLevels[index] === "Good"}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        onChange={() =>
                          handleCheckboxChange(index, "Very Good")
                        }
                        checked={selectedLevels[index] === "Very Good"}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        onChange={() =>
                          handleCheckboxChange(index, "Excellent")
                        }
                        checked={selectedLevels[index] === "Excellent"}
                      />
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={6}>
                    <div className="fw-bold">
                      Nhận xét khác/ Other comments:
                      <div className="d-flex gap-2">
                        <label className="min-w-300" htmlFor="strength">
                          - Điểm nổi trội (Strengths):
                        </label>
                        <textarea
                          id="comment_strength"
                          {...register("comment_strength")}
                          name="comment_strength"
                          rows={3}
                          cols={50}
                        />
                      </div>
                      <div className="d-flex gap-2 mt-3">
                        <label
                          className="min-w-300"
                          htmlFor="comment_weaknesses"
                        >
                          - Điểm cần cải thiện (Weaknesses):
                        </label>
                        <textarea
                          id="comment_weaknesses"
                          {...register("comment_weaknesses")}
                          name="comment_weaknesses"
                          rows={3}
                          cols={50}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="danger" onClick={handleClose}>
              Close
            </Button>
            <Button variant="success" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default FormEvaluate;
