import { useRef, useEffect } from "react";
import { useSteps } from "mdx-deck";

export default (stepLengths) => {
  const svgRef = useRef();
  const step = useSteps(stepLengths.length);
  const pS = usePrevious(step);
  const previousStep = pS == undefined ? step : pS;

  const accumulatedTime = [0];
  stepLengths.forEach((step) =>
    accumulatedTime.push(
      accumulatedTime[accumulatedTime.length - 1] + step
    )
  );

  const setTime = (time) => {
    if(time === undefined) return;
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
      }, accumulatedTime[step] - accumulatedTime[previousStep]);

      return () => {
        clearTimeout(timer);
        setTime(accumulatedTime[step]);
        pause();
      };
    }
    setTime(accumulatedTime[step]);
    pause();
  }, [step]);

  return svgRef;
};

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
