import { React } from "react";
import useSteppedSvg from "./useSteppedSvg";

export default function CodeSplit() {
  // const ref = useSteppedSvg([
  //   615, // index_timing
  //   500 + 2385, // index_compress + main_timing
  //   500 + 350, // assets_compress + data_timing
  // ]);

  return (
    <svg
      // ref={ref}
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
      <g>
        <Arrow
          transform="translate(163, 200)"
          opacity={0}
          height={30}
          width={20}
        >
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
        <MainBox transform="translate(182, 190)" />
        <animateTransform
          additive="sum"
          attributeName="transform"
          type="translate"
          from="0 0"
          to="-58 0"
          begin="assets_compress.begin"
          dur="500ms"
          fill="freeze"
        />
      </g>
      <g transform="translate(552, 280)">
        <g opacity="0">
          <Arrow height={20} width={70} />
          <Arrow
            transform="translate(0, 20)"
            height={105}
            width={70}
          />
          <Arrow
            transform="translate(0, 125)"
            height={85}
            width={70}
          />
          <animate
            {...fadeInAnimation}
            begin="assets_compress.end"
          />
        </g>
        <DataBox
          text="Instruments"
          transform="translate(70, -20)"
        />
        <DataBox
          text="Prices"
          transform="translate(70, 75)"
        />
        <DataBox
          text="Orders"
          transform="translate(70, 170)"
        />
      </g>
    </svg>
  );
}

const IndexBox = ({ animation, ...props }) => {
  return (
    <g {...props}>
      <text x="0" y="30" fill="white" opacity="0">
        index.html ~615ms
        <animate
          id="index_appear"
          begin="10ms"
          {...fadeInAnimation}
        />
      </text>
      <TimingBar
        prefix="index"
        ttfb={{
          title: "TTFB 130ms",
          width: 180,
          duration: 130,
        }}
        download={{ title: "5ms", width: 60, duration: 5 }}
        parse={{
          title: "Parse 480ms",
          width: 480,
          duration: 480,
        }}
        animation={[
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
          />,
          <animateTransform
            id="assets_compress"
            additive="sum"
            attributeName="transform"
            type="scale"
            from="1 1"
            to="0.6 1"
            begin="main_timing.end"
            dur="500ms"
            fill="freeze"
          />,
        ]}
        transform="translate(0, 40)"
      />
      {animation}
    </g>
  );
};

const MainBox = ({ animation, ...props }) => {
  return (
    <g {...props}>
      <text x="0" y="30" fill="white" opacity="0">
        main.js ~2400ms
        <animate
          begin="main_timing.begin+10ms"
          {...fadeInAnimation}
        />
      </text>
      <TimingBar
        prefix="main"
        ttfb={{
          title: "315ms",
          width: 95,
          duration: 315,
        }}
        download={{
          title: "700ms",
          width: 210,
          duration: 700,
        }}
        parse={{
          title: "1370ms",
          width: 410,
          duration: 1370,
        }}
        begin="index_compress.end"
        animation={
          <animateTransform
            additive="sum"
            attributeName="transform"
            type="scale"
            from="1 1"
            to="0.6 1"
            begin="assets_compress.begin"
            dur="500ms"
            fill="freeze"
          />
        }
        transform="translate(0, 40)"
      />
      {animation}
    </g>
  );
};

const DataBox = ({ text, ...props }) => {
  return (
    <g {...props}>
      <text x="0" y="30" fill="white" opacity="0">
        {text} ~400ms
        <animate
          begin="data_timing.begin+10ms"
          {...fadeInAnimation}
        />
      </text>
      <TimingBar
        prefix="data"
        ttfb={{
          width: 50,
          duration: 310,
        }}
        download={{
          width: 10,
          duration: 40,
        }}
        parse={{
          width: 0,
          duration: 0,
        }}
        begin="assets_compress.end"
        transform="translate(0, 40)"
      />
    </g>
  );
};

/**
 * Creates an animation named `${prefix}_timing` that begins at `begin` and has
 * a duration of `ttfb.duration + download.duration + parse.duration`
 */
const TimingBar = ({
  prefix,
  ttfb,
  download,
  parse,
  animation,
  begin,
  ...props
}) => {
  const bars = [ttfb, download, parse];
  const accWidth = bars.reduce(
    (acc, b, i) => [...acc, acc[i] + b.width],
    [0]
  );
  const totalDuration = bars.reduce(
    (a, b) => a + b.duration,
    0
  );

  const disappearText = (
    <animate
      begin={`${prefix}_timing.end`}
      {...fadeOutAnimation}
    />
  );

  return (
    <g mask={`url(#${prefix}_reveal)`} {...props}>
      <mask id={`${prefix}_reveal`}>
        <rect
          x="0"
          y="0"
          width="0"
          height="100"
          fill="white"
        >
          <animate
            id={`${prefix}_timing`}
            begin={begin}
            attributeName="width"
            to={accWidth[bars.length]}
            dur={totalDuration + "ms"}
            fill="freeze"
          />
        </rect>
      </mask>
      {animation}
      <DownloadBox
        color="palegoldenrod"
        text={ttfb.title}
        width={ttfb.width}
        textAnimation={disappearText}
      />
      <DownloadBox
        color="goldenrod"
        text={download.title}
        width={download.width}
        textAnimation={disappearText}
        transform={`translate(${accWidth[1]})`}
      />
      <DownloadBox
        color="steelblue"
        text={parse.title}
        width={parse.width}
        textAnimation={disappearText}
        transform={`translate(${accWidth[2]})`}
      />
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

const Arrow = ({
  width: w = 30,
  height: h = 40,
  ...props
}) => {
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

const fadeInAnimation = {
  attributeName: "opacity",
  to: "1",
  dur: "0.2s",
  fill: "freeze",
};
const fadeOutAnimation = {
  attributeName: "opacity",
  to: "0",
  dur: "0.2s",
  fill: "freeze",
};
