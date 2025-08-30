"use client";
import { useEffect, useState } from "react";
import Nav from "./Nav";
import Hero from "./Hero";
import Articles from "./Articles";
import Courses from "./Courses";
import Blog from "./Blog";
import About from "./About";
import Footer from "./Footer";
import AdminPanel from "./AdminPanel";
import { cx, fmtDate, tgShareLink } from "./Step3DShared";
import type { DataShape } from "./types";

// =============================
// Global fonts & design tokens
// =============================
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Bricolage+Grotesque:wght@600;700;800&display=swap');
  :root{
    --bg:#ffffff; --fg:#111111; --muted:#6b7280; --border:#111111; --card:#ffffff; --shadow:0 2px 0 #111, 0 6px 24px rgba(0,0,0,.06);
    --radius:18px; --radius-lg:24px; --radius-xl:28px;
    --lead:1.7; --lead-tight:1.3; --max:72rem; --content:42rem;
  }
  html{ scroll-behavior:smooth }
  body{ background:var(--bg); color:var(--fg); font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,'Helvetica Neue',Arial,sans-serif; font-size:16.5px; line-height:var(--lead); -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility; }
  h1,h2,h3,h4{ font-family:'Bricolage Grotesque', Inter, system-ui, sans-serif; letter-spacing:-0.01em; }
  .container{ max-width:var(--max); margin-inline:auto; padding:0 1rem; }
  .content{ max-width:var(--content); }
  .card{ background:var(--card); border:1px solid var(--border); border-radius:var(--radius-lg); box-shadow:var(--shadow); }
  .btn{ border:1px solid var(--border); border-radius:calc(var(--radius) + 2px); padding:.625rem 1rem; font-weight:600; display:inline-flex; align-items:center; gap:.5rem; background:var(--bg); transition:transform .15s ease; }
  .btn:hover{ transform:translateY(-1px); }
  .badge{ border:1px solid var(--border); border-radius:999px; padding:.3rem .7rem; font-size:.72rem; text-transform:uppercase; letter-spacing:.08em; }
  .muted{ color:var(--muted); }
  .kicker{ font-size:.78rem; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); }
  .line-clamp-3{ display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
  .reading-grid{ background:linear-gradient(transparent 31px, rgba(0,0,0,.04) 32px) repeat-y; background-size:100% 32px; }
`;

function useInjectGlobal(){
  useEffect(()=>{
    if(!document.getElementById('step3d-global')){
      const s = document.createElement('style');
      s.id = 'step3d-global';
      s.innerHTML = globalStyles;
      document.head.appendChild(s);
    }
  },[]);
}

// =============================
// Seed data (localStorage on first run)
// =============================
const seed: DataShape = {
  articles: [
    { id:"a-1", title:"Базовые принипы реверс‑инжиниринга", excerpt:"Что такое реверс‑инжиниринг, как строить процесс, инструменты и кейсы.", tags:["CAD","3D‑сканирование"], date:"2025-08-01", cover:"https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1400&auto=format&fit=crop" },
    { id:"a-2", title:"3D‑печать: от идеи до детали", excerpt:"Пошаговый разбор подготовки модели, выбора материала и постобработки.", tags:["3D‑печать","PLA","ABS"], date:"2025-08-10", cover:"https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=1400&auto=format&fit=crop" },
    { id:"a-3", title:"Методология преподавания технических дисциплин", excerpt:"Как выстроить курс так, чтобы ученики не теряли мотивацию.", tags:["Методика","Образование"], date:"2025-08-20", cover:"https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop" },
  ],
  courses: [
    { id:"c-1", title:"Курс: Реверс‑инжиниринг 101", level:"Начальный", duration:"12 часов", summary:"Сканирование, обработка облаков точек, построение CAD‑поверхностей.", cover:"https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1400&auto=format&fit=crop" },
    { id:"c-2", title:"Курс: Практика 3D‑печати", level:"Средний", duration:"16 часов", summary:"Подготовка моделей, выбор режимов, справочник материалов.", cover:"https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1400&auto=format&fit=crop" },
  ],
  posts: [
    { id:"p-1", title:"Запустили Step3D: статьи, курсы, блог", date:"2025-08-25", body:"Мы открыли площадку Step3D — следите за обновлениями и делитесь материалами в Telegram!" },
    { id:"p-2", title:"Новый материал: постобработка PLA", date:"2025-08-27", body:"Разбираем шлифование, ацетоновую обработку, шпатлёвки и финишные покрытия." },
  ],
};

// =============================
// Local storage hook
// =============================
function useLocalData<T>(key:string, initial:T){
  const [data, setData] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) as T : initial;
    } catch {
      return initial;
    }
  });
  useEffect(()=>{ try{ localStorage.setItem(key, JSON.stringify(data)); }catch{} }, [key, data]);
  return [data, setData] as const;
}

// =============================
// Reading progress
// =============================
function ReadingProgress(){
  const [p, setP] = useState(0);
  useEffect(()=>{
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max>0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive:true });
    return ()=>window.removeEventListener('scroll', onScroll);
  },[]);
  return (
    <div style={{position:'fixed', insetInlineStart:0, top:0, height:3, width:'100%', zIndex:60, background:'transparent'}}>
      <div style={{height:'100%', width:`${p}%`, background:'#111'}}/>
    </div>
  );
}

// =============================
// Tiny runtime tests (dev only)
// =============================
function runTests(){
  try{
    // cx tests
    console.assert(cx('a',false,'b',undefined,'c') === 'a b c', 'cx should join truthy classes');
    // tgShareLink tests
    const url = tgShareLink({ url:'https://example.com', text:'Hello' });
    console.assert(url.startsWith('https://t.me/share/url?'), 'tgShareLink should target Telegram');
    console.assert(decodeURIComponent(url).includes('https://example.com'), 'tgShareLink must include URL');
    console.assert(decodeURIComponent(url).toLowerCase().includes('hello'), 'tgShareLink must include text');
    // fmtDate test (not strict due to locale)
    console.assert(typeof fmtDate('2025-01-01') === 'string', 'fmtDate returns string');
  }catch(e){ console.warn('Tests failed', e); }
}

export default function Step3DPrototype(){
  const [open, setOpen] = useState(false);
  const [data, setData] = useLocalData<DataShape>('step3d-data', seed);

  useInjectGlobal();
  useEffect(()=>{ document.body.classList.add('bg-white','text-black'); runTests(); },[]);

  return (
    <div className="min-h-screen font-[ui-sans-serif,system-ui,Segoe UI,Roboto,Ubuntu,Helvetica Neue,sans-serif]">
      <Nav open={open} setOpen={setOpen} />
      <ReadingProgress />
      <Hero />
      <Articles items={data.articles} />
      <Courses items={data.courses} />
      <Blog items={data.posts} />
      <About />
      <Footer />
      <AdminPanel data={data} setData={(updater)=>setData((d)=>updater(d))} />
    </div>
  );
}
