"use client";
import { TG_CHANNEL_URL } from "./Step3DShared";

export default function Footer(){
  return (
    <footer className="border-t border-black bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-medium">© {new Date().getFullYear()} Step3D</p>
          <div className="flex flex-wrap items-center gap-3">
            <a className="hover:underline" href={TG_CHANNEL_URL} target="_blank" rel="noreferrer">Telegram</a>
            <a className="hover:underline" href="#" title="GitHub репозиторий (добавьте ссылку)">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
