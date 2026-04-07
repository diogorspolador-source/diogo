import React, { useState } from 'react';
import { Button } from '../ui/Button';

interface CopyBlockProps {
  title: string;
  content: string;
  isStreaming?: boolean;
  onRegenerate?: () => void;
  className?: string;
}

export function CopyBlock({ title, content, isStreaming = false, onRegenerate, className = '' }: CopyBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for non-secure contexts
      const textarea = document.createElement('textarea');
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`copy-block ${className}`}>
      <div className="copy-block-header">
        <h4 className="copy-block-title">{title}</h4>
        <div className="copy-block-actions">
          {onRegenerate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              disabled={isStreaming}
            >
              Regenerar
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            disabled={isStreaming || !content}
          >
            {copied ? 'Copiado!' : 'Copiar'}
          </Button>
        </div>
      </div>
      <div className="copy-block-content">
        <pre className="copy-block-text">
          {content}
          {isStreaming && <span className="streaming-cursor" aria-hidden="true">▋</span>}
        </pre>
      </div>
    </div>
  );
}
