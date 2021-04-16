import { React } from "react";

const keyframes = `
  @keyframes wink {
    0% {
      transform: rotate(-15deg);
    }
    10% {
      transform: rotate(15deg);
    }
    20% {
      transform: rotate(-15deg);
    }
    30%, 100% {
      transform: rotate(15deg);
    }
  }
`;

export default () => {
  const styleSheet = document.styleSheets[0];

  styleSheet.insertRule(
    keyframes,
    styleSheet.cssRules.length
  );

  return (
    <span
      style={{
        animationName: "wink",
        animationDuration: "1.5s",
        animationIterationCount: "infinite",
        animationDirection: "alternate",
        animationTimingFunction:
          "cubic-bezier(.61,.01,.5,.97)",
        animationDelay: "1.5s",
        display: "inline-block",
      }}
    >
      👋
    </span>
  );
};
