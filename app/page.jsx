'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { motion } from 'framer-motion'
import TestPanel from '../components/TestPanel'

/************************************
 * DEBUG FIX (v10.2)
 * Target: sporadic "TypeError: Cannot read properties of undefined (reading 'source')"
 * Root cause (likely): a ref passed to useOnScreen was momentarily undefined
 *                     during mount/unmount, and the hook accessed ref.current.
 * Changes:
 * 1) Hardened useOnScreen: guards for undefined ref, missing IO API,
 *    and DOM access exceptions; never throws and defaults to false.
 * 2) Added runtime test-cases for: ref attached, IO availability.
 * 3) Kept previous fixes: single useOnScreen call, safe CanvasReady,
 *    guarded onFirstFrame, minimal light rig, SyntaxError fix in FAQ.
 ************************************/

/************** UTILS / HOOKS **************/
function useOnScreen(ref, rootMargin = '0px') {
  const [isIntersecting, setIntersecting] = useState(false)
  useEffect(() => {
    let el = null
    try {
      if (ref && typeof ref === 'object' && 'current' in ref) el = ref.current
      else if (typeof ref === 'function') el = ref()
      else if (typeof Element !== 'undefined' && ref instanceof Element) el = ref
    } catch {
      el = null
    }

    if (!el) {
      // No element yet — stay false, don't crash
      setIntersecting(false)
      return
    }

    if (typeof window === 'undefined' || typeof window.IntersectionObserver === 'undefined') {
      // Fallback: assume visible to avoid blocking UX on old browsers
      setIntersecting(true)
      return
    }

    let cancelled = false
    const obs = new IntersectionObserver((entries) => {
      if (cancelled) return
      const entry = entries && entries[0]
      setIntersecting(!!entry?.isIntersecting)
    }, { rootMargin })

    try { obs.observe(el) } catch {}
    return () => { cancelled = true; try { obs.disconnect() } catch {} }
  }, [ref, rootMargin])
  return isIntersecting
}

/************** ERROR BOUNDARY **************/
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          <div className="font-semibold">Ошибка инициализации 3D‑сцены</div>
          <pre className="mt-2 whitespace-pre-wrap text-xs opacity-80">{String(this.state.error?.message || this.state.error)}</pre>
          <ul className="mt-3 list-disc pl-5">
            <li>Проверьте поддержку WebGL в браузере.</li>
            <li>Убедитесь, что установлены совместимые версии <code>react</code> и <code>@react-three/fiber</code>.</li>
            <li>Компонент — клиентский (см. <code>&lsquo;use client&rsquo;</code> вверху файла).</li>
          </ul>
        </div>
      )
    }
    return this.props.children
  }
}

/************** 3D SCENE (minimal & robust) **************/
function LightRig() {
  return (
    <group>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 2]} intensity={1.1} />
      <pointLight position={[-4, -2, -2]} intensity={0.5} />
    </group>
  )
}

function RotatingWireCube({ onFirstFrame = () => {} }) {
  const meshRef = useRef(null)
  const signaledRef = useRef(false)
  useFrame((_, delta) => {
    if (!meshRef.current) return
    if (!signaledRef.current) {
      signaledRef.current = true
      try { if (typeof onFirstFrame === 'function') onFirstFrame() } catch {}
    }
    const dx = Number.isFinite(delta) ? delta : 0.016
    meshRef.current.rotation.x += dx * 0.4
    meshRef.current.rotation.y += dx * 0.6
  })
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.6, 1.6, 1.6]} />
      <meshStandardMaterial wireframe />
    </mesh>
  )
}

