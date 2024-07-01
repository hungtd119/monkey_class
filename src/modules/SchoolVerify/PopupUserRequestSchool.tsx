import React from "react";
import Image from "next/image";
import { ListGroup, Modal } from "react-bootstrap";
import { globalPath } from "src/global";
import Loading from "src/components/Loading";
import {
  STATUS_ACCEPT,
  STATUS_REJECT,
  TYPE_ACCOUNT_SCHOOL,
} from "src/constant";

const PopupUserRequestSchool = (props: any) => {
  const { show, handleClose, handleAcceptOrReject, users, loading } = props;

  return (
    <Modal show={show} onHide={handleClose} centered keyboard={true}>
      <Modal.Header className="border-0">
        <Modal.Title
          className="fw-bold"
          style={{ color: "#182230", fontSize: 22 }}
        >
          Yêu cầu tham gia trường
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "62vh", overflow: "auto" }}>
        <ListGroup variant="flush">
          {loading ? (
            <Loading />
          ) : (
            <>
              {users && users.length > 0 ? (
                users.map((user: any, index: number) => (
                  <ListGroup.Item
                    key={index}
                    className="py-4 d-flex align-items-start align-items-center justify-content-between"
                  >
                    <div className="d-flex gap-2">
                      <Image
                        src={
                          user.avatar
                            ? `${process.env.NEXT_PUBLIC_CDN_MEDIA_URL}${user.avatar}`
                            : `${globalPath.pathImg}/avatar_random1.png`
                        }
                        className="rounded me-2"
                        alt="Avatar"
                        width={48}
                        height={48}
                      />
                      <div>
                        <p className="fw-bold">{user.name}</p>
                        <div
                          className="d-flex align-items-center gap-2 user-info"
                          style={{ fontWeight: 400, color: "#667085" }}
                        >
                          <p className="text-email">{user?.email}</p>
                          <p
                            className="d-flex align-items-center"
                            style={{ color: "#667085" }}
                          >
                            <span className="dot"></span>
                            {user?.role === TYPE_ACCOUNT_SCHOOL
                              ? "Quản trị viên"
                              : "Giáo viên"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <Image
                        src={`${globalPath.pathSvg}/check.svg`}
                        width={24}
                        height={24}
                        alt="check"
                        onClick={() =>
                          handleAcceptOrReject(
                            STATUS_ACCEPT,
                            user.user_id,
                            user.role
                          )
                        }
                      />
                      <Image
                        src={`${globalPath.pathSvg}/x-icon.svg`}
                        width={24}
                        height={24}
                        alt="deny"
                        onClick={() =>
                          handleAcceptOrReject(
                            STATUS_REJECT,
                            user.user_id,
                            user.role
                          )
                        }
                      />
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <p className="text-center fw-bold fs-2">Không có yêu cầu</p>
              )}
            </>
          )}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default PopupUserRequestSchool;
