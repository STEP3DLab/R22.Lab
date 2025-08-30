import { useEffect, useMemo, useState, type ElementType, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Menu, X, ExternalLink, Share2, Pencil, Plus, Save, Trash2, Search } from "lucide-react";

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
// Types
// =============================
interface Article { id:string; title:string; excerpt:string; tags:string[]; date:string; cover?:string; }
interface Course  { id:string; title:string; level:string; duration:string; summary:string; cover?:string; }
interface Post    { id:string; title:string; date:string; body:string; }
interface DataShape { articles: Article[]; courses: Course[]; posts: Post[]; }

// =============================
// Helpers
// =============================
function cx(...classes:(string|false|undefined|null)[]){ return classes.filter(Boolean).join(' '); }
const fmtDate = (iso:string) => new Date(iso).toLocaleDateString();

// reading progress
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
// Seed data (localStorage on first run)
// =============================
const seed: DataShape = {
  articles: [
    { id:"a-1", title:"Базовые принципы реверс‑инжиниринга", excerpt:"Что такое реверс‑инжиниринг, как строить процесс, инструменты и кейсы.", tags:["CAD","3D‑сканирование"], date:"2025-08-01", cover:"https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1400&auto=format&fit=crop" },
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

const TG_CHANNEL_URL = "https://t.me/STEP_3D_Lab"; // замените на актуальный канал

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
// UI primitives
// =============================

type ButtonProps<T extends ElementType = 'button'> = {
  as?: T;
  className?: string;
  children?: ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

function Button<T extends ElementType = 'button'>({ as, className, children, ...props }: ButtonProps<T>) {
  const Tag = (as || 'button') as ElementType;
  return (
    <Tag className={cx('btn', className)} {...props}>{children}</Tag>
  );
}

function Badge({ children }:{ children: ReactNode }){
  return <span className="badge">{children}</span>;
}

function Section({ id, title, subtitle, children }:{ id:string; title:string; subtitle?:string; children:ReactNode }){
  return (
    <section id={id} className="border-t border-black bg-white">
      <div className="container px-4 py-16">
        <header className="mb-8">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">{title}</h2>
          {subtitle && (
            <p className="mt-3 content text-base text-neutral-700 leading-relaxed">{subtitle}</p>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}

// =============================
// Navigation
// =============================
function Nav({ open, setOpen }:{ open:boolean; setOpen:(v:boolean)=>void }){
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

// =============================
// Admin Panel (demo; persisted to localStorage)
// =============================
function AdminPanel({ data, setData }:{ data:DataShape; setData: (updater:(d:DataShape)=>DataShape) => void; }){
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

// =============================
// Share helpers (Telegram)
// =============================
function tgShareLink({ url, text }:{ url:string; text?:string }){
  const u = new URL('https://t.me/share/url');
  u.searchParams.set('url', url);
  if (text) u.searchParams.set('text', text);
  return u.toString();
}

// =============================
// Sections
// =============================
function Articles({ items }:{ items:Article[] }){
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
                {/* Цветные картинки‑акценты */}
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
                <a className="inline-flex items-center gap-1 hover:underline" href={tgShareLink({ url: location.href + '#articles', text: a.title })} target="_blank" rel="noreferrer">
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

function Courses({ items }:{ items:Course[] }){
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
                <Button as="a" href={tgShareLink({ url: location.href + '#courses', text: c.title })} target="_blank" className="hover:bg-black hover:text-white"><Share2 size={14}/> Поделиться</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Blog({ items }:{ items:Post[] }){
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
              <a className="inline-flex items-center gap-1 text-sm hover:underline" href={tgShareLink({ url: location.href + '#blog', text: p.title })} target="_blank" rel="noreferrer">
                <Share2 size={14}/> В Telegram
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function About(){
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
            <p>Для продакшена подключите скрипт <code>https://telegram.org/js/telegram-widget.js</code> и используйте тег <code>&lt;div class="telegram-post" data-telegram-post="CHANNEL/POST_ID"&gt;</code>.</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-black">
          {/* Цветное изображение как акцент */}
          <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1400&auto=format&fit=crop" alt="Step3D" className="h-full w-full object-cover"/>
        </div>
      </div>
    </Section>
  );
}

function Footer(){
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

function Hero(){
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
            {/* Большое цветное изображение */}
            <img src="https://images.unsplash.com/photo-1546069901-eacef0df6022?q=80&w=1400&auto=format&fit=crop" alt="Hero" className="h-full w-full object-cover"/>
          </motion.div>
        </div>
      </div>
    </section>
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
