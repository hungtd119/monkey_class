export default function Footer({
  isButtonNext,
  onNextQuestion,
  handleCheckAnswer,
  isModeExam,
  isLastQuestion,
}) {

  return (
    <div className="d-flex align-items-center footer-exam">
            {!isButtonNext ? (
              <button
                type="submit"
                variant="warning"
                className="px-md-3 px-2 btn-pr"
                onClick={() => handleCheckAnswer()}
              >
                {isModeExam ? "Xác nhận" : "Kiểm tra"}
              </button>
            ) : (
              <button
                type="button"
                variant="none"
                className={`px-md-3 px-2 btn-pr monkey-bg-green-2 ${
                  isLastQuestion && isModeExam && "d-none"
                }`}
                onClick={() => onNextQuestion()}
              >
                Tiếp tục
              </button>
            )}
    </div>
  );
}

