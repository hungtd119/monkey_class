import classNames from "classnames";
import { INNER_WIDTH } from "./const";

export default function QuestionResult({ result }) {

  return (
    <div className="d-flex justify-content-end position-relative">
      {result === true && (
        <div style={{zIndex: 9, top: "-35px"}}
          className={classNames(
            "d-flex align-items-center monkey-bg-success text-white d-inline p-2 px-2 rounded-pill",
            {
              "position-absolute": window.innerWidth > INNER_WIDTH.IPAD,
            }
          )}
        >
          <i className="fa fa-smile-o pe-2" aria-hidden="true" style={{fontSize: "28px"}}></i>
          <span className="monkey-fz-16">Chính xác</span>
        </div>
      )}
      {result === false && (
        <div style={{zIndex: 9, top: "-35px"}}
          className={classNames(
            "d-flex align-items-center monkey-bg-error text-white d-inline p-2 px-2 rounded-pill",
            {
              "position-absolute": window.innerWidth > INNER_WIDTH.IPAD,
            }
          )}
        >
          <i className="fa fa-frown-o pe-2" aria-hidden="true" style={{fontSize: "28px"}}></i>
          <span className="monkey-fz-16">Sai rồi</span>
        </div>
      )}
    </div>
  );
}
