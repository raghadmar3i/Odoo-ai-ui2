// hooks/use-Typewriter.ts
import { useState, useEffect } from "react";

export function useTypewriter(text: string = "", speed = 30, onChar?: () => void) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!text || typeof text !== "string") {
      setDisplayed("");
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed((prev) => prev + text.charAt(i));
        onChar?.();
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return displayed;
}
