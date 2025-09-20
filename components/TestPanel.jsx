'use client'

const isExplicitlyEnabled = process.env.NEXT_PUBLIC_SHOW_DIAGNOSTICS === 'true'
const isProduction = process.env.NODE_ENV === 'production'

export default function TestPanel({
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
  if (isProduction && !isExplicitlyEnabled) return null

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
