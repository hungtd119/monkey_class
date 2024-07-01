import React, { useRef, useState } from "react";
import { nunito } from "@styles/font";
import { Button, Col, Form, Modal } from "react-bootstrap";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import OptionAddStudent from "../../../components/OptionAddStudent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forEach, set } from "lodash";
import readXlsxFile from "read-excel-file";
import { importStudentByExcel, importStudentByExcelV2 } from "src/services/common";
import { getSchoolId } from "src/selection";
import { error } from "console";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import styles from "./PopupImportStudents.module.scss";
import { faCancel, faUpload, faXmark } from "@fortawesome/free-solid-svg-icons";

const PopupImportStudents = (props: any) => {
  const router = useRouter();
  const {
    show,
    onClose,
    setIsUploading,
    setProcess,
    setResult,
    setCreateStudent,
    classId,
  } = props;
  const [file, setFile] = useState<any>();
  const [messageErr, setMessageErr] = useState<any>([]);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [messErr, setMessErr] = useState<[]>([]);
  const ref = useRef<any>();
  const handleFileChange = (e: any) => {
    const file = e.target.files;
    if (file.length > 0) {
      setFile(file);
    }
  };

  const validateRowsImportData = (rows: any) => {
    let result = true;
    forEach(rows, (row, rowIndex) => {
      forEach(row, (cell, celIndex) => {
        if (cell === "" || cell === null || cell === undefined) {
          result = false;
          setMessageErr((prev: any) => [
            ...prev,
            { x: rowIndex + 1, y: celIndex + 1 },
          ]);
        }
      });
    });
    return result;
  };
  const handleClickSubmitFile = () => {
    setIsUploadingFile(true);
    setMessageErr([]);
    if (file) {
      const formData = new FormData();
      formData.append("file", file[0]);
      formData.append("school_id", getSchoolId());
      formData.append("class_id", classId);
      importStudentByExcelV2(formData)
        .then((res) => {
          setIsUploadingFile(false);
          if (res?.code === 200) {
            toast.success(res?.message);
            onClose();
            setCreateStudent(true);
          }
        })
        .catch((error) => {
          setIsUploadingFile(false);
          setMessErr(error.response.data?.errors);
          toast.error(error.response.data?.errors);
        });
    } else {
      setIsUploadingFile(false);
      toast.error("Vui lòng chọn file để tải lên");
    }
  };
  return (
    <Modal
      show={show}
      centered
      keyboard={false}
      onHide={onClose}
      backdrop="static"
      size="lg"
      className={`${nunito.className} modal-rounded-0`}
    >
      <Modal.Header
        closeButton
        className={`border-0 fw-bold ${styles.p_32_32_0_32} pb-4`}
        style={{ backgroundColor: "#D9F7F9" }}
      >
        <div
          className="h3 fw-bold text-center w-100"
          style={{ color: "#383838", fontWeight: "800" }}
        >
          Tải lên danh sách học sinh
        </div>
      </Modal.Header>
      <Modal.Body className={`${styles.p_0_32} py-6 px-7`}>
        <div>
          <div className="h5">
            Để đảm bảo độ chính xác, vui lòng điền thông tin danh sách học sinh
            theo biểu mẫu sau:{" "}
            <FontAwesomeIcon
              icon={faFileLines}
              color={"#3393FF"}
              className="me-1"
            />
            <a
              href={
                "https://docs.google.com/spreadsheets/d/e/2PACX-1vQoXZsGptC1DApI-zJT5vU72x8mmFZMQ_Qs_0rTEvW4CgHwLiRRzlKf55affzJeRPqfbi1CgcFgCJp-/pub?output=xlsx"
              }
              target="_blank"
              className={"text-decoration-underline"}
              style={{
                color: "#3393FF",
                fontSize: "16px",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              Danh sách học sinh.xlsx
            </a>
          </div>
          <div>
            <Form.Group controlId="formFileMultiple" className="my-6">
              <div style={{ position: "relative", height: "30px" }}>
                <label
                  htmlFor="file"
                  className={`${styles.label_file} d-flex align-items-center pointer`}
                  style={{ color: "#3393FF" }}
                >
                  <FontAwesomeIcon
                    icon={faUpload}
                    color="#3393FF"
                    className="me-1"
                  />
                  <p className="h5 m-0">Tải lên</p>
                </label>
                <div className={styles.show_file}>
                  {file ? (
                    <div className={`${styles.item_file_wp}`}>
                      <div className={`${styles.item_file}`}>
                        <FontAwesomeIcon
                          icon={faFileLines}
                          className="me-1 my-1 h5"
                        />
                        <p className="text-decoration-underline ">
                          {file[0]?.name}
                        </p>
                        <FontAwesomeIcon
                          icon={faXmark}
                          className="my-1 ms-4 pointer float-end "
                          color="#FF4B4B"
                          onClick={() => {
                            setMessErr([])
                            setFile(null);
                            ref.current.value = "";
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="px-3 py-3 h5">Chưa chọn file</div>
                  )}
                </div>
                <input
                  className={styles.input_file}
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  ref={ref}
                />
              </div>
            </Form.Group>
          </div>
          <div className="pt-4 pb-3 px-3">
            {messErr.map((mess: any, index: number) => (
              <div className="h6" style={{ color: "#FF4B4B" }} key={index}>
                {mess}. Vui lòng bổ sung thông tin và thử lại
              </div>
            ))}
          </div>
          <div className="row gap-6 px-3 mt-2">
            <Button
              className="col"
              style={{
                fontSize: "20px",
                fontWeight: "700px",
                borderRadius: "8px",
                border: "1px solid #AFAFAF",
                color: "#777777",
              }}
              onClick={onClose}
            >
              Quay lại
            </Button>
            <Button
              className="col py-4 text-white"
              style={{
                backgroundColor: "#92C73D",
                fontSize: "20px",
                fontWeight: "700px",
                borderRadius: "8px",
              }}
              onClick={handleClickSubmitFile}
              disabled={isUploadingFile}
            >
              {isUploadingFile ? "Đang tải lên..." : "Xác nhận"}
            </Button>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 d-flex gap-4 p-2"></Modal.Footer>
    </Modal>
  );
};

export default PopupImportStudents;
