import React from "react";
import Image from "next/image";
import { Card, ListGroup } from "react-bootstrap";
import { globalPath } from "src/global";

interface NotiItemProps {
  type: string;
}
const NotiItem = ({ type }: NotiItemProps) => {
  return (
    <div className="notification-header-dropdown">
      <Card>
        <Card.Header>
          <p className="fw-bold fs-3">Thông báo</p>
        </Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item className="d-flex align-items-start py-4">
            {type == "accept" ? (
              <>
                <Image
                  src={`${globalPath.pathSvg}/icon-noti-verify-success.svg`}
                  className="rounded me-2"
                  alt="Icon"
                  width={48}
                  height={48} 
                /> 
                <div>
                  <p className="fw-bold">Yêu cầu gia nhập được phê duyệt</p>
                  <p style={{ color: "#AFAFAF", fontWeight: 400 }}>
                    Yêu cầu tham gia trường Monkey Việt Nam của bạn đã được phê
                    duyệt. Giờ đây bạn có thể thao tác trên web quản trị của
                    trường.
                  </p>
                </div>
              </>
            ) : (
              <>
                <Image
                  src={`${globalPath.pathSvg}/icon-noti-verify-reject.svg`}
                  className="rounded me-2"
                  alt="Icon"
                  width={48}
                  height={48}
                />
                <div>
                  <p className="fw-bold">Yêu cầu gia nhập bị từ chối</p>
                  <p style={{ color: "#AFAFAF", fontWeight: 400 }}>
                    Yêu cầu tham gia trường Monkey Việt Nam của bạn đã bị từ
                    chối. Bạn hãy xin gia nhập lại hoặc liên hệ trường để được
                    hỗ trợ nhé.
                  </p>
                </div>
              </>
            )}
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </div>
  );
};

export default NotiItem;
