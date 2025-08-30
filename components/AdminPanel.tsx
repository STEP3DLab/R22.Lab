"use client";
import { useMemo, useState } from "react";
import { X, Pencil, Plus, Save, Trash2, Search } from "lucide-react";
import { cx } from "./Step3DShared";
import type { DataShape, Article, Course, Post } from "./types";

export default function AdminPanel({ data, setData }:{ data:DataShape; setData:(updater:(d:DataShape)=>DataShape)=>void; }){
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<keyof DataShape>('articles');
  const [query, setQuery] = useState('');

  const list = data[mode] as (Article[]|Course[]|Post[]);
  const filtered = useMemo(() => list.filter((i:any) => JSON.stringify(i).toLowerCase().includes(query.toLowerCase())), [list, query]);

  const addBlank = () => {
    const id = Math.random().toString(36).slice(2, 9);
    const blank = mode === 'articles'
      ? { id, title:'Новый материал', excerpt:'…', tags:[], date:new Date().toISOString().slice(0,10), cover:'' } as Article
      : mode === 'courses'
      ? { id, title:'Новый курс', level:'Начальный', duration:'8 часов', summary:'…', cover:'' } as Course
      : { id, title:'Новый пост', date:new Date().toISOString().slice(0,10), body:'…' } as Post;
    setData((d)=> ({ ...d, [mode]: [blank, ...(d[mode] as any[])] } as DataShape));
  };

  const save = () => { setOpen(false); };
  const remove = (id:string) => setData((d)=> ({ ...d, [mode]: (d[mode] as any[]).filter((x:any)=> x.id!==id) } as DataShape));

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-black bg-white px-4 py-2 text-sm font-medium shadow-md hover:-translate-y-0.5 transition-transform"
        title="Редактировать контент (демо)"
      >
        <Pencil size={16}/> Редактировать
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-black bg-white p-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-black">Админ‑панель (демо, без бэкенда)</h3>
              <button onClick={() => setOpen(false)} className="rounded-full border border-black p-2" aria-label="Close admin"><X size={16}/></button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {(['articles','courses','posts'] as (keyof DataShape)[]).map((m) => (
                <button key={m} onClick={() => setMode(m)} className={cx('rounded-full border px-3 py-1 text-xs', mode===m?'bg-black text-white':'bg-white')}>{m}</button>
              ))}
              <div className="ml-auto flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2" size={16} />
                  <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Поиск…" className="rounded-full border border-black pl-8 pr-3 py-1 text-sm outline-none"/>
                </div>
                <button onClick={addBlank} className="inline-flex items-center gap-1 rounded-full border border-black px-3 py-1 text-xs"><Plus size={14}/> Добавить</button>
                <button onClick={save} className="inline-flex items-center gap-1 rounded-full border border-black px-3 py-1 text-xs"><Save size={14}/> Сохранить</button>
              </div>
            </div>

            <div className="mt-4 max-h-[60vh] overflow-auto divide-y">
              {filtered.map((item:any) => (
                <EditorRow key={item.id} item={item} mode={mode} onChange={(patch:any)=>{
                  setData((d)=> ({ ...d, [mode]: (d[mode] as any[]).map((x:any)=> x.id===item.id?{...x, ...patch}:x) } as DataShape));
                }} onDelete={()=>remove(item.id)} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function EditorRow({ item, mode, onChange, onDelete }:{ item:any; mode:keyof DataShape; onChange:(patch:any)=>void; onDelete:()=>void; }){
  return (
    <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-6 md:items-center">
      <input className="col-span-2 rounded-xl border border-black px-3 py-2 text-sm" value={item.title||""} onChange={(e)=>onChange({ title:e.target.value })} />
      {mode!=="courses" && (
        <input className="rounded-xl border border-black px-3 py-2 text-sm" value={item.date||""} onChange={(e)=>onChange({ date:e.target.value })} />
      )}
      {mode==="articles" && (
        <input className="rounded-xl border border-black px-3 py-2 text-sm" placeholder="cover URL" value={item.cover||""} onChange={(e)=>onChange({ cover:e.target.value })} />
      )}
      {mode==="articles" && (
        <input className="md:col-span-2 rounded-xl border border-black px-3 py-2 text-sm" value={item.excerpt||""} onChange={(e)=>onChange({ excerpt:e.target.value })} />
      )}
      {mode==="courses" && (
        <>
          <input className="rounded-xl border border-black px-3 py-2 text-sm" value={item.level||""} onChange={(e)=>onChange({ level:e.target.value })} />
          <input className="rounded-xl border border-black px-3 py-2 text-sm" value={item.duration||""} onChange={(e)=>onChange({ duration:e.target.value })} />
          <input className="md:col-span-2 rounded-xl border border-black px-3 py-2 text-sm" value={item.summary||""} onChange={(e)=>onChange({ summary:e.target.value })} />
        </>
      )}
      {mode==="posts" && (
        <input className="md:col-span-3 rounded-xl border border-black px-3 py-2 text-sm" value={item.body||""} onChange={(e)=>onChange({ body:e.target.value })} />
      )}
      <button onClick={onDelete} className="justify-self-start rounded-xl border border-black px-3 py-2 text-sm text-red-600 hover:bg-red-50" aria-label="Delete"><Trash2 size={16}/></button>
    </div>
  );
}
