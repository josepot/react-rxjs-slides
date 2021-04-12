import React, { useContext, useEffect } from "react";
import { CodeSurfer } from "code-surfer";
import DeckContext from "gatsby-theme-mdx-deck/src/context";

export default function NotesCodeSurfer({ children }) {
  const { index, step, register } = useContext(DeckContext);

  const allChildren = React.Children.toArray(children);
  const codeFragments = allChildren.filter(
    (child) => !childIsNote(child)
  );
  const notes = allChildren.filter(childIsNote);

  const stepNote = codeFragments.map(
    (child, i) => allChildren.indexOf(child) - i - 1
  );

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const note = notes[stepNote[step]];
    if (!note) return;
    const metastring =
      note.props.children &&
      note.props.children.props.metastring;
    if (metastring && metastring.startsWith("checkout:")) {
      const path = metastring.split(":")[1];
      console.log("loading", path);
      fetch(`http://localhost:1714/${path}`, {
        method: "POST",
        signal,
      }).catch((err) => {
        if (err.name !== "AbortError") {
          console.log("Error with the request", path, err);
        }
      });
    }

    register(
      index,
      "notes",
      note //.props.children.props.children
    );

    return () => {
      controller.abort();
    };
  }, [step]);

  return <CodeSurfer>{codeFragments}</CodeSurfer>;
}

const childIsNote = (child) =>
  child.props.children.props.className === "language-notes";
