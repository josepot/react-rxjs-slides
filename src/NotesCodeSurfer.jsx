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
    if (stepNote[step] < 0) return;
    const note = notes[stepNote[step]];

    register(
      index,
      "notes",
      note.props.children.props.children
    );
  }, [step]);

  return <CodeSurfer>{codeFragments}</CodeSurfer>;
}

const childIsNote = (child) =>
  child.props.children.props.className === "language-notes";
