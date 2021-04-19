import { React } from "react";
import useSteppedSvg from "./useSteppedSvg";

export default function CodeSplit() {
  const ref = useSteppedSvg([
    615, // index_timing
    500, // index_compress
  ]);

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 768"
      style={{ fontSize: "24px" }}
    >
      <IndexBox
        transform="translate(150, 200)"
        animation={
          <animateTransform
            additive="sum"
            attributeName="transform"
            type="translate"
            from="0 0"
            to="-100 -100"
            begin="index_compress.begin"
            dur="500ms"
            fill="freeze"
          />
        }
      />
    </svg>
  );
}

const IndexBox = ({ animation, ...props }) => {
  const boxSizes = [180, 60, 480];
  const totalWidth = boxSizes.reduce((a, b) => a + b);

  const disappearText = (
    <animate
      begin="index_compress.begin+10ms"
      {...disappearAnimation}
    />
  );

  return (
    <g {...props}>
      <mask id="index_reveal">
        <rect
          x="0"
          y="0"
          width="0"
          height="100"
          fill="white"
        >
          <animate
            id="index_timing"
            attributeName="width"
            to={totalWidth}
            dur="615ms"
            fill="freeze"
          />
        </rect>
      </mask>
      <text
        x="0"
        y="30"
        fill="white"
        style={{ visibility: "hidden" }}
      >
        index.html
        <animate
          id="index_appear"
          begin="10ms"
          {...appearAnimation}
        />
      </text>
      <g
        mask="url(#index_reveal)"
        transform="translate(0, 40)"
      >
        <animateTransform
          id="index_compress"
          additive="sum"
          attributeName="transform"
          type="scale"
          from="1 1"
          to="0.2 1"
          begin="index_timing.end"
          dur="500ms"
          fill="freeze"
        />
        <DownloadBox
          color="palegoldenrod"
          text="TTFB 130ms"
          width={boxSizes[0]}
          textAnimation={disappearText}
        />
        <DownloadBox
          color="goldenrod"
          text="5ms"
          width={boxSizes[1]}
          textAnimation={disappearText}
          transform="translate(180)"
        />
        <DownloadBox
          color="steelblue"
          text="Parse 480ms"
          width={boxSizes[2]}
          textAnimation={disappearText}
          transform={`translate(${180 + 60})`}
        />
      </g>
      {animation}
    </g>
  );
};

const DownloadBox = ({
  text,
  width,
  color,
  textAnimation,
  ...props
}) => {
  const textElement = text && (
    <text
      x={width / 2}
      y="32"
      textAnchor="middle"
      fill="black"
    >
      {text}
      {textAnimation}
    </text>
  );

  return (
    <g {...props}>
      <rect
        x="0"
        y="0"
        width={width}
        height="50"
        fill={color}
      ></rect>
      {textElement}
    </g>
  );
};

const appearAnimation = {
  attributeName: "visibility",
  to: "visible",
  dur: "0.2s",
  fill: "freeze",
};
const disappearAnimation = {
  attributeName: "visibility",
  to: "hidden",
  dur: "0.2s",
  fill: "freeze",
};
