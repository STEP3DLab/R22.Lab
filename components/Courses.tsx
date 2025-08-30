"use client";
import { motion } from "framer-motion";
import { Share2 } from "lucide-react";
import { Section, Badge, Button, tgShareLink } from "./Step3DShared";
import type { Course } from "./types";

export default function Courses({ items }:{ items:Course[] }){
  return (
    <Section id="courses" title="Курсы" subtitle="Программы обучения с практикой, чек‑листами и шаблонами.">
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((c, idx) => (
          <motion.div key={c.id} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: idx*0.05}} className="overflow-hidden card">
            {c.cover && (
              <div className="aspect-[16/9] w-full overflow-hidden border-b border-black">
                <img src={c.cover} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="space-y-3 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-black leading-tight">{c.title}</h3>
                <Badge>{c.level}</Badge>
                <Badge>{c.duration}</Badge>
              </div>
              <p className="text-sm text-neutral-700">{c.summary}</p>
              <div className="flex gap-2">
                <Button as="a" href="#" className="hover:bg-black hover:text-white">Силлабус</Button>
                <Button as="a" href={tgShareLink({ url: (typeof window !== "undefined" ? window.location.href : "") + '#courses', text: c.title })} target="_blank" className="hover:bg-black hover:text-white"><Share2 size={14}/> Поделиться</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
