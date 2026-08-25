import { useEffect, useRef, useState } from "react";

// Types out `text` character by character, like a narrator speaking in real
// time. Respects prefers-reduced-motion by rendering instantly. Calls
// onDone once when typing finishes (or immediately, if reduced motion).
export default function TypewriterText({ text, speed = 16, className = "", onDone }) {
  const [shown, setShown] = useState("");
  const doneRef = useRef(false);

  useEffect(() => {
    doneRef.current = false;
    setShown("");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text);
      doneRef.current = true;
      onDone?.();
      return;
    }

    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        if (!doneRef.current) {
          doneRef.current = true;
          onDone?.();
        }
      }
    }, speed);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const isTyping = shown.length < text.length;

  return (
    <p className={className}>
      {shown}
      {isTyping && (
        <span
          className="inline-block w-1.5 h-3.5 ml-0.5 align-middle bg-current animate-pulse"
          aria-hidden="true"
        />
      )}
    </p>
  );
}