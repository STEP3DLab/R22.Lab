"use client";
import { ExternalLink } from "lucide-react";
import { Section, Button, TG_CHANNEL_URL } from "./Step3DShared";

export default function About(){
  return (
    <Section id="about" title="О проекте Step3D" subtitle="Обучение реверс‑инжинирингу, CAD и 3D‑печати. ЧБ‑стиль интерфейса, цветные изображения как акценты.">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-neutral-800">
            Step3D — это образовательная площадка для инженеров и преподавателей. Мы публикуем практические статьи, курсы и заметки, а также делимся обновлениями в Telegram.
          </p>
          <div className="flex gap-2">
            <Button as="a" href={TG_CHANNEL_URL} target="_blank" className="hover:bg-black hover:text-white">
              Подписаться в Telegram <ExternalLink size={16}/>
            </Button>
          </div>
          <div className="rounded-2xl border border-black p-3 text-sm text-neutral-700 bg-[rgba(0,0,0,0.02)]">
            <p className="mb-1 font-semibold">Виджет Telegram (встраивание постов)</p>
            <p>Для продакшена подключите скрипт <code>https://telegram.org/js/telegram-widget.js</code> и используйте тег <code>&lt;div class=&quot;telegram-post&quot; data-telegram-post=&quot;CHANNEL/POST_ID&quot;&gt;</code>.</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-black">
          <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1400&auto=format&fit=crop" alt="Step3D" className="h-full w-full object-cover"/>
        </div>
      </div>
    </Section>
  );
}
