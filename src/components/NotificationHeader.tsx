import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button, Card, ListGroup } from "react-bootstrap";
import { globalPath } from "src/global";
import { STATUS_ACCEPT, STATUS_REJECT } from "src/constant";

function NotificationHeader(props: any) {
  const { listNoti, handleAcceptOrRejectRequestSchool, loading } = props;

  const [showAll, setShowAll] = useState(false);

  const maxDisplayCount = 4;
  const displayedNoti = showAll ? listNoti : listNoti.slice(0, maxDisplayCount);
  const remainingNotiCount = listNoti.length - maxDisplayCount;

  const showAllNoti = () => {
    setShowAll(true);
  };

  return (
    <>
      <div className="notification-header-dropdown" id="notification-dropdown">
        <Card>
          <Card.Header style={{ backgroundColor: "#fff", padding: 20 }}>
            <p className="fw-bold fs-3">Thông báo</p>
          </Card.Header>
          <ListGroup
            variant="flush"
            style={{ maxHeight: "77vh", overflow: "auto" }}
          >
            {displayedNoti.map((noti: any, index: number) => (
              <ListGroup.Item
                className="d-flex align-items-center justify-content-between pb-5 pointer list-group-item-custom"
                key={index}
              >
                <div className="d-flex">
                  {!noti?.teacher_id && (
                    <Image
                      src={noti.icon}
                      className="rounded me-2"
                      alt="Icon"
                      width={48}
                      height={48}
                    />
                  )}
                  {!noti?.teacher_id && (
                    <div>
                      <p className="fw-bold">{noti?.title}</p>
                      <p>{noti?.content}</p>
                    </div>
                  )}

                  {noti.teacher_id && (
                    <Image
                      src={
                        noti.user_info?.avatar
                          ? `${process.env.NEXT_PUBLIC_CDN_MEDIA_URL}${noti.user_info?.avatar}`
                          : `${global.pathImg}/default-avatar.png`
                      }
                      className="rounded-50 me-2"
                      alt="Avatar"
                      width={48}
                      height={48}
                    />
                  )}
                  {noti.teacher_id && (
                    <div>
                      <p className="fw-bold">
                        {noti.user_info?.name} {""}
                        <span className="fw-normal">
                          đã gửi yêu cầu tham gia trường
                        </span>
                      </p>
                      <div
                        className="d-flex align-items-center gap-1 user-info"
                        style={{ color: "#AFAFAF", fontWeight: 400 }}
                      >
                        <p className="text-email">{noti.user_info?.email}</p>
                        <p className="d-flex align-items-center">
                          <span className="dot"></span>
                          {noti.role
                            ? noti.role === "Teacher"
                              ? "Giáo viên"
                              : "Quản trị viên"
                            : ""}
                        </p>
                      </div>
                      <div className="d-flex gap-2">
                        <Button
                          className="px-4 w-100 fw-bold mt-3 text-secondary rounded-3"
                          variant="primary"
                          type="submit"
                          style={{ backgroundColor: "#F63D68" }}
                          disabled={loading}
                          onClick={() =>
                            handleAcceptOrRejectRequestSchool(
                              STATUS_ACCEPT,
                              noti.user_info?.user_id,
                              noti.role
                            )
                          }
                        >
                          Xác nhận
                        </Button>
                        <Button
                          className="px-4 w-100 fw-bold mt-3 bg-secondary rounded-3"
                          variant="primary"
                          type="submit"
                          style={{
                            border: "1px solid #D0D5DD",
                            color: "#475467",
                          }}
                          disabled={loading}
                          onClick={() =>
                            handleAcceptOrRejectRequestSchool(
                              STATUS_REJECT,
                              noti.user_info?.user_id,
                              noti.role
                            )
                          }
                        >
                          Từ chối
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          {remainingNotiCount > 0 && !showAll && (
            <Card.Footer
              style={{ backgroundColor: "#fff", padding: 10 }}
              className="d-flex justify-content-center pointer"
              onClick={() => showAllNoti()}
            >
              <p className="fw-bold" style={{ color: "#1570EF" }}>
                Hiển thị thêm {remainingNotiCount} thông báo
              </p>
            </Card.Footer>
          )}
        </Card>
      </div>
    </>
  );
}

export default NotificationHeader;
