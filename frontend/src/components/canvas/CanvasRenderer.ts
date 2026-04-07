export interface TextOptions {
  text: string;
  x: number;
  y: number;
  maxWidth: number;
  lineHeight: number;
  font: string;
  fillStyle: string;
  align?: CanvasTextAlign;
  baseline?: CanvasTextBaseline;
  maxLines?: number;
  shadow?: { color: string; blur: number; offsetX: number; offsetY: number };
}

export interface GradientStop {
  offset: number;
  color: string;
}

export interface CanvasTemplate {
  width: number;
  height: number;
  render: (ctx: CanvasRenderingContext2D, data: TemplateData) => void;
}

export interface TemplateData {
  headline: string;
  subheadline?: string;
  instructorName?: string;
  liveDate?: string;
  liveTime?: string;
  courseName?: string;
  price?: string;
}

/**
 * Wraps text onto multiple lines within maxWidth.
 * Returns the number of lines drawn.
 */
export function drawWrappedText(ctx: CanvasRenderingContext2D, opts: TextOptions): number {
  const {
    text,
    x,
    y,
    maxWidth,
    lineHeight,
    font,
    fillStyle,
    align = 'left',
    baseline = 'top',
    maxLines,
    shadow,
  } = opts;

  ctx.font = font;
  ctx.fillStyle = fillStyle;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;

  if (shadow) {
    ctx.shadowColor = shadow.color;
    ctx.shadowBlur = shadow.blur;
    ctx.shadowOffsetX = shadow.offsetX;
    ctx.shadowOffsetY = shadow.offsetY;
  } else {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const { width } = ctx.measureText(testLine);
    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
      if (maxLines && lines.length >= maxLines) break;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine && !(maxLines && lines.length >= maxLines)) {
    lines.push(currentLine);
  }

  // Trim to maxLines
  const renderLines = maxLines ? lines.slice(0, maxLines) : lines;

  renderLines.forEach((line, i) => {
    ctx.fillText(line, x, y + i * lineHeight, maxWidth);
  });

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  return renderLines.length;
}

export function drawLinearGradient(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  stops: GradientStop[],
): CanvasGradient {
  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  for (const stop of stops) {
    gradient.addColorStop(stop.offset, stop.color);
  }
  return gradient;
}

export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}
