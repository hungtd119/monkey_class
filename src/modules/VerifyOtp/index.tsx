import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button, Col, Spinner } from "react-bootstrap";
import InputOtp from "src/components/OTPInput";
import { maskUserData } from "src/selection";

interface VerifyOtpProps {
  userData: { email: string; phone: string, role: number | null };
  onHanldeGetOtp: (data: any) => void;
  onVerifyOtp: (data: any) => void;
  loading: boolean;
}

const VerifyOtp: React.FC<VerifyOtpProps> = ({ userData, onHanldeGetOtp, onVerifyOtp, loading }) => {
  const router = useRouter();
  const path = router.pathname;

  const [otp, setOtp] = useState<string>("");
  const [resetInput, setResetInput] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(60);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isResending) {
      timer = setTimeout(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isResending, resendTimer]);

  useEffect(() => {
    if (resendTimer === 0) {
      setIsResending(false);
    }
  }, [resendTimer]);

  const handleComplete = (code: string) => {};

  const handleSubmit = async () => {
    onVerifyOtp(otp)
  };

  const handleResend = () => {
    setIsResending(true);
    setResendTimer(60);
    onHanldeGetOtp(userData);
  };

  return (
    <Col lg={6} md={6} className="px-5 pt-7 position-relative bg-white">
      <Image
        src={`${global.pathSvg}/logo_monkey_class.svg`}
        width={164}
        height={50}
        className="d-flex"
        alt="Monkey Class"
      />
      <p className="fw-bold fs-3 mt-8">Nhập mã xác thực</p>
      <div className="d-flex gap-1 py-4">
        <p className="max-w-450px">
          Chúng tôi đã gửi mã OTP đến số điện thoại {""}
          <span className="fw-bold" style={{ color: "#3393FF" }}>
          {maskUserData(userData,"phone")}
          </span>
          . Vui lòng nhập mã để tiếp tục.
        </p>
      </div>

      <InputOtp
        length={6}
        onComplete={handleComplete}
        onChange={setOtp}
        resetInput={resetInput}
      />
      <Col lg={12} md={12}>
        <Button
          className="px-4 max-w-450px w-100 fw-bold mt-3 text-secondary bg-button-v2 input-custom"
          variant="primary"
          type="submit"
          disabled={otp.length !== 6 || loading}
          onClick={handleSubmit}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Xác nhận"}
        </Button>
      </Col>

      <div className="d-flex gap-1 py-2 mt-5">
        <p>Chưa nhận được mã OTP?</p>
        {isResending ? (
          <p>Gửi lại ({resendTimer}s)</p>
        ) : (
          <a
            className="text-decoration-underline pointer"
            onClick={handleResend}
          >
            Gửi lại
          </a>
        )}
      </div>
    </Col>
  );
};

export default VerifyOtp;
