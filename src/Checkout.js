export default function Checkout({ branch, commitIdx }) {
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(`https://localhost:1714/${branch}/${commitIdx}`, {
      method: "POST",
      signal,
    }).catch((err) => {
      if (err.name !== "AbortError") {
        console.log(
          "Error with the request",
          branch,
          commitIdx,
          err
        );
      }
    });

    return () => {
      controller.abort();
    };
  }, [branch, commit]);
  return null;
}
