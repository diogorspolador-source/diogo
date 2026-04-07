import type { Response } from 'express';
import { anthropic } from './client.js';

export async function streamClaudeResponse(
  prompt: string,
  res: Response,
): Promise<void> {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const sendEvent = (data: Record<string, unknown>) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const stream = await anthropic.messages.stream({
      model: 'claude-opus-4-5',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        sendEvent({ type: 'delta', text: event.delta.text });
      }
    }

    const finalMessage = await stream.finalMessage();
    const fullText = finalMessage.content
      .filter((c) => c.type === 'text')
      .map((c) => (c as { type: 'text'; text: string }).text)
      .join('');

    sendEvent({ type: 'done', text: fullText });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    sendEvent({ type: 'error', message });
  } finally {
    res.end();
  }
}
