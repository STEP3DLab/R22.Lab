import dynamic from 'next/dynamic'

import { audience, benefits, faq, lead, mentors, modules } from '../lib/courseData'

const HeroScene = dynamic(() => import('../components/HeroScene'), {
  ssr: false,
  loading: () => (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Реверсивный инжиниринг
            <br />
            и аддитивное производство
          </h1>
          <p className="mt-4 max-w-xl text-black/70">
            Загружаем интерактивный блок лаборатории. Подождите пару секунд — WebGL сцена готовится к старту.
          </p>
        </div>
        <div className="flex aspect-square items-center justify-center rounded-3xl border border-dashed border-black/10 bg-gradient-to-b from-neutral-50 to-neutral-100 text-sm text-black/50">
          Инициализация 3D‑сцены…
        </div>
      </div>
    </section>
  ),
})

function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-2 max-w-3xl text-black/60">{subtitle}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  )
}

function Divider() {
  return <div className="mx-auto my-8 h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-black/10 to-transparent" />
}

export default function Page() {
  const applyStats = [
    { label: 'Стоимость', value: lead.price },
    { label: 'Продолжительность', value: lead.duration },
    { label: 'Формат', value: lead.seats },
    { label: 'Локация', value: lead.venue },
  ]

  return (
    <div className="min-h-dvh bg-white text-neutral-900 selection:bg-black selection:text-white">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#top" className="font-semibold tracking-tight">
            4I.R22.01
          </a>
          <nav className="hidden gap-6 text-sm md:flex">
            <a href="#about" className="opacity-70 transition hover:opacity-100">
              О курсе
            </a>
            <a href="#program" className="opacity-70 transition hover:opacity-100">
              Программа
            </a>
            <a href="#team" className="opacity-70 transition hover:opacity-100">
              Команда
            </a>
            <a href="#apply" className="opacity-70 transition hover:opacity-100">
              Запись
            </a>
          </nav>
          <a href="#apply" className="rounded-xl border border-black/10 px-3 py-1.5 text-sm transition hover:bg-black hover:text-white">
            Поступить
          </a>
        </div>
      </header>

      <HeroScene benefits={benefits} />

      <Divider />

      <Section
        id="about"
        title="Для кого"
        subtitle="Интенсив ориентирован на специалистов, которые хотят ускорить цикл разработки изделий и сократить стоимость их производства."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {audience.map((item) => (
            <div key={item} className="rounded-2xl border border-black/10 bg-white/70 p-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
                  {item.slice(0, 2)}
                </span>
                <p className="text-sm font-medium leading-snug text-black/80">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Divider />

      <Section
        id="program"
        title="Программа недели"
        subtitle="Последовательно переходим от теории к практике: сканирование, построение 3D‑модели, подготовка и печать."
      >
        <div className="grid gap-4">
          {modules.map((module, index) => (
            <details key={module.day} className="group rounded-2xl border border-black/10 bg-white/80 p-4 shadow-sm" defaultOpen={index === 0}>
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-left">
                <span className="text-lg font-semibold">{module.day}</span>
                <span className="text-sm text-black/50">
                  {module.blocks.length ? `${module.blocks.length} активности` : 'выходной'}
                </span>
              </summary>
              <div className="mt-4 grid gap-3">
                {module.blocks.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-black/10 p-4 text-sm text-black/60">
                    Свободный день: экскурсия по лаборатории и консультации с наставниками.
                  </div>
                ) : (
                  module.blocks.map((block) => (
                    <div key={block.title} className="rounded-xl border border-black/10 bg-white/90 p-4">
                      <div className="text-sm font-semibold text-black/80">{block.title}</div>
                      <div className="mt-2 grid gap-2 text-xs text-black/60 sm:grid-cols-2">
                        <span>Длительность: {block.hours}</span>
                        <span>Форма контроля: {block.control}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </details>
          ))}
        </div>
      </Section>

      <Divider />

      <Section
        id="team"
        title="Кураторы и наставники"
        subtitle="Команда лаборатории РГСУ объединяет инженеров, технологов и преподавателей с опытом внедрения аддитивных решений."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {mentors.map((mentor) => (
            <article key={mentor.name} className="flex h-full flex-col justify-between rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm">
              <div>
                <div className="text-lg font-semibold">{mentor.name}</div>
                <div className="mt-1 text-sm text-black/60">{mentor.role}</div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-black/70">{mentor.bio}</p>
            </article>
          ))}
        </div>
      </Section>

      <Divider />

      <Section
        id="apply"
        title="Запишитесь на интенсив"
        subtitle="Оставьте контактные данные, и координатор лаборатории свяжется с вами, чтобы уточнить детали участия."
      >
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <form className="grid gap-4 rounded-3xl border border-black/10 bg-white/90 p-6 shadow-sm" method="post" action="#">
            <label className="grid gap-2 text-sm">
              <span className="font-medium">ФИО</span>
              <input
                name="name"
                type="text"
                required
                placeholder="Иван Иванов"
                className="rounded-xl border border-black/10 px-4 py-2 text-sm shadow-sm outline-none transition focus:border-black/40 focus:ring-2 focus:ring-black/10"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="font-medium">Email</span>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="rounded-xl border border-black/10 px-4 py-2 text-sm shadow-sm outline-none transition focus:border-black/40 focus:ring-2 focus:ring-black/10"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="font-medium">Телефон</span>
              <input
                name="phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                className="rounded-xl border border-black/10 px-4 py-2 text-sm shadow-sm outline-none transition focus:border-black/40 focus:ring-2 focus:ring-black/10"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="font-medium">Ваш запрос</span>
              <textarea
                name="comment"
                rows={4}
                placeholder="Какие задачи хотите решить?"
                className="rounded-xl border border-black/10 px-4 py-2 text-sm shadow-sm outline-none transition focus:border-black/40 focus:ring-2 focus:ring-black/10"
              />
            </label>
            <button type="submit" className="mt-2 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
              Отправить заявку
            </button>
            <p className="text-xs text-black/50">
              Нажимая кнопку, вы соглашаетесь на обработку персональных данных и получение информационных сообщений от РГСУ.
            </p>
          </form>
          <aside className="flex flex-col gap-4">
            <div className="rounded-3xl border border-black/10 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 p-6 shadow-sm">
              <div className="text-sm font-medium text-black/60">Что входит</div>
              <ul className="mt-3 grid gap-2 text-sm text-black/80">
                <li>• Практические сессии в лаборатории аддитивных технологий</li>
                <li>• Учебные лицензии T‑FLEX, Geomagic, PICASO 3D</li>
                <li>• Печать личного проекта на оборудовании РГСУ</li>
                <li>• Сопровождение наставников после курса</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-black/10 bg-white/90 p-6 shadow-sm">
              <div className="text-sm font-medium text-black/60">Параметры набора</div>
              <dl className="mt-3 grid gap-3 text-sm">
                {applyStats.map((stat) => (
                  <div key={stat.label} className="flex items-start justify-between gap-4">
                    <dt className="text-black/60">{stat.label}</dt>
                    <dd className="text-right font-medium text-black/80">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </Section>

      <Divider />

      <Section
        id="faq"
        title="Ответы на вопросы"
        subtitle="Если не нашли ответ — напишите нам, и мы подскажем, как лучше включиться в программу."
      >
        <div className="grid gap-4">
          {faq.map((item) => (
            <details key={item.q} className="group rounded-2xl border border-black/10 bg-white/80 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-black/80">{item.q}</summary>
              <p className="mt-2 text-sm leading-relaxed text-black/60">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <footer className="border-t border-black/10 bg-white/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-black/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Лаборатория аддитивных технологий РГСУ</span>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#faq" className="hover:text-black/70">
              FAQ
            </a>
            <a href="mailto:lab@rgsu.ru" className="hover:text-black/70">
              lab@rgsu.ru
            </a>
            <a href="tel:+74951234567" className="hover:text-black/70">
              +7 (495) 123‑45‑67
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
