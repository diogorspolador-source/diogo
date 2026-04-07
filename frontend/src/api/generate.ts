export type SSEEventType = 'delta' | 'done' | 'error';

export interface SSEEvent {
  type: SSEEventType;
  text?: string;
  message?: string;
}

type OnDelta = (text: string) => void;
type OnDone = (fullText: string) => void;
type OnError = (message: string) => void;

async function streamGenerate(
  endpoint: string,
  launchId: string,
  onDelta: OnDelta,
  onDone: OnDone,
  onError: OnError,
): Promise<void> {
  const response = await fetch(`/api/generate/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ launchId }),
  });

  if (!response.ok || !response.body) {
    let message = `Erro HTTP ${response.status}`;
    try {
      const body = await response.json();
      message = body.error ?? message;
    } catch { /* ignore */ }
    onError(message);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const jsonStr = line.slice(6).trim();
      if (!jsonStr) continue;
      try {
        const event = JSON.parse(jsonStr) as SSEEvent;
        if (event.type === 'delta' && event.text) {
          onDelta(event.text);
        } else if (event.type === 'done' && event.text) {
          onDone(event.text);
        } else if (event.type === 'error') {
          onError(event.message ?? 'Erro desconhecido');
        }
      } catch { /* ignore malformed */ }
    }
  }
}

export const generateApi = {
  metaAdsCopy: (launchId: string, onDelta: OnDelta, onDone: OnDone, onError: OnError) =>
    streamGenerate('meta-ads-copy', launchId, onDelta, onDone, onError),

  landingPageCopy: (launchId: string, onDelta: OnDelta, onDone: OnDone, onError: OnError) =>
    streamGenerate('landing-page-copy', launchId, onDelta, onDone, onError),

  salesPageCopy: (launchId: string, onDelta: OnDelta, onDone: OnDone, onError: OnError) =>
    streamGenerate('sales-page-copy', launchId, onDelta, onDone, onError),

  youtubeThumbnail: (launchId: string, onDelta: OnDelta, onDone: OnDone, onError: OnError) =>
    streamGenerate('youtube-thumbnail', launchId, onDelta, onDone, onError),
};
