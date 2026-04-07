import type { CanvasTemplate, TemplateData } from '../CanvasRenderer';
import { drawWrappedText, drawLinearGradient, drawRoundedRect } from '../CanvasRenderer';

export const MetaAd1080x1920: CanvasTemplate = {
  width: 1080,
  height: 1920,
  render(ctx, data: TemplateData) {
    const W = 1080;
    const H = 1920;
    const pad = 70;

    // --- Background gradient ---
    const bg = drawLinearGradient(ctx, 0, 0, 0, H, [
      { offset: 0, color: '#050510' },
      { offset: 0.4, color: '#0d1b2a' },
      { offset: 0.8, color: '#1a0a2e' },
      { offset: 1, color: '#0a0a1a' },
    ]);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // --- Center glow ---
    const glow = ctx.createRadialGradient(W / 2, H * 0.35, 0, W / 2, H * 0.35, 550);
    glow.addColorStop(0, 'rgba(139, 92, 246, 0.25)');
    glow.addColorStop(1, 'rgba(139, 92, 246, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // --- Top stripe ---
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(0, 0, W, 8);

    // --- Eyebrow text ---
    const eyebrowY = 80;
    drawWrappedText(ctx, {
      text: 'AULA AO VIVO GRATUITA',
      x: W / 2,
      y: eyebrowY,
      maxWidth: W - pad * 2,
      lineHeight: 40,
      font: '700 28px system-ui, -apple-system, sans-serif',
      fillStyle: '#8b5cf6',
      align: 'center',
      baseline: 'top',
      maxLines: 1,
    });

    // --- Horizontal rule ---
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, eyebrowY + 50);
    ctx.lineTo(W - pad, eyebrowY + 50);
    ctx.stroke();

    // --- Main Headline ---
    const headlineY = 180;
    drawWrappedText(ctx, {
      text: data.headline.toUpperCase(),
      x: W / 2,
      y: headlineY,
      maxWidth: W - pad * 2,
      lineHeight: 130,
      font: 'bold 108px system-ui, -apple-system, sans-serif',
      fillStyle: '#ffffff',
      align: 'center',
      baseline: 'top',
      maxLines: 5,
      shadow: { color: 'rgba(139,92,246,0.6)', blur: 30, offsetX: 0, offsetY: 6 },
    });

    // --- Subheadline ---
    if (data.subheadline) {
      const subY = headlineY + 130 * 4 + 60;
      drawWrappedText(ctx, {
        text: data.subheadline,
        x: W / 2,
        y: subY,
        maxWidth: W - pad * 3,
        lineHeight: 54,
        font: '400 42px system-ui, -apple-system, sans-serif',
        fillStyle: 'rgba(255,255,255,0.75)',
        align: 'center',
        baseline: 'top',
        maxLines: 3,
      });
    }

    // --- CTA Arrow graphic ---
    const arrowY = H * 0.72;
    ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
    ctx.beginPath();
    ctx.arc(W / 2, arrowY, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.6)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#8b5cf6';
    ctx.font = 'bold 50px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('↓', W / 2, arrowY);

    // --- Bottom card ---
    const cardY = H - 380;
    drawRoundedRect(ctx, pad, cardY, W - pad * 2, 300, 24);
    ctx.fillStyle = 'rgba(139, 92, 246, 0.12)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Instructor inside card
    if (data.instructorName) {
      drawWrappedText(ctx, {
        text: `Prof. ${data.instructorName}`,
        x: W / 2,
        y: cardY + 40,
        maxWidth: W - pad * 4,
        lineHeight: 58,
        font: '600 46px system-ui, -apple-system, sans-serif',
        fillStyle: '#ffffff',
        align: 'center',
        baseline: 'top',
        maxLines: 1,
      });
    }

    if (data.liveDate) {
      const dateStr = data.liveTime
        ? `${data.liveDate} às ${data.liveTime}`
        : data.liveDate;
      drawWrappedText(ctx, {
        text: dateStr,
        x: W / 2,
        y: cardY + 120,
        maxWidth: W - pad * 4,
        lineHeight: 50,
        font: '500 40px system-ui, -apple-system, sans-serif',
        fillStyle: '#a78bfa',
        align: 'center',
        baseline: 'top',
        maxLines: 1,
      });
    }

    // Swipe up text
    drawWrappedText(ctx, {
      text: 'DESLIZE PARA CIMA E SE INSCREVA',
      x: W / 2,
      y: cardY + 220,
      maxWidth: W - pad * 4,
      lineHeight: 40,
      font: '700 30px system-ui, -apple-system, sans-serif',
      fillStyle: '#8b5cf6',
      align: 'center',
      baseline: 'top',
      maxLines: 1,
    });

    // Bottom stripe
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(0, H - 8, W, 8);
  },
};
