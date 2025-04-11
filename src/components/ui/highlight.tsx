
import React from 'react';

interface HighlightProps {
  text: string;
  highlight: string;
}

export function Highlight({ text, highlight }: HighlightProps) {
  if (!highlight.trim()) {
    return <>{text}</>;
  }
  
  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => (
        regex.test(part) ? (
          <span key={i} className="bg-yellow-100 text-yellow-900">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      ))}
    </>
  );
}
