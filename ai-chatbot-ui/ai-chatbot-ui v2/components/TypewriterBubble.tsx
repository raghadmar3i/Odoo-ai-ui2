
"use client"
import { useTypewriter } from "../hooks/use-Typewriter"
import { useRef } from "react"


export default function TypewriterBubble({ text = "" }: { text?: string }) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const scroll = () => bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  const typed = useTypewriter(text, 20, scroll);

  return (
    <>
      <p className="leading-normal text-sm md:text-base whitespace-pre-line py-1">
      {typed}</p>
      <div ref={bottomRef} />
    </>
  );
}


