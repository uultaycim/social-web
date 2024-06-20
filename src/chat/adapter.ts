import { Adapter, StreamingAdapterObserver } from '@nlux/react';
import { relation } from './relation';

// A demo API by nlux that connects to OpenAI
// and returns a stream of Server-Sent events
const demoProxyServerUrl = 'https://demo.api.nlux.ai/openai/chat/stream';

export const streamAdapter: Adapter = {
  streamText: async (prompt: string, observer: StreamingAdapterObserver) => {
    const body = { prompt };
    const Related = relation(prompt)

    const response = await fetch(demoProxyServerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (response.status !== 200) {
      throw new Error('Failed to connect to the server');
    }

    if (!response.body) {
      return;
    }

    const reader = response.body.getReader();
    const textDecoder = new TextDecoder();
    let doneReading = false;
    let instructionSent = false; // Флаг для отслеживания отправки инструкции
     
    observer.next("Ответы ИИ бывают не точными. Используйте рекомендации с осторожностью!\n\n");
    while (!doneReading) {
      const { value, done } = await reader.read();
      if (done) {
        doneReading = true;
        continue;
      }

      const content = textDecoder.decode(value);
      if (content && Related) {
        observer.next(content);
      } else if (!instructionSent) { // Проверка на отправку инструкции
        observer.next("Вы можете задать вопрос в формате: \
        Что можно приготовить из [ваши продукты]? \
        Дай мне рецепт [желаемое блюдо] \
        У меня [ваше заболевание] составь план питания \
        Диета для [ваш_случай] \
        Составь план питания для [ваш_случай] \
        Расскажи о продукте [продукт]");
        instructionSent = true; // Устанавливаем флаг отправки инструкции в true
      }
    }

    observer.complete();
  }
};
