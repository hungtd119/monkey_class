import { nunito } from "@styles/font";
import React, {useState} from "react";
import {Button, Modal, Table} from "react-bootstrap";
import Loading from "src/components/Loading";
import { STATUS_DONE } from "src/constant";

const HomeworkRow = ({ data,level, handleShowModal  }: any) => (
    <tr>
        <td>{level + 1}</td>
        <td>{data?.student_name}</td>
        <td className="status-homework">
            <input type="checkbox" checked={data?.worked === STATUS_DONE}/>
        </td>
        <td>
            {data?.worked === STATUS_DONE ?
                <div>{data?.process?.final?.num_correct_answer ?? 0}/{data?.process?.final?.total_questions ?? 0}</div> : 0}
        </td>
        <td className="pointer" onClick={() => handleShowModal({
            practices: data?.process?.practices,
            studentName: data?.student_name
        })}>{data?.process?.practices.length ?? 0}</td>
    </tr>
);

const PopupProgressHomeWork = (props: any) => {
    const {show, handleClose, progessHomework, fetchingProgressHomework} =
        props;
    const [showPractice, setShowPractice] = useState(false);
    const [practices, setPractices] = useState([])
    const [studentName, setStudentName] = useState("")

    const handleClosePractice = () => {
        setShowPractice(false);
    }

    const handleShowModal = (data:any) => {
        setShowPractice(true);
        setPractices(data.practices);
        setStudentName(data.studentName);

    }

    return (
        <div>
            <Modal
                show={show}
                onHide={handleClose}
                centered
                size="lg"
                backdrop="static"
                keyboard={false}
                className={nunito.className}
            >
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold text-story">
                        Tiến độ làm bài
                    </Modal.Title>
                </Modal.Header>
                {!fetchingProgressHomework ? (
                    <Modal.Body className="body-progress">
                        <Table bordered hover responsive className="text-center mb-8">
                            <thead>
                            <tr>
                                <th>Xếp hạng</th>
                                <th>Học sinh</th>
                                <th>Hoàn thành đúng hạn</th>
                                <th>Số câu đúng</th>
                                <th>Số lần luyện tập</th>
                            </tr>
                            </thead>
                            <tbody>
                            {progessHomework?.length > 0 ? (
                                progessHomework.map((data: any, index: number) => (
                                    <HomeworkRow key={index} data={data} level={index} handleShowModal={handleShowModal}/>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3}>Không có dữ liệu</td>
                                </tr>
                            )}
                            </tbody>
                        </Table>

                    </Modal.Body>
                ) : (
                    <div className="m-5">
                        <Loading/>
                    </div>
                )}
            </Modal>

            {showPractice && (
                <Modal centered
                       size="lg"
                       backdrop="static"
                       keyboard={false}
                       show={true}
                       className={nunito.className}
                       >
                    <Modal.Header>
                        <Modal.Title>
                            <h3>{studentName}</h3>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            practices && practices.length > 0 ? <Table bordered hover responsive className="text-center mb-8">
                                <tr>
                                    <th>Ngày làm bài</th>
                                    <th>Số câu đúng</th>
                                </tr>
                                {
                                    practices.map((practice: any, index: number) => (
                                        <tr key={index}>
                                            <td>{practice.updated_at ? new Date(practice?.updated_at * 1000).toLocaleDateString() : practice?.updated_at }</td>
                                            <td>{practice?.num_correct_answer}/{practice?.total_questions}</td>
                                        </tr>
                                    ))
                                }
                            </Table> : <div style={{height: "200px", fontWeight: "500", fontSize: "18px"}}
                                            className="d-flex justify-content-center align-items-center">
                                Chưa có lịch sử làm bài
                            </div>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClosePractice}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default PopupProgressHomeWork;
