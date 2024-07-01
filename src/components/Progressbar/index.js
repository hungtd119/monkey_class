
import CircleProgressBar from "./CircleProgressBar";

export const PROGRESS_BAR_TYPE = {
  CIRCLE: "circle",
};

export const PROGRESS_BAR_COMPONENT = {
  [PROGRESS_BAR_TYPE.CIRCLE]: CircleProgressBar,
};

export default function ProgressBar({
  type = PROGRESS_BAR_TYPE.CIRCLE,
  targetValue,
  progressValue,
  progressIndicator,
}) {
  const PB = PROGRESS_BAR_COMPONENT[type];

  return (
    <div className="d-flex justify-content-center">
      {PB && (
        <PB
          targetValue={targetValue}
          progressValue={progressValue}
          progressIndicator={progressIndicator}
        />
      )}
    </div>
  );
}

