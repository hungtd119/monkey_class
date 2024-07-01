import React from 'react'
import { Col } from 'react-bootstrap'
import TaiLieuItem from './TaiLieu';
import ReactPaginate from 'react-paginate';

const DanhSachTaiLieuTabTruyenTho = (props: any) => {
    const { listLesson, total } = props;
  return (
    <>
    <Col md={12} className="ps-8 material mt-3 mb-5">
            <div className="material-wrapper row gap-6">
              {listLesson?.length > 0 ? (
                listLesson.map((lesson: any) => (
                  <TaiLieuItem
                    title={lesson.title}
                    desciption={lesson.desciption}
                    name={lesson.name}
                    idLesson={lesson.id}
                    pathThumb={lesson.path_thumb}
                  />
                ))
              ) : (
                <div className="text-center fw-bold fs-3">
                  Không có tài liệu
                </div>
              )}
            </div>
          </Col>
    
        
    </>
  )
}

export default DanhSachTaiLieuTabTruyenTho