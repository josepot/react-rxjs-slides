import { React } from "react";
import useSteppedSvg from "./useSteppedSvg";
import {
  TimingBar,
  Arrow,
  fadeInAnimation,
} from "./common";

export default function SimpleCodeSplit() {
  const ref = useSteppedSvg([
    615 + 450 + 280 + 120, // index + main + analytics + data
    500,
    500,
  ]);

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 768"
      style={{ fontSize: "24px" }}
    >
      <g transform="translate(100, -100)">
        <IndexBox transform="translate(100, 150)" />
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

        <g>
          <Arrow
            transform="translate(337, 319)"
            opacity={0}
            height={30}
            width={20}
          >
            <animate
              {...fadeInAnimation}
              begin="main_timing.end"
            />
          </Arrow>
          <g transform="translate(357, 309)">
            <ChunkBox
              text="LiveRates-chunk.js"
              size={5}
              prefix="liverates"
            />
            <Arrow
              transform="translate(32, 89)"
              opacity={0}
              height={30}
              width={20}
            >
              <animate
                {...fadeInAnimation}
                begin="liverates_timing.end"
              />
            </Arrow>
            <DataBox
              transform="translate(52, 78)"
              text="LiveRates"
              begin="liverates_timing.end"
            />
          </g>
          <Arrow
            transform="translate(337, 349)"
            opacity={0}
            height={165}
            width={20}
          >
            <animate
              {...fadeInAnimation}
              begin="main_timing.end"
            />
          </Arrow>
          <g transform="translate(357, 475)">
            <ChunkBox
              text="Analytics-chunk.js"
              size={20}
              prefix="analytics"
            />
            <Arrow
              transform="translate(69, 89)"
              opacity={0}
              height={30}
              width={20}
            >
              <animate
                {...fadeInAnimation}
                begin="analytics_timing.end"
              />
            </Arrow>
            <DataBox
              transform="translate(89, 78)"
              text="Analytics"
              begin="analytics_timing.end"
            />
          </g>
          <Arrow
            transform="translate(337, 515)"
            opacity={0}
            height={165}
            width={20}
          >
            <animate
              {...fadeInAnimation}
              begin="main_timing.end"
            />
          </Arrow>
          <g transform="translate(357, 641)">
            <ChunkBox
              text="Trades-chunk.js"
              size={10}
              prefix="trades"
            />
            <Arrow
              transform="translate(45, 89)"
              opacity={0}
              height={30}
              width={20}
            >
              <animate
                {...fadeInAnimation}
                begin="trades_timing.end"
              />
            </Arrow>
            <DataBox
              transform="translate(65, 78)"
              text="Trades"
              begin="trades_timing.end"
            />
          </g>
          
          <animateTransform
            id="main_expand"
            additive="sum"
            attributeName="transform"
            type="translate"
            from="0 0"
            to="116 0"
            begin="main_expand.begin"
            dur="500ms"
            fill="freeze"
          />
          <animateTransform
            id="main_compress"
            additive="sum"
            attributeName="transform"
            type="translate"
            from="0 0"
            to="-116 0"
            begin="main_compress.begin"
            dur="500ms"
            fill="freeze"
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
        <animate
          {...fadeInAnimation}
        />
      </text>
      <TimingBar
        prefix="index"
        ttfb={{
          width: 26,
          duration: 130,
        }}
        download={{ width: 8, duration: 5 }}
        parse={{
          width: 70,
          duration: 480,
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
        animation={[
          <animateTransform
            id="main_expand"
            additive="sum"
            attributeName="transform"
            type="scale"
            from="1 1"
            to="2 1"
            begin="Analytics_timing.end"
            dur="500ms"
            fill="freeze"
          />,
          <animateTransform
            id="main_compress"
            additive="sum"
            attributeName="transform"
            type="scale"
            from="1 1"
            to="0.5 1"
            begin="main_expand.end"
            dur="500ms"
            fill="freeze"
          />,
        ]}
      />
    </g>
  );
};

const ChunkBox = ({ text, prefix, size, ...props }) => {
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
        prefix={prefix}
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

const DataBox = ({ text, begin, ...props }) => {
  return (
    <g {...props}>
      <text x="0" y="30" fill="white" opacity="0">
        {text}
        <animate begin={begin} {...fadeInAnimation} />
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
        begin={begin}
        transform="translate(0, 40)"
      />
    </g>
  );
};
