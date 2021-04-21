import { React } from "react";
import useSteppedSvg from "./useSteppedSvg";
import {
  TimingBar,
  Arrow,
  fadeInAnimation,
} from "./common";

export default function NoCodeSplit() {
  const ref = useSteppedSvg([
    145, // index_timing
    500 + 2385, // index_compress + main_timing
    500 + 350, // assets_compress + data_timing
    200, // unused_fade_in
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
        animation={[
          <animateTransform
            additive="sum"
            attributeName="transform"
            type="translate"
            from="0 0"
            to="-23 -90"
            begin="index_compress.begin"
            dur="500ms"
            fill="freeze"
          />,
          <animateTransform
            additive="sum"
            attributeName="transform"
            type="translate"
            from="0 0"
            to="-43 0"
            begin="assets_compress.begin"
            dur="500ms"
            fill="freeze"
          />,
        ]}
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
        <g opacity="0" transform="translate(182, 190)">
          <rect
            x="83"
            y="40"
            width="100"
            height="50"
            fill="indianred"
            fillOpacity="0.7"
          />
          <rect
            x="230"
            y="40"
            width="199"
            height="50"
            fill="indianred"
            fillOpacity="0.7"
          />
          <animate
            id="unused_fade_in"
            begin="data_timing.end"
            {...fadeInAnimation}
          />
        </g>
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
          text="LiveRates"
          transform="translate(70, -20)"
        />
        <DataBox
          text="Analytics"
          transform="translate(70, 75)"
        />
        <DataBox
          text="Trades"
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
        index.html ~150ms
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
          width: 540,
          duration: 130,
        }}
        download={{ title: "5ms", width: 60, duration: 5 }}
        parse={{
          title: "10ms",
          width: 120,
          duration: 10,
        }}
        animation={[
          <animateTransform
            id="index_compress"
            additive="sum"
            attributeName="transform"
            type="scale"
            from="1 1"
            to="0.05 1"
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
