"use client";
import { Menu, X } from "lucide-react";
import { TG_CHANNEL_URL } from "./Step3DShared";

export default function Nav({ open, setOpen }:{ open:boolean; setOpen:(v:boolean)=>void }){
  const items = [
    { href: "#articles", label: "Статьи" },
    { href: "#courses", label: "Курсы" },
    { href: "#blog", label: "Блог" },
    { href: "#about", label: "О проекте" },
  ];
  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-black bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#top" className="text-xl font-black">Step3D</a>
        <nav className="hidden gap-6 md:flex">
          {items.map((i) => (
            <a key={i.href} href={i.href} className="text-sm font-medium hover:underline">
              {i.label}
            </a>
          ))}
          <a href={TG_CHANNEL_URL} target="_blank" className="text-sm font-medium hover:underline">
            Telegram
          </a>
        </nav>
        <button onClick={() => setOpen(!open)} className="md:hidden" aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-black bg-white md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <div className="flex flex-col gap-3">
              <a onClick={() => setOpen(false)} href="#articles">Статьи</a>
              <a onClick={() => setOpen(false)} href="#courses">Курсы</a>
              <a onClick={() => setOpen(false)} href="#blog">Блог</a>
              <a onClick={() => setOpen(false)} href="#about">О проекте</a>
              <a onClick={() => setOpen(false)} href={TG_CHANNEL_URL} target="_blank" rel="noreferrer">Telegram</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
