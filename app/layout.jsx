import './globals.css'

export const metadata = {
  title: '4I.R22.01 — Реверсивный инжиниринг и аддитивное производство',
  description:
    'Интенсив РГСУ по реверсивному инжинирингу: 3D-сканирование, CAD-моделирование и аддитивное производство за одну неделю.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className="bg-white text-neutral-900 antialiased">{children}</body>
    </html>
  )
}
