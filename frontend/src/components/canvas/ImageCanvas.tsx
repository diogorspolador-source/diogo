import React, { useRef, useEffect } from 'react';
import type { CanvasTemplate, TemplateData } from './CanvasRenderer';

interface ImageCanvasProps {
  template: CanvasTemplate;
  data: TemplateData;
  scale?: number;
  className?: string;
}

export function ImageCanvas({ template, data, scale = 0.3, className = '' }: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set actual pixel dimensions
    canvas.width = template.width;
    canvas.height = template.height;

    // Clear
    ctx.clearRect(0, 0, template.width, template.height);

    // Render template
    template.render(ctx, data);
  }, [template, data]);

  const displayWidth = Math.round(template.width * scale);
  const displayHeight = Math.round(template.height * scale);

  return (
    <canvas
      ref={canvasRef}
      width={template.width}
      height={template.height}
      style={{ width: displayWidth, height: displayHeight }}
      className={`canvas-preview ${className}`}
    />
  );
}
