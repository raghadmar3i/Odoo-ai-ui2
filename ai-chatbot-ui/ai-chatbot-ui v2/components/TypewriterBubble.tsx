
"use client"
import { useTypewriter } from "../hooks/use-Typewriter"

export default function TypewriterBubble({ text }: { text: string }) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scroll = () => bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  const typed = useTypewriter(text, 20, scroll);

  return (
    <>
      <p className="leading-relaxed text-sm md:text-base whitespace-pre-line">{typed}</p>
      <div ref={bottomRef} />
    </>
  );
}

