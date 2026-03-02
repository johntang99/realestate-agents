export type StreamEvent =
  | { type: 'status'; message: string }
  | { type: 'tool_start'; name: string }
  | { type: 'tool_result'; name: string; ok: boolean; summary: string; preview?: unknown }
  | { type: 'assistant'; text: string }
  | { type: 'done'; conversationId: string; model: string; answer?: string };

export async function readSseStream(
  response: Response,
  onEvent: (event: StreamEvent) => void
) {
  if (!response.body) throw new Error('No response body');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split('\n\n');
    buffer = chunks.pop() || '';
    for (const chunk of chunks) {
      const line = chunk
        .split('\n')
        .find((row) => row.startsWith('data: '));
      if (!line) continue;
      const payload = line.slice(6);
      try {
        const event = JSON.parse(payload) as StreamEvent;
        onEvent(event);
      } catch {
        // ignore malformed events
      }
    }
  }
}
