"use client"
import { useTypewriter } from "@/hooks/useTypewriter";

export default function TypewriterBubble({ text }: { text: string }) {
  const typed = useTypewriter(text, 20); // speed in ms per character

  return (
    <p className="leading-relaxed text-sm md:text-base whitespace-pre-line">
      {typed}
    </p>
  );
}
