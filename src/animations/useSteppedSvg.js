import { useRef, useEffect, useState } from "react";
import { useSteps } from "mdx-deck";

export default (stepLengths, autoPlay = true) => {
  const [mounted, setMounted] = useState(false);
  const svgRef = useRef();
  const _step = useSteps(
    stepLengths.length - (autoPlay ? 1 : 0)
  );
  const step = _step + (mounted && autoPlay ? 1 : 0);
  const pS = usePrevious(step);
  const previousStep = pS == undefined ? step : pS;

  const accumulatedTime = [0];
  stepLengths.forEach((step) =>
    accumulatedTime.push(
      accumulatedTime[accumulatedTime.length - 1] + step
    )
  );

  const setTime = (time) => {
    if (time === undefined) return;
    // console.log('setTime', time);
    svgRef.current.setCurrentTime(time / 1000);
  };
  const pause = () => {
    // console.log('pause');
    svgRef.current.pauseAnimations();
  };
  const unpause = () => {
    // console.log('unpause');
    svgRef.current.unpauseAnimations();
  };

  // console.log(accumulatedTime, step, previousStep);
  useEffect(() => {
    if (
      accumulatedTime[previousStep] < accumulatedTime[step]
    ) {
      setTime(accumulatedTime[previousStep]);
      unpause();
      const timer = setTimeout(() => {
        setTime(accumulatedTime[step]);
        pause();
      }, accumulatedTime[step] - accumulatedTime[previousStep] - 40);

      return () => {
        clearTimeout(timer);
        setTime(accumulatedTime[step]);
        pause();
      };
    }
    setTime(accumulatedTime[step]);
    pause();
  }, [step]);

  useEffect(() => setMounted(true), []);

  return svgRef;
};

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
