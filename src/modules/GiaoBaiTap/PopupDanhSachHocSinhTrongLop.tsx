import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

interface Student {
  id: number;
  name: string;
}

interface PopupProps {
  show: boolean;
  handleClose: () => void;
  listStudent: Student[];
  onSubmit: (
    checkedStudents?: Record<number, boolean>,
    classroomIndex?: number | null,
    classroomId?: number | null
  ) => void;
  classroomName: string;
  classroomId: number | null;
  classroomIndex?: number | null;
}

const PopupDanhSachHocSinhTrongLop: React.FC<PopupProps> = (props: PopupProps) => {
  const { show, handleClose, listStudent, onSubmit, classroomName, classroomId, classroomIndex } = props;

  const [checkedAll, setCheckedAll] = useState(false);
  const [checkedStudents, setCheckedStudents] = useState<Record<number, boolean>>({});
  const storageKey = `checkedStudents_${classroomId}`; 

  useEffect(() => {
    if (listStudent && classroomId) {
      const storedCheckedStudents = JSON.parse(localStorage.getItem(storageKey) || "{}");

      const initialCheckedStudents: Record<number, boolean> = {};
      listStudent.forEach((student: Student) => {
        initialCheckedStudents[student.id] = storedCheckedStudents[student.id] || false;
      });

      setCheckedStudents(initialCheckedStudents);

      const allChecked = Object.values(initialCheckedStudents).every(
        (isChecked: boolean) => isChecked
      );
      setCheckedAll(allChecked);
    }
  }, [listStudent]);

  const handleCheckboxChange = (studentId: number) => {
    setCheckedStudents((prevCheckedStudents) => {
      const updatedStudents = {
        ...prevCheckedStudents,
        [studentId]: !prevCheckedStudents[studentId],
      };

      const allChecked = Object.values(updatedStudents).every(
        (isChecked: boolean) => isChecked
      );

      setCheckedAll(allChecked);

      return updatedStudents;
    });
  };

  const handleToggleAll = () => {
    setCheckedAll((prevCheckedAll) => {
      const allChecked = !prevCheckedAll;

      const updatedStudents: Record<number, boolean> = {};
      listStudent &&
        listStudent.forEach((student: any) => {
          updatedStudents[student.id] = allChecked;
        });

      setCheckedStudents(updatedStudents);

      return allChecked;
    });
  };

  const handleSave = () => {
    const allFalse = Object.values(checkedStudents).every(
      (value: boolean) => value === false
    );

    if (allFalse) {
      return toast.error("Vui lòng chọn ít nhất 1 học sinh");
    }
    onSubmit(checkedStudents, classroomIndex, classroomId);
    localStorage.setItem(storageKey, JSON.stringify(checkedStudents));
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header
        closeButton
        className="border-0 fw-bold"
        style={{ background: "#D9F7F9" }}
      >
        Giao bài tập
      </Modal.Header>
      <Modal.Body className="list-student">
        <div className="d-flex align-items-center gap-4 mb-4">
          <input
            type="checkbox"
            onChange={handleToggleAll}
            checked={checkedAll}
          />
          Tất cả học sinh
        </div>
        {(listStudent || []).map((student: any) => (
          <div
            key={student.id}
            className="d-flex align-items-center gap-4 mb-4"
          >
            <input
              type="checkbox"
              checked={checkedStudents[student.id] || false}
              onChange={() => handleCheckboxChange(student.id)}
            />
            {student.name}
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="danger" onClick={handleClose}>
          Hủy
        </Button>
        <Button variant="success" type="submit" onClick={handleSave}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PopupDanhSachHocSinhTrongLop;
