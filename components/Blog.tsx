"use client";
import { motion } from "framer-motion";
import { Share2 } from "lucide-react";
import { Section, fmtDate, tgShareLink } from "./Step3DShared";
import type { Post } from "./types";

export default function Blog({ items }:{ items:Post[] }){
  return (
    <Section id="blog" title="Блог" subtitle="Новости проекта и короткие заметки.">
      <div className="divide-y">
        {items.map((p, idx) => (
          <motion.div key={p.id} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: idx*0.05}} className="grid gap-2 py-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h4 className="text-base font-black leading-tight">{p.title}</h4>
              <p className="text-sm text-neutral-700">{p.body}</p>
            </div>
            <div className="flex items-center justify-between gap-4 md:justify-end">
              <span className="text-xs text-neutral-600">{fmtDate(p.date)}</span>
              <a className="inline-flex items-center gap-1 text-sm hover:underline" href={tgShareLink({ url: (typeof window !== "undefined" ? window.location.href : "") + '#blog', text: p.title })} target="_blank" rel="noreferrer">
                <Share2 size={14}/> В Telegram
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
