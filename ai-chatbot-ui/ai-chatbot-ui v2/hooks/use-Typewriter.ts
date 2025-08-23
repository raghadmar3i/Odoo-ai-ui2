import { useState, useEffect } from "react";

export function useTypewriter(text: string, speed = 30, onChar?: () => void) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text[i]);
      i++;
      if (onChar) onChar(); // 👈 trigger on each character
      if (i >= text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return displayed;
}