function CanvasReady({ onReady, onGlInfo }) {
  const readyRef = useRef(false)
  const { gl } = useThree()
  useEffect(() => {
    if (readyRef.current) return
    readyRef.current = true
    try {
      const el = gl?.domElement
      const ctx = el?.getContext?.('webgl2') || el?.getContext?.('webgl') || el?.getContext?.('experimental-webgl')
      const info = (() => {
        try { return ctx?.getParameter ? ctx.getParameter(ctx.VERSION) : 'unknown' } catch { return 'unknown' }
      })()
      if (typeof onGlInfo === 'function') onGlInfo(info || 'unknown')
      if (typeof onReady === 'function') onReady()
    } catch {
      if (typeof onGlInfo === 'function') onGlInfo('unknown')
      if (typeof onReady === 'function') onReady()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

/************** RUNTIME SELF-TESTS (in‑app test cases) **************/
function supportsWebGLSafely() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl') || c.getContext('experimental-webgl') || c.getContext('webgl2'))
  } catch {
    return false
  }
}

/**************** DATA ****************/
const benefits = [
  'Разработка КД и 3D‑моделей по существующим деталям',
  'Оперативный ремонт и изготовление запчастей на АТ',
  'Снижение издержек с помощью собственной оснастки',
]

const audience = [
  'Инженеры‑конструкторы и технологи',
  'Операторы ЧПУ',
  'Студенты техвузов, молодые учёные, преподаватели',
  'Промышленные дизайнеры',
]

const modules = [
  {
    day: '01 (Пн)',
    blocks: [
      {
        title:
          'Лекция: Реверсивный инжиниринг и аддитивные технологии в производстве. ОТ и ТБ. Кейсы РГСУ (Hi‑Tech, Ростех, Северсталь, СИБУР, ЕВРАЗ) ',
        hours: '2 ч (1 лк + 0,5 сем + 0,5 кт)',
        control: 'Устный опрос',
      },
      {
        title:
          'Мастер‑класс #1: CAD/CAM‑моделирование мастер‑моделей и метаформ (T‑FLEX CAD)',
        hours: '—',
        control: 'Зачёт',
      },
      {
        title:
          'Прак‑работа #1: Выбор средства оцифровки и оснастки. Калибровка сканера (RangeVision Spectrum)',
        hours: '2 ч',
        control: '—',
      },
      { title: 'Прак‑работа #2: 3D‑сканирование на стационарном сканере', hours: '4 ч', control: '—' },
    ],
  },
  {
    day: '02 (Вт)',
    blocks: [
      { title: 'Прак‑работа #3: Реверс в Geomagic Design X (базовые функции)', hours: '4 ч', control: '—' },
      {
        title: 'Мастер‑класс #2: Основы 3D‑печати (FDM, PICASO 3D). От индустриального партнёра',
        hours: '2 ч (0,5 лк + 1 пр + 0,5 кт)',
        control: '—',
      },
      { title: 'Прак‑работа #4: Подготовка моделей к FDM/DLP/SLA. Запуск печати', hours: '2 ч', control: '—' },
    ],
  },
  {
    day: '03 (Ср)',
    blocks: [
      {
        title:
          'Мастер‑класс #3: 3D‑сканирование ручным оптическим сканером (Artec Eva)',
        hours: '2 ч (0,5 лк + 1 пр + 0,5 кт)',
        control: 'Устный опрос',
      },
      { title: 'Прак‑работа #5: Geomagic Design X (продвинутые функции)', hours: '6 ч (1 лк + 5 пр)', control: 'Зачёт' },
    ],
  },
  {
    day: '04 (Чт)',
    blocks: [
      {
        title:
          'Мастер‑класс #4: Основы DLP/SLA‑печати. От индустриального партнёра',
        hours: '2 ч (0,5 лк + 1 пр + 0,5 кт)',
        control: 'Устный опрос',
      },
      { title: 'Прак‑работа #6: Подготовка к FDM/DLP/SLA. Запуск печати', hours: '2 ч (0,5 лк + 1 пр + 0,5 кт)', control: 'Зачёт' },
      { title: 'Отработка навыков (сканирование/реверс/печать) — свободный формат', hours: '4 ч', control: '—' },
    ],
  },
  {
    day: '05 (Пт)',
    blocks: [
      {
        title:
          'Экзамен (ДЭ): задание в формате International High‑Tech Competition (компетенция «Реверсивный инжиниринг»)',
        hours: '16 ч (2 лк + 12 пр + 2 кт)',
        control: 'Экзамен (ДЭ)',
      },
    ],
  },
  { day: '06 (Сб)', blocks: [] },
]

const lead = {
  price: '68\u202f000 ₽',
  duration: '48 часов (1 неделя, пн‑сб 09:00—18:00)',
  seats: '6–12 человек в группе',
  venue: 'Москва, ул. Вильгельма Пика, д. 4, к. 8 (технопарк РГСУ)',
}

const mentors = [
  {
    name: 'Евгений Сафонов',
    role: 'Руководитель лаборатории, эксперт по реверсивному инжинирингу',
    bio: '15 лет в производстве, руководил внедрением аддитивных технологий у промышленного партнёра Ростех.',
  },
  {
    name: 'Марина Боровик',
    role: 'Ведущий инженер‑технолог',
    bio: 'Специализируется на интеграции 3D‑сканирования в потоковые процессы, автор учебно‑методических материалов РГСУ.',
  },
  {
    name: 'Дмитрий Казаков',
    role: 'Инженер‑программист ЧПУ',
    bio: 'Эксперт по CAD/CAM и T‑FLEX, сертифицированный тренер PICASO 3D.',
  },
]

const faq = [
  {
    q: 'Нужен ли свой ноутбук?',
    a: 'Желательно: c Windows 10/11, 16 ГБ ОЗУ и поддержкой USB 3.0. На площадке доступны рабочие станции, но личное устройство ускорит работу.',
  },
  {
    q: 'Можно ли пройти курс без опыта в CAD?',
    a: 'Да. Мы стартуем с базовых инструментов и даём дополнительные сессии по интерфейсам программ. Преподаватели помогают на практике.',
  },
  {
    q: 'Вы выдаёте документы?',
    a: 'По итогу интенсивного курса участники получают удостоверение о повышении квалификации установленного образца РГСУ.',
  },
]

/************** UI HELPERS **************/
function Pill({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-sm backdrop-blur">
      {children}
    </span>
  )
}

function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl font-semibold tracking-tight md:text-4xl"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-2 max-w-3xl text-black/60"
        >
          {subtitle}
        </motion.p>
      )}
      <div className="mt-8">{children}</div>
    </section>
  )
}

