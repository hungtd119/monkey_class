import { faChevronRight, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { error } from "console";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import Select from "react-select";
import Loading from "src/components/Loading";
import SelectCus from "src/components/SelectCus";
import TableListAttendence from "src/components/TableListAttendence/TableListAttendence";
import { months } from "src/constant";
import useTrans from "src/hooks/useTrans";
import { getListAttendence } from "src/services/common";
import formatTimestamp from "src/utils/formatTimestamp";
import styles from "./PopupAttendenceStudent.module.scss";
import { nunito } from "@styles/font";
import Image from "next/image";
import { getToken } from "../../../selection";

const PopupAttendenceStudent = (props: any) => {
  const router = useRouter();
  const { id } = router.query;
  const { show, onClose } = props;

  const [listAttendence, setListAttendence] = useState<any>([]);
  const [dateAttendence, setDateAttendence] = useState<any>(months.find(month => month.index === new Date().getMonth()));
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeSelectMonth = (selectedOption: any) => {
    setDateAttendence(selectedOption);
    const params = { class_id: id, date_attendance: selectedOption.value }
    fetchListAttendence(params);
  }
  const fetchListAttendence = async (params: any) => {
    setIsLoading(true);
    try {
      const res = await getListAttendence(params);
      if (res?.code === 200) {
        const listAttendence = res?.data;
        const listAttendenceMapped = Object.keys(listAttendence)
          .filter(attendence => listAttendence[attendence] != null)
          .map(key => ({
            key,
            data: listAttendence[key]
          })).sort((a: any, b: any) => b.key - a.key);

        setListAttendence(listAttendenceMapped);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  useEffect(() => {
    const params = { class_id: id, date_attendance: dateAttendence.value }
    fetchListAttendence(params);
  }, [])
  
  const exportDataClass = () => {
    const params = {
      class_id: (id || '').toString(),
      date_attendance: dateAttendence.value,
      type: '1',
    };
    const token  = getToken();
    const query = new URLSearchParams(params).toString();
    const url = `${process.env.NEXT_PUBLIC_API_CLASSROOM}export-attendance-by-class-id?token=${token}&${query}`;
    window.location.href = url;
  };
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      keyboard={false}
      backdrop="static"
      size="xl"
      className={`${nunito.className} modal-rounded`}
    >
      <Modal.Header closeButton className={`border-0 fw-bold ${styles.p_32}`}>
        <SelectCus
          options={months}
          defaultValue={dateAttendence}
          onChange={handleChangeSelectMonth}
        />
        <Button
            variant="success-v3"
            className="text-white fw-bold ms-2"
            onClick={() => exportDataClass()}
        >
          <Image
              src={`${global.pathSvg}/document-text.svg`}
              width={20}
              height={20}
              alt="icon"
              className="me-2"
          />
          Xuất dữ liệu
        </Button>
      </Modal.Header>
      <Modal.Body className={`body-limit-sroll-height ${styles.p_0_32}`}>
        {
          isLoading ? <div style={{ height: "400px" }} className="d-flex align-items-center justify-content-center">
            <Loading />
          </div> : <TableListAttendence listAttendence={listAttendence} />
        }
      </Modal.Body>
      <Modal.Footer className="border-0 d-flex gap-4 p-2">
        <div style={{ height: "50px" }}>

        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default PopupAttendenceStudent;
