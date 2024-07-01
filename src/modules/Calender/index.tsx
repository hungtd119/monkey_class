import { Button, Card, Col, Container, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getLearningLessons, getModelIDByClassCourse, updateStatusLearningLesson } from "../../services/common";
import Loading from "../../components/Loading";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactPaginate from "react-paginate";
import { faEdit, faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import PopupUpdateStatus from "./PopupUpdateStatus";
import { toast } from "react-toastify";
import {
    COURSE_ID,
    LEARNING_LESSON_ACTIVE,
    LEARNING_LESSON_INACTIVE, LESSON_OF_55,
    MODE_OFFFLINE_40,
    MODE_OFFFLINE_55
} from "src/constant";

const Calender = () => {
    const router = useRouter();
    const { id, p } = router.query;
    const [modelID, setModelID] = useState(MODE_OFFFLINE_40);
    const [learningLessons, setLearningLessons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(p ? Number(p) : 1);
    const [perPage, setPerpage] = useState(34);
    const [total, setTotal] = useState(0);
    const [showPopupUpdateStatus, setShowPopUpUpdateStatus] = useState(false);
    const [dataLearningLesson, setDataLearningLesson] = useState<any>({ id: null, status: null })


    useEffect(() => {
        setLoading(true);
        getLearningLessons({ class_id: id, page, per_page: perPage }).then((res: any) => {
            if (res.code === 200) {
                setLearningLessons(res.data.data);
                setTotal(res.data.total);
                setPerpage(res.data.per_page);
                setLoading(false);
            }
        }).catch((error) => {
            console.log(error);
        }).finally(() => setLoading(false));
    }, [id, page]);

    const handleBackPage = () => {
        router.back();
    };

    function handleClickActive(id: number, status: boolean) {
        setDataLearningLesson({ id, status })
        setShowPopUpUpdateStatus(true);
    }

    function onSubmitUpdateStatus() {
        updateStatusLearningLesson({
            learning: {
                [dataLearningLesson.id]: dataLearningLesson.status
            }
        }).then((res) => {
            if (res.code === 200) {
                toast.success(res.message);
                setShowPopUpUpdateStatus(false);
                setLearningLessons((prev: any) => {
                    return prev.map((item: any) => item.id === dataLearningLesson.id ? { ...item, status: dataLearningLesson.status ? LEARNING_LESSON_ACTIVE : LEARNING_LESSON_INACTIVE } : { ...item });
                });
            }
        }).catch((error) => {
            console.log(error)
        })
    }
    function handleClickUpdateStatusAll(learningLessons: any, status: boolean) {
        let learning: any = {};
        learningLessons.forEach((learningLesson: any) => {
            learning[`${learningLesson.id}`] = status
        });
        updateStatusLearningLesson({ learning }).then((res) => {
            if (res.code === 200) {
                setLearningLessons((prev: any) => {
                    return prev.map((item: any) => ({ ...item, status: status ? LEARNING_LESSON_ACTIVE : LEARNING_LESSON_INACTIVE }));
                });
                console.log(learningLessons);
                toast.success(res.message);
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    return <>
        {!loading ? (
            <div className="bg-primary">
                <div className="d-flex align-items-center mt-7 px-7">
                    <i
                        className="fa fa-angle-left fs-4 me-3 pointer"
                        aria-hidden="true"
                        onClick={() => handleBackPage()}
                    />
                    <h3 className={"mb-0"}>Lịch Học</h3>
                </div>
                <div>
                    <br />
                    <section>
                        <Container>
                            <div className="d-flex justify-content-between" >
                                <div>
                                    <h4>{learningLessons[0] ? learningLessons[0]['unit_name'] : "" }</h4>
                                </div>
                                <div>
                                    <Button variant="success" onClick={() => handleClickUpdateStatusAll(learningLessons, true)}>
                                        Active All
                                    </Button>
                                    <span style={{ marginLeft: "8px" }}></span>
                                    <Button variant="danger" onClick={() => handleClickUpdateStatusAll(learningLessons, false)}>
                                        Deactive All
                                    </Button>
                                </div>
                            </div>
                            <Row>
                                {
                                    learningLessons.map((learningLesson: any, index) => {
                                        return <Col key={index} lg={2} md={3} sm={6}>
                                            <Card
                                                bg={learningLesson?.game_category_id === 0 ? 'danger' : learningLesson?.status === 1 ? 'success' : 'info'}
                                                text={learningLesson?.game_category_id === 0 ? 'white' : learningLesson?.status === 1 ? 'white' : 'black'}
                                                className={"mt-6"}
                                            >
                                                <Card.Header className={"d-flex justify-content-between"}>
                                                    <div>
                                                        {
                                                            learningLesson?.status === 0 ?
                                                                <FontAwesomeIcon
                                                                    icon={faToggleOff}
                                                                    size="2x"
                                                                    className={"pointer"}
                                                                    onClick={() => handleClickActive(learningLesson?.id, true)} /> :
                                                                <FontAwesomeIcon
                                                                    icon={faToggleOn}
                                                                    size="2x"
                                                                    className={"pointer"}
                                                                    onClick={() => handleClickActive(learningLesson?.id, false)}
                                                                />
                                                        }
                                                    </div>
                                                </Card.Header>
                                                <Card.Body>
                                                    <p>
                                                        {
                                                            learningLesson?.unit_name
                                                        }
                                                    </p>
                                                    <p>
                                                        Lesson: {index + 1}
                                                    </p>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    })
                                }
                            </Row>
                        </Container>
                        <div className={"mt-4"}>
                            {total > 1 && (
                                <ReactPaginate
                                    previousLabel={""}
                                    previousClassName={"icon icon-prev"}
                                    nextLabel={""}
                                    nextClassName={"icon icon-next"}
                                    breakLabel={"..."}
                                    pageCount={Math.ceil(total / perPage)}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={3}
                                    onPageChange={(data: any) => {
                                        setPage(data.selected + 1);
                                    }}
                                    forcePage={page - 1}
                                    containerClassName="pagination"
                                    pageClassName="page-item"
                                    pageLinkClassName="page-link"
                                    activeClassName="active"
                                    previousLinkClassName="page-link page-link--prev"
                                    nextLinkClassName="page-link page-link--next"
                                    hrefAllControls
                                />
                            )}
                        </div>
                        <PopupUpdateStatus
                            show={showPopupUpdateStatus}
                            handleClose={() => setShowPopUpUpdateStatus(false)}
                            learningLesson={dataLearningLesson}
                            onSubmit={onSubmitUpdateStatus}
                        />
                    </section>
                </div>
            </div>
        ) : (
            <Loading />
        )
        }
    </>
}
export default Calender;