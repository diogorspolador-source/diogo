import type { CanvasTemplate, TemplateData } from '../CanvasRenderer';
import { drawWrappedText, drawLinearGradient, drawRoundedRect } from '../CanvasRenderer';

export const MetaAd1080x1080: CanvasTemplate = {
  width: 1080,
  height: 1080,
  render(ctx, data: TemplateData) {
    const W = 1080;
    const H = 1080;
    const pad = 60;

    // --- Background gradient ---
    const bg = drawLinearGradient(ctx, 0, 0, W, H, [
      { offset: 0, color: '#0a0a1a' },
      { offset: 0.5, color: '#0d1b2a' },
      { offset: 1, color: '#1a0a2e' },
    ]);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // --- Accent glow top-right ---
    const glow = ctx.createRadialGradient(W * 0.85, H * 0.15, 0, W * 0.85, H * 0.15, 400);
    glow.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
    glow.addColorStop(1, 'rgba(139, 92, 246, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // --- Accent glow bottom-left ---
    const glow2 = ctx.createRadialGradient(W * 0.15, H * 0.85, 0, W * 0.15, H * 0.85, 350);
    glow2.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
    glow2.addColorStop(1, 'rgba(59, 130, 246, 0)');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, W, H);

    // --- Top accent bar ---
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(pad, pad, 80, 6);

    // --- Headline ---
    const headlineY = pad + 50;
    drawWrappedText(ctx, {
      text: data.headline.toUpperCase(),
      x: pad,
      y: headlineY,
      maxWidth: W - pad * 2,
      lineHeight: 110,
      font: 'bold 96px system-ui, -apple-system, sans-serif',
      fillStyle: '#ffffff',
      align: 'left',
      baseline: 'top',
      maxLines: 4,
      shadow: { color: 'rgba(139,92,246,0.5)', blur: 20, offsetX: 0, offsetY: 4 },
    });

    // --- Subheadline ---
    if (data.subheadline) {
      const subY = headlineY + 110 * 3 + 40;
      drawWrappedText(ctx, {
        text: data.subheadline,
        x: pad,
        y: subY,
        maxWidth: W - pad * 2,
        lineHeight: 44,
        font: '500 36px system-ui, -apple-system, sans-serif',
        fillStyle: 'rgba(255,255,255,0.75)',
        align: 'left',
        baseline: 'top',
        maxLines: 2,
      });
    }

    // --- Bottom section ---
    const bottomY = H - 200;

    // Divider line
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, bottomY);
    ctx.lineTo(W - pad, bottomY);
    ctx.stroke();

    // Instructor name
    if (data.instructorName) {
      drawWrappedText(ctx, {
        text: `Prof. ${data.instructorName}`,
        x: pad,
        y: bottomY + 28,
        maxWidth: W - pad * 2 - 280,
        lineHeight: 44,
        font: '600 38px system-ui, -apple-system, sans-serif',
        fillStyle: '#ffffff',
        align: 'left',
        baseline: 'top',
        maxLines: 1,
      });
    }

    // Date badge
    if (data.liveDate) {
      const badgeText = data.liveTime ? `${data.liveDate} • ${data.liveTime}` : data.liveDate;
      const badgeX = W - pad - 260;
      const badgeY = bottomY + 18;
      const badgeW = 260;
      const badgeH = 60;

      // Badge background
      drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 30);
      ctx.fillStyle = 'rgba(139, 92, 246, 0.8)';
      ctx.fill();

      // Badge border
      ctx.strokeStyle = 'rgba(200, 180, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();

      drawWrappedText(ctx, {
        text: badgeText,
        x: badgeX + badgeW / 2,
        y: badgeY + badgeH / 2,
        maxWidth: badgeW - 20,
        lineHeight: 28,
        font: '600 22px system-ui, -apple-system, sans-serif',
        fillStyle: '#ffffff',
        align: 'center',
        baseline: 'middle',
        maxLines: 1,
      });
    }

    // Course name watermark at the very bottom
    if (data.courseName) {
      drawWrappedText(ctx, {
        text: data.courseName,
        x: W / 2,
        y: H - 42,
        maxWidth: W - pad * 2,
        lineHeight: 30,
        font: '400 24px system-ui, -apple-system, sans-serif',
        fillStyle: 'rgba(255,255,255,0.35)',
        align: 'center',
        baseline: 'middle',
        maxLines: 1,
      });
    }
  },
};
