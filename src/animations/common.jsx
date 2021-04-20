import { React } from "react";

/**
 * Creates an animation named `${prefix}_timing` that begins at `begin` and has
 * a duration of `ttfb.duration + download.duration + parse.duration`
 */
export const TimingBar = ({
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

export const DownloadBox = ({
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

export const Arrow = ({
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

export const fadeInAnimation = {
  attributeName: "opacity",
  to: "1",
  dur: "0.2s",
  fill: "freeze",
};
export const fadeOutAnimation = {
  attributeName: "opacity",
  to: "0",
  dur: "0.2s",
  fill: "freeze",
};
