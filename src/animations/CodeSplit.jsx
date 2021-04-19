import { React } from "react";
import useSteppedSvg from "./useSteppedSvg";

export default function CodeSplit() {
  const ref = useSteppedSvg([
    615, // index_timing
    500, // index_compress
    2400, // main_timing
    500
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
            to="-130 -90"
            begin="index_compress.begin"
            dur="500ms"
            fill="freeze"
          />
        }
      />
      <Arrow transform="translate(163, 200)" opacity={0} height={30} width={20}>
        <animate
          attributeName="opacity"
          to="1"
          dur="0.2s"
          fill="freeze"
          begin="index_compress.end"
        />
        <animateTransform
          additive="sum"
          attributeName="transform"
          type="translate"
          from="0 -5"
          to="0 0"
          begin="index_compress.end"
          dur="0.2s"
          fill="freeze"
        />
      </Arrow>
      <MainBox
        transform="translate(182, 190)"
      />
      <Arrow transform="translate(897, 280)" opacity={0} height={50} width={70}>
        <animate
          attributeName="opacity"
          to="1"
          dur="0.2s"
          fill="freeze"
          begin="main_timing.end"
        />
      </Arrow>
      <Arrow transform="translate(897, 330)" opacity={0} height={50} width={70}>
        <animate
          attributeName="opacity"
          to="1"
          dur="0.2s"
          fill="freeze"
          begin="main_timing.end"
        />
      </Arrow>
      <Arrow transform="translate(897, 380)" opacity={0} height={50} width={70}>
        <animate
          attributeName="opacity"
          to="1"
          dur="0.2s"
          fill="freeze"
          begin="main_timing.end"
        />
      </Arrow>
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
        index.html ~615ms
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

const MainBox = ({ animation, ...props }) => {
  const boxSizes = [95, 210, 410];
  const totalWidth = boxSizes.reduce((a, b) => a + b);

  return (
    <g {...props}>
      <mask id="main_reveal">
        <rect
          x="0"
          y="0"
          width="0"
          height="100"
          fill="white"
        >
          <animate
            id="main_timing"
            attributeName="width"
            to={totalWidth}
            dur="2400ms"
            fill="freeze"
            begin="index_compress.end"
          />
        </rect>
      </mask>
      <text
        x="0"
        y="30"
        fill="white"
        style={{ visibility: "hidden" }}
      >
        main.js ~2400ms
        <animate
          begin="main_timing.begin+10ms"
          {...appearAnimation}
        />
      </text>
      <g
        mask="url(#main_reveal)"
        transform="translate(0, 40)"
      >
        <DownloadBox
          color="palegoldenrod"
          text="315ms"
          width={boxSizes[0]}
        />
        <DownloadBox
          color="goldenrod"
          text="700ms"
          width={boxSizes[1]}
          transform="translate(95)"
        />
        <DownloadBox
          color="steelblue"
          text="1370ms"
          width={boxSizes[2]}
          transform={`translate(${95 + 210})`}
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

const Arrow = ({width: w = 30, height: h = 40, ...props}) => {
  return (
    <path
      d={`M0 0 0 ${h} ${w} ${h} ${w - 10} ${
        h - 5
      } M${w} ${h} ${w - 10} ${h + 5}`}
      stroke="white"
      fill="none"
      {...props}
    />
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
