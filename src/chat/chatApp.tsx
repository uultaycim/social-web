import {useMemo} from 'react';
import {AiChat} from '@nlux/react';
import '@nlux/themes/nova.css';
import './custom-nova-theme.css';
import {streamAdapter} from './adapter';
import { botStyle } from './personas';

export default () => {
  const adapter = useMemo(() => streamAdapter, []);
  return (
    <AiChat
      className="custom-ai-chat-comp"
      adapter={adapter}
      personaOptions={{
        bot: {
          name: 'iBot',
          picture: <span style={botStyle}>🤖</span>,
          tagline: `Вы можете задать вопрос в формате:\n
          Что можно приготовить из [ваши продукты]?\n
          Дай мне рецепт [желаемое блюдо]\n
          У меня [ваше заболевание] составь план питания\n
          Диета для [ваш_случай]\n
          Составь план питания для [ваш_случай]\n
          Расскажи о продукте [продукт]`
          
        },
        user
      }}
      layoutOptions={{
        height: 700,
        maxWidth: 900
      }}
    />
  );
};