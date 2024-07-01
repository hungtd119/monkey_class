import ReactPaginate from "react-paginate";

export default function Pagination(props: any) {
  const { total, totalPerPage, setCurrentPage, currentPage } = props;
  const totalPage = Math.ceil(total / totalPerPage);
  return (
    <ReactPaginate
      previousLabel={""}
      previousClassName={"icon icon-prev"}
      nextLabel={""}
      nextClassName={"icon icon-next"}
      breakLabel={"..."}
      pageCount={totalPage}
      marginPagesDisplayed={2}
      pageRangeDisplayed={2}
      onPageChange={(data) => setCurrentPage(data.selected + 1)}
      containerClassName="pagination"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      activeClassName="active"
      previousLinkClassName={`page-link page-link--prev ${
        currentPage === 1 && "btn disabled"
      }`}
      nextLinkClassName={`page-link page-link--next ${
        currentPage === totalPage && "btn disabled"
      }`}
      renderOnZeroPageCount={null}
      forcePage={currentPage - 1}
    />
  );
}
