import type { CanvasTemplate, TemplateData } from '../CanvasRenderer';
import { drawWrappedText, drawLinearGradient, drawRoundedRect } from '../CanvasRenderer';

export const YoutubeThumbnail: CanvasTemplate = {
  width: 1280,
  height: 720,
  render(ctx, data: TemplateData) {
    const W = 1280;
    const H = 720;
    const pad = 56;

    // --- Background ---
    const bg = drawLinearGradient(ctx, 0, 0, W, H, [
      { offset: 0, color: '#09090b' },
      { offset: 0.6, color: '#0f0f1a' },
      { offset: 1, color: '#1a0a1e' },
    ]);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // --- Left glow for headline area ---
    const glowL = ctx.createRadialGradient(W * 0.25, H * 0.5, 0, W * 0.25, H * 0.5, 380);
    glowL.addColorStop(0, 'rgba(139, 92, 246, 0.2)');
    glowL.addColorStop(1, 'rgba(139, 92, 246, 0)');
    ctx.fillStyle = glowL;
    ctx.fillRect(0, 0, W, H);

    // --- Right placeholder area (for photo) ---
    const photoX = W * 0.58;
    const photoW = W - photoX - pad;
    const photoH = H - pad * 2;

    drawRoundedRect(ctx, photoX, pad, photoW, photoH, 16);
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Photo placeholder text
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '500 22px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('📸 FOTO DO INSTRUTOR', photoX + photoW / 2, pad + photoH / 2);

    // --- Left content (headline area) ---
    const leftW = W * 0.56 - pad * 1.5;

    // Top accent bar
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(pad, pad, 60, 7);

    // Headline — BIG
    drawWrappedText(ctx, {
      text: data.headline.toUpperCase(),
      x: pad,
      y: pad + 36,
      maxWidth: leftW,
      lineHeight: 128,
      font: 'bold 112px system-ui, -apple-system, sans-serif',
      fillStyle: '#ffffff',
      align: 'left',
      baseline: 'top',
      maxLines: 3,
      shadow: { color: 'rgba(139,92,246,0.7)', blur: 24, offsetX: 0, offsetY: 4 },
    });

    // Subheadline
    if (data.subheadline) {
      const subY = pad + 36 + 128 * 2.8;
      drawWrappedText(ctx, {
        text: data.subheadline.toUpperCase(),
        x: pad,
        y: subY,
        maxWidth: leftW,
        lineHeight: 50,
        font: '700 40px system-ui, -apple-system, sans-serif',
        fillStyle: '#a78bfa',
        align: 'left',
        baseline: 'top',
        maxLines: 2,
      });
    }

    // Instructor name at bottom left
    if (data.instructorName) {
      // Small badge
      const badgeY = H - pad - 48;
      drawRoundedRect(ctx, pad, badgeY, 280, 48, 24);
      ctx.fillStyle = 'rgba(139, 92, 246, 0.7)';
      ctx.fill();

      drawWrappedText(ctx, {
        text: `Prof. ${data.instructorName}`,
        x: pad + 140,
        y: badgeY + 24,
        maxWidth: 260,
        lineHeight: 30,
        font: '600 22px system-ui, -apple-system, sans-serif',
        fillStyle: '#ffffff',
        align: 'center',
        baseline: 'middle',
        maxLines: 1,
      });
    }

    // Border frame
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, W - 4, H - 4);
  },
};