function Divider() {
  return <div className="mx-auto my-8 h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-black/10 to-transparent" />
}

/************** MAIN PAGE **************/
export default function Page() {
  const [openDay, setOpenDay] = useState('01 (Пн)')
  const [mounted, setMounted] = useState(false)
  const [canvasReady, setCanvasReady] = useState(false)
  const [webglOk, setWebglOk] = useState(false)
  const [firstFrameSeen, setFirstFrameSeen] = useState(false)
  const [firstFrameCount, setFirstFrameCount] = useState(0)
  const [glInfo, setGlInfo] = useState('')
  const [cbIsFunc, setCbIsFunc] = useState(false)

  useEffect(() => {
    setMounted(true)
    setWebglOk(supportsWebGLSafely())
  }, [])

  const stats = useMemo(
    () => [
      { k: '48 ч', v: 'интенсив' },
      { k: '6–12', v: 'в группе' },
      { k: '4', v: 'мастер‑класса' },
      { k: '3D', v: 'скан/реверс/печать' },
    ],
    []
  )

  // Scene visibility pause (performance)
  const sceneWrapRef = useRef(null)
  const sceneVisible = useOnScreen(sceneWrapRef, '-10% 0px -10% 0px')

  // Safe, stable callback for first frame
  const firstFrameCb = useMemo(() => () => {
    setFirstFrameSeen(true)
    setFirstFrameCount((n) => n + 1)
  }, [])
  useEffect(() => { setCbIsFunc(typeof firstFrameCb === 'function') }, [firstFrameCb])

  const ioAvailable = typeof window !== 'undefined' && 'IntersectionObserver' in window
  const refAttached = !!sceneWrapRef.current

  const shouldRenderTestPanel =
    process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_SHOW_DIAGNOSTICS === 'true'

  const applyStats = [
    { label: 'Стоимость', value: lead.price },
    { label: 'Продолжительность', value: lead.duration },
    { label: 'Формат', value: lead.seats },
    { label: 'Локация', value: lead.venue },
  ]

  return (
    <div className="min-h-dvh bg-white text-neutral-900 selection:bg-black selection:text-white">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#top" className="font-semibold tracking-tight">4I.R22.01</a>
          <nav className="hidden gap-6 text-sm md:flex">
            <a href="#about" className="opacity-70 transition hover:opacity-100">О курсе</a>
            <a href="#program" className="opacity-70 transition hover:opacity-100">Программа</a>
            <a href="#team" className="opacity-70 transition hover:opacity-100">Команда</a>
            <a href="#apply" className="opacity-70 transition hover:opacity-100">Запись</a>
          </nav>
          <a href="#apply" className="rounded-xl border border-black/10 px-3 py-1.5 text-sm transition hover:bg-black hover:text-white">Поступить</a>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 md:grid-cols-2">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl"
            >
              Реверсивный инжиниринг
              <br />
              и аддитивное производство
            </motion.h1>
            <p className="mt-4 text-black/70">
              Практический интенсив на базе РГСУ: 3D‑сканирование → реверс в CAD → печать оснастки и мастер‑моделей. От кейсов к результату.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {benefits.map((b) => (
                <Pill key={b}>{b}</Pill>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-6">
              <a href="#apply" className="rounded-xl bg-black px-4 py-2 text-white transition hover:opacity-90">Записаться</a>
              <a href="#program" className="rounded-xl border border-black/10 px-4 py-2 transition hover:bg-black hover:text-white">Смотреть программу</a>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.k} className="rounded-2xl border border-black/10 p-4 text-center">
                  <div className="text-xl font-semibold">{s.k}</div>
                  <div className="text-xs uppercase tracking-wider text-black/50">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div ref={sceneWrapRef} className="relative aspect-square rounded-3xl border border-black/10 bg-gradient-to-b from-neutral-50 to-neutral-100 p-2">
            {!mounted ? (
              <div className="flex h-full items-center justify-center text-sm opacity-60">Инициализация…</div>
            ) : !webglOk ? (
              <div className="flex h-full items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-sm text-amber-900">
                WebGL недоступен в вашем браузере/устройстве. 3D‑сцена отключена. Установите актуальные драйверы или попробуйте другой браузер.
              </div>
            ) : !sceneVisible ? (
              <div className="flex h-full items-center justify-center text-sm opacity-60">Сцена приостановлена вне вьюпорта</div>
            ) : (
              <ErrorBoundary>
                <Canvas camera={{ position: [2.5, 2.2, 2.8], fov: 45 }}>
                  <CanvasReady onReady={() => setCanvasReady(true)} onGlInfo={setGlInfo} />
                  <LightRig />
                  <RotatingWireCube onFirstFrame={firstFrameCb} />
                </Canvas>
              </ErrorBoundary>
            )}
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/10" />
          </div>
        </div>
      </section>

      {/* Runtime tests */}
      {shouldRenderTestPanel && (
        <div className="mx-auto max-w-6xl px-4">
          <TestPanel
            mounted={mounted}
            webglOk={webglOk}
            canvasReady={canvasReady}
            firstFrameSeen={firstFrameSeen}
            firstFrameCount={firstFrameCount}
            glInfo={glInfo}
            sceneVisible={sceneVisible}
            cbIsFunc={cbIsFunc}
            refAttached={refAttached}
            ioAvailable={ioAvailable}
          />
        </div>
      )}

      <Divider />

      {/* ABOUT */}
      <Section
        id="about"
        title="Для кого"
        subtitle="Интенсив ориентирован на специалистов, которые хотят ускорить цикл разработки изделий и сократить стоимость их производства."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {audience.map((item) => (
            <div key={item} className="rounded-2xl border border-black/10 bg-white/70 p-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">{item.slice(0, 2)}</span>
                <p className="text-sm font-medium leading-snug text-black/80">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Divider />

      {/* PROGRAM */}
      <Section
        id="program"
        title="Программа недели"
        subtitle="Последовательно переходим от теории к практике: сканирование, построение 3D‑модели, подготовка и печать."
      >
        <div className="grid gap-4">
          {modules.map((module) => {
            const isOpen = openDay === module.day
            return (
              <div key={module.day} className="rounded-2xl border border-black/10 bg-white/80 p-4 shadow-sm">
                <button
                  onClick={() => setOpenDay((prev) => (prev === module.day ? '' : module.day))}
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <span className="text-lg font-semibold">{module.day}</span>
                  <span className="text-sm text-black/50">{module.blocks.length ? `${module.blocks.length} активности` : 'выходной'}</span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
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
                </motion.div>
              </div>
            )
          })}
        </div>
      </Section>

      <Divider />

      {/* TEAM */}
      <Section
        id="team"
        title="Кураторы и наставники"
        subtitle="Команда лаборатории РГСУ объединяет инженеров, технологов и преподавателей с опытом внедрения аддитивных решений."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {mentors.map((mentor) => (
            <motion.article
              key={mentor.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex h-full flex-col justify-between rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm"
            >
              <div>
                <div className="text-lg font-semibold">{mentor.name}</div>
                <div className="mt-1 text-sm text-black/60">{mentor.role}</div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-black/70">{mentor.bio}</p>
            </motion.article>
          ))}
        </div>
      </Section>

      <Divider />

      {/* APPLY */}
      <Section
        id="apply"
        title="Запишитесь на интенсив"
        subtitle="Оставьте контактные данные, и координатор лаборатории свяжется с вами, чтобы уточнить детали участия."
      >
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <form
            className="grid gap-4 rounded-3xl border border-black/10 bg-white/90 p-6 shadow-sm"
            onSubmit={(event) => {
              event.preventDefault()
              const form = event.currentTarget
              const data = Object.fromEntries(new FormData(form))
              alert(`Спасибо! Мы свяжемся по адресу ${data.email || '—'} и телефону ${data.phone || '—'}.`)
              form.reset()
            }}
          >
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
            <button
              type="submit"
              className="mt-2 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
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

      {/* FAQ */}
      <Section id="faq" title="Ответы на вопросы" subtitle="Если не нашли ответ — напишите нам, и мы подскажем, как лучше включиться в программу.">
        <div className="grid gap-4">
          {faq.map((item) => (
            <details key={item.q} className="group rounded-2xl border border-black/10 bg-white/80 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-black/80">
                {item.q}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-black/60">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <footer className="border-t border-black/10 bg-white/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-black/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Лаборатория аддитивных технологий РГСУ</span>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#faq" className="hover:text-black/70">FAQ</a>
            <a href="mailto:lab@rgsu.ru" className="hover:text-black/70">lab@rgsu.ru</a>
            <a href="tel:+74951234567" className="hover:text-black/70">+7 (495) 123‑45‑67</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
