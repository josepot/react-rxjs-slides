import { React } from "react";
import useSteppedSvg from "./useSteppedSvg";
import {
  Arrow,
  fadeInAnimation,
  fadeOutAnimation,
  TimingBar,
} from "./common";

export default function EagerRequests() {
  const ref = useSteppedSvg([
    145 + 450 + 380, // index + main + analytics
    500 + 120, // move_chunks + arrows
  ]);

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 768"
      style={{ fontSize: "24px" }}
    >
      <g transform="translate(150, -100)">
        <IndexBox transform="translate(170, 150)" />
        <Arrow
          transform="translate(203, 240)"
          opacity={0}
          height={30}
          width={20}
        >
          <animate
            {...fadeInAnimation}
            begin="index_timing.end"
          />
        </Arrow>
        <MainBox transform="translate(223, 230)" />

        <g opacity="0" transform="translate(337, 319)">
          <Arrow height={30} width={20} />
          <Arrow height={90} width={20} transform="translate(0, 30)" />
          <Arrow height={90} width={20} transform="translate(0, 120)" />
          <g>
            <Arrow height={90} width={20} transform="translate(0, 210)" />
            <Arrow height={90} width={20} transform="translate(0, 300)" />
            <Arrow height={90} width={20} transform="translate(0, 390)" />
            <animate {...fadeOutAnimation} begin="analytics_timing.end" />
          </g>
          <animate
            {...fadeInAnimation}
            begin="main_timing.end"
          />
        </g>

        <g transform="translate(357, 309)">
          <DataBox
            text="LiveRates"
          />
          <DataBox
            transform="translate(0, 90)"
            text="Analytics"
          />
          <DataBox
            transform="translate(0, 180)"
            text="Trades"
          />
          <g>
            <ChunkBox
              text="LiveRates-chunk.js"
              size={10}
              transform="translate(0, 270)"
            />
            <ChunkBox
              prefix="analytics"
              text="Analytics-chunk.js"
              size={30}
              transform="translate(0, 360)"
            />
            <ChunkBox
              text="Trades-chunk.js"
              size={15}
              transform="translate(0, 450)"
            />
            <animateTransform
              id="move_chunks"
              additive="sum"
              attributeName="transform"
              type="translate"
              from="0 0"
              to="-134 0"
              begin="analytics_timing.end"
              dur="500ms"
              fill="freeze"
            />
          </g>
        </g>

        <g opacity="0" transform="translate(203, 270)">
          <Arrow height={350} width={20} />
          <Arrow height={90} width={20} transform="translate(0, 350)" />
          <Arrow height={90} width={20} transform="translate(0, 440)" />
          <animate
            {...fadeInAnimation}
            begin="move_chunks.end"
          />
        </g>
      </g>
    </svg>
  );
}

const IndexBox = ({ ...props }) => {
  return (
    <g {...props}>
      <text x="0" y="30" fill="white" opacity="0">
        index.html
        <animate {...fadeInAnimation} />
      </text>
      <TimingBar
        prefix="index"
        ttfb={{
          width: 20,
          duration: 130,
        }}
        download={{ width: 5, duration: 5 }}
        parse={{
          width: 8,
          duration: 10,
        }}
        transform="translate(0, 40)"
      />
    </g>
  );
};

const MainBox = ({ ...props }) => {
  return (
    <g {...props}>
      <text x="0" y="30" fill="white" opacity="0">
        main.js
        <animate
          begin="index_timing.end"
          {...fadeInAnimation}
        />
      </text>
      <TimingBar
        prefix="main"
        ttfb={{
          width: 25,
          duration: 100,
        }}
        download={{
          width: 35,
          duration: 150,
        }}
        parse={{
          width: 55,
          duration: 200,
        }}
        begin="index_timing.end"
        transform="translate(0, 40)"
      />
    </g>
  );
};

const ChunkBox = ({ text, size, prefix, ...props }) => {
  return (
    <g {...props}>
      <text x="0" y="30" fill="white" opacity="0">
        {text}
        <animate
          begin="main_timing.end"
          {...fadeInAnimation}
        />
      </text>
      <TimingBar
        prefix={prefix || text}
        ttfb={{
          width: 20,
          duration: 80,
        }}
        download={{
          width: size,
          duration: size * 4,
        }}
        parse={{
          width: size * 1.5,
          duration: size * 1.5 * 4,
        }}
        begin="main_timing.end"
        transform="translate(0, 40)"
      />
    </g>
  );
};

const DataBox = ({ text, ...props }) => {
  return (
    <g {...props}>
      <text x="0" y="30" fill="white" opacity="0">
        {text}
        <animate begin="main_timing.end" {...fadeInAnimation} />
      </text>
      <TimingBar
        prefix={text}
        ttfb={{
          width: 20,
          duration: 80,
        }}
        download={{
          width: 10,
          duration: 40,
        }}
        parse={{
          width: 0,
          duration: 0,
        }}
        begin="main_timing.end"
        transform="translate(0, 40)"
      />
    </g>
  );
};
