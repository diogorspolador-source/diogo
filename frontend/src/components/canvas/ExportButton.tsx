import React, { useRef } from 'react';
import type { CanvasTemplate, TemplateData } from './CanvasRenderer';
import { Button } from '../ui/Button';

interface ExportButtonProps {
  template: CanvasTemplate;
  data: TemplateData;
  filename?: string;
}

export function ExportButton({ template, data, filename = 'imagem' }: ExportButtonProps) {
  const exportCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.width = template.width;
    canvas.height = template.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    template.render(ctx, data);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  return (
    <Button variant="secondary" size="sm" onClick={exportCanvas}>
      Exportar PNG
    </Button>
  );
}
