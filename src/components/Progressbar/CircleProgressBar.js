function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    arcSweep,
    0,
    end.x,
    end.y,
  ].join(" ");
}

function circlePath(cx, cy, r) {
  return (
    "M " +
    cx +
    " " +
    cy +
    " m -" +
    r +
    ", 0 a " +
    r +
    "," +
    r +
    " 0 1,1 " +
    r * 2 +
    ",0 a " +
    r +
    "," +
    r +
    " 0 1,1 -" +
    r * 2 +
    ",0"
  );
}

function posXY(center, radius, angle) {
  return [
    center + radius * Math.cos((angle * Math.PI) / 180),
    center + radius * Math.sin((angle * Math.PI) / 180),
  ];
}

const strokeWidth = 12;
const pointerX = 50;
const pointerY = 50;
const maxDegree = 360;

const DEFAULT_INDICATOR = (
  <image
    href="/assets/img/img-armorial.png"
    x={25}
    y={25}
    height={50}
    width={50}
  />
);

export default function CircleProgressBar({
  targetValue,
  progressValue,
  progressIndicator = DEFAULT_INDICATOR,
}) {
  const radius = 50 - strokeWidth / 2;

  return (
    <svg viewBox="0 0 100 100" width={200} height={200}>
      {Array.from({ length: targetValue }).map((_, index) => {
        return (
          <path
            d={describeArc(
              pointerX,
              pointerY,
              radius,
              (index * maxDegree) / targetValue + 2,
              ((index + 1) * maxDegree) / targetValue
            )}
            strokeWidth={strokeWidth}
            fill="none"
            style={{
              stroke: index === progressValue ? "#ff7707" : "#d6d6d6",
            }}
            key={index}
          />
        );
      })}
      {Array.from({ length: progressValue }).map((_, index) => {
        return (
          <path
            d={describeArc(
              pointerX,
              pointerY,
              radius,
              (index * maxDegree) / targetValue + 3,
              ((index + 1) * maxDegree) / targetValue
            )}
            strokeWidth={strokeWidth}
            fill="none"
            style={{
              stroke: "#73BF43",
            }}
            key={index}
          />
        );
      })}
      {Array.from({ length: targetValue }).map((_, index) => {
        const angle = (index + 8) * (maxDegree / targetValue);
        const [x1, y1] = posXY(pointerX, radius, angle);
        return (
          <text
            x={x1 - 3}
            y={y1 + 2}
            style={{
              fill: "#2a404f",
              fontSize: 7,
              fontWeight: 900,
            }}
            fontFamily="SVN-GilroyBold, sans-serif"
            key={index}
          >
            {index + 1}
          </text>
        );
      })}
      {progressIndicator}
    </svg>
  );
}
