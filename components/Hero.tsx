"use client";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Button, TG_CHANNEL_URL } from "./Step3DShared";

export default function Hero(){
  return (
    <section className="border-b border-black bg-white pt-20 reading-grid" id="top">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <motion.h1 initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.5}} className="text-5xl md:text-6xl font-black leading-[1.05] tracking-tight">
              Step3D — статьи и курсы по реверс‑инжинирингу и 3D‑печати
            </motion.h1>
            <p className="mt-5 content text-base text-neutral-700 leading-relaxed">
              Минималистичный ЧБ‑интерфейс с цветными изображениями как визуальными акцентами. Быстрый деплой на GitHub Pages, интеграция с Telegram.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button as="a" href="#articles" className="hover:bg-black hover:text-white">Читать статьи</Button>
              <Button as="a" href={TG_CHANNEL_URL} target="_blank" className="hover:bg-black hover:text-white">Подписаться в Telegram <ExternalLink size={16}/></Button>
            </div>
          </div>
          <motion.div initial={{opacity:0, scale:0.98}} animate={{opacity:1, scale:1}} transition={{duration:0.5}} className="overflow-hidden rounded-3xl border border-black">
            <img src="https://images.unsplash.com/photo-1546069901-eacef0df6022?q=80&w=1400&auto=format&fit=crop" alt="Hero" className="h-full w-full object-cover"/>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
