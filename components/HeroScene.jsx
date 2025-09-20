'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'

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
      setIntersecting(false)
      return
    }

    if (typeof window === 'undefined' || typeof window.IntersectionObserver === 'undefined') {
      setIntersecting(true)
      return
    }

    let cancelled = false
    const obs = new IntersectionObserver((entries) => {
      if (cancelled) return
      const entry = entries && entries[0]
      setIntersecting(!!entry?.isIntersecting)
    }, { rootMargin })

    try {
      obs.observe(el)
    } catch {}
    return () => {
      cancelled = true
      try {
        obs.disconnect()
      } catch {}
    }
  }, [ref, rootMargin])
  return isIntersecting
}

/************** ERROR BOUNDARY **************/
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
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

/************** 3D SCENE **************/
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
      try {
        if (typeof onFirstFrame === 'function') onFirstFrame()
      } catch {}
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
        try {
          return ctx?.getParameter ? ctx.getParameter(ctx.VERSION) : 'unknown'
        } catch {
          return 'unknown'
        }
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

/************** RUNTIME SELF-TESTS **************/
function supportsWebGLSafely() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl') || c.getContext('experimental-webgl') || c.getContext('webgl2'))
  } catch {
    return false
  }
}

function TestPanel({
  mounted,
  webglOk,
  canvasReady,
  firstFrameSeen,
  firstFrameCount,
  glInfo,
  sceneVisible,
  cbIsFunc,
  refAttached,
  ioAvailable,
}) {
  const items = [
    { name: 'Клиентская среда', pass: mounted },
    { name: 'Поддержка WebGL', pass: webglOk },
    { name: 'Сцена во вьюпорте', pass: sceneVisible },
    { name: 'Ref присвоен DOM‑элементу', pass: refAttached },
    { name: 'IntersectionObserver доступен', pass: ioAvailable },
    { name: 'Canvas смонтирован', pass: canvasReady },
    { name: 'Первый кадр отрисован (RAF)', pass: firstFrameSeen },
    { name: 'onFirstFrame — функция', pass: cbIsFunc },
    { name: 'onFirstFrame вызван ровно 1 раз', pass: firstFrameCount === 1 },
    { name: `WebGL контекст: ${glInfo || 'n/a'}`, pass: !!glInfo && glInfo !== 'n/a' },
    { name: 'GL info после ready', pass: canvasReady ? !!glInfo : true },
  ]
  return (
    <div className="mt-4 grid gap-2 rounded-2xl border border-black/10 p-4 text-xs">
      <div className="font-medium">Проверки окружения</div>
      <ul className="grid gap-1">
        {items.map((t) => (
          <li key={t.name} className="flex items-center justify-between">
            <span>{t.name}</span>
            <span className={t.pass ? 'text-green-600' : 'text-red-600'}>{t.pass ? 'OK' : 'FAIL'}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-sm backdrop-blur">
      {children}
    </span>
  )
}

export default function HeroScene({ benefits }) {
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

  const sceneWrapRef = useRef(null)
  const sceneVisible = useOnScreen(sceneWrapRef, '-10% 0px -10% 0px')

  const firstFrameCb = useMemo(
    () => () => {
      setFirstFrameSeen(true)
      setFirstFrameCount((n) => n + 1)
    },
    []
  )
  useEffect(() => {
    setCbIsFunc(typeof firstFrameCb === 'function')
  }, [firstFrameCb])

  const ioAvailable = typeof window !== 'undefined' && 'IntersectionObserver' in window
  const refAttached = !!sceneWrapRef.current

  return (
    <>
      <section id="top" className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Реверсивный инжиниринг
              <br />
              и аддитивное производство
            </h1>
            <p className="mt-4 text-black/70">
              Практический интенсив на базе РГСУ: 3D‑сканирование → реверс в CAD → печать оснастки и мастер‑моделей. От кейсов к результату.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {benefits.map((b) => (
                <Pill key={b}>{b}</Pill>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-6">
              <a href="#apply" className="rounded-xl bg-black px-4 py-2 text-white transition hover:opacity-90">
                Записаться
              </a>
              <a href="#program" className="rounded-xl border border-black/10 px-4 py-2 transition hover:bg-black hover:text-white">
                Смотреть программу
              </a>
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
    </>
  )
}
