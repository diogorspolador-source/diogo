import React from 'react';

interface StreamingTextProps {
  text: string;
  isStreaming: boolean;
  className?: string;
}

export function StreamingText({ text, isStreaming, className = '' }: StreamingTextProps) {
  return (
    <div className={`streaming-text ${className}`}>
      <pre className="streaming-text-content">
        {text}
        {isStreaming && <span className="streaming-cursor" aria-hidden="true">▋</span>}
      </pre>
    </div>
  );
}
