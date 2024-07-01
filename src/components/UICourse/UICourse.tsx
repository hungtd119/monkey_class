import { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import TaiLieuItem from 'src/modules/Lop-hoc/TaiLieu';
import { getDetailClassroom, getLessonByParamsV3 } from 'src/services/common';
import Loading from "../Loading";

const UICourse = (props: any) => {
  const { courseTitle, courseId, id } = props;
  const [lessons, setLessons] = useState([])
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [loading, setLoading] = useState(false);


  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getDetailClassroom({ id });
      if (response.meta?.code === 200) {
        const detailClassroom = response?.result
          ? response.result
          : [];
        const res = await getLessonByParamsV3({ course_id: courseId, level_id: detailClassroom?.classrooms?.age, per_page: perPage, page: page })
        if (res.code === 200) {
          setLessons(res.data.data);
          setTotal(res.data.total);
          setPerPage(res.data.per_page);
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  useEffect(() => {
    fetchData();
  }, [page]);
  return (
    <div>
      <Col md={12} className="ps-8 material mt-3 mb-5">
        <div className="material-wrapper row gap-6">
          {
            !loading ? lessons.length > 0 ? (
              lessons.map((lesson: any) =>
                <TaiLieuItem
                  key={`item-${lesson.id}`}
                  title={lesson.title}
                  description={lesson.description}
                  name={courseTitle}
                  idLesson={lesson.id}
                  pathThumb={lesson.path_thumb}
                  tabId={courseId}
                />)
            ) : (
              <div className="text-center fw-bold fs-3">
                Không có tài liệu
              </div>
            ) : <Loading />
          }
        </div>
      </Col>
      <div className={"mt-4"}>
        {total > perPage && (
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
    </div>
  )
}

export default UICourse
