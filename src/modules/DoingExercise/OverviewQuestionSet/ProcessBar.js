
export default function ProgressBar({
  strokeWidth,
  percentDoing,
  percentage,
  isPlayModeExamV2,
}) {

  const radius = 50 - strokeWidth / 2;
  const pathDescription = `
      M 50,50 m 0,-${radius}
      a ${radius},${radius} 0 1 1 0,${2 * radius}
      a ${radius},${radius} 0 1 1 0,-${2 * radius}
    `;

  const diameter = Math.PI * 2 * radius;
  const progressStyle = {
    stroke: "#ff7707",
    strokeLinecap: "round",
    strokeDasharray: `${diameter}px ${diameter}px`,
    strokeDashoffset: `${((100 - percentage) / 100) * diameter}px`,
  };

  return (
    <div className="d-flex justify-content-center my-md-3 my-1">
      <svg
        className={"CircularProgressbar"}
        viewBox="0 0 100 100"
        width={150}
        height={150}
      >
        <path
          className="CircularProgressbar-trail"
          d={pathDescription}
          strokeWidth={strokeWidth}
          fillOpacity={0}
          style={{
            stroke: "#d6d6d6",
          }}
        />

        <path
          className="CircularProgressbar-path"
          d={pathDescription}
          strokeWidth={strokeWidth}
          fillOpacity={0}
          style={progressStyle}
        />
        {isPlayModeExamV2 ? (
          <image
            className="CircularProgressbar-text"
            href="/assets/img/img-armorial.png"
            x={25}
            y={25}
            height="50px"
            width="50px"
            style={{
              fontSize: window.innerWidth > 768 ? "24px" : "30px",
            }}
          />
        ) : (
          <text
            className="CircularProgressbar-text"
            x={50}
            y={50}
            style={{
              fill: "#007dbc",
              fontSize: window.innerWidth > 768 ? "24px" : "30px",
              dominantBaseline: "central",
              textAnchor: "middle",
            }}
          >
            {percentDoing}
          </text>
        )}
      </svg>
    </div>
  );
}

