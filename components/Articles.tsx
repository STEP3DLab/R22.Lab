"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Share2 } from "lucide-react";
import { Section, Badge, fmtDate, tgShareLink } from "./Step3DShared";
import type { Article } from "./types";

export default function Articles({ items }:{ items:Article[] }){
  const [q, setQ] = useState('');
  const filtered = useMemo(() => items.filter((i) => {
    const hay = (i.title + ' ' + i.excerpt + ' ' + i.tags.join(' ')).toLowerCase();
    return hay.includes(q.toLowerCase());
  }), [items, q]);

  return (
    <Section id="articles" title="Статьи" subtitle="Текстовые материалы по реверс‑инжинирингу, 3D‑печати и методике преподавания.">
      <div className="mb-6 flex items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} />
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Поиск статей…" className="w-full rounded-2xl border border-black py-2 pl-9 pr-3 text-sm outline-none" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {filtered.map((a, idx) => (
          <motion.article key={a.id} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: idx*0.05}} className="group overflow-hidden card">
            {a.cover && (
              <div className="aspect-[16/9] w-full overflow-hidden border-b border-black">
                <img src={a.cover} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]" />
              </div>
            )}
            <div className="space-y-3 p-5">
              <h3 className="text-lg font-black leading-tight">{a.title}</h3>
              <p className="text-sm text-neutral-700 line-clamp-3">{a.excerpt}</p>
              <div className="flex flex-wrap gap-2">
                {a.tags.map((t) => (<Badge key={t}>{t}</Badge>))}
              </div>
              <div className="flex items-center justify-between pt-2 text-xs text-neutral-600">
                <span>{fmtDate(a.date)}</span>
                <a className="inline-flex items-center gap-1 hover:underline" href={tgShareLink({ url: (typeof window !== "undefined" ? window.location.href : "") + '#articles', text: a.title })} target="_blank" rel="noreferrer">
                  <Share2 size={14}/> Поделиться
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
