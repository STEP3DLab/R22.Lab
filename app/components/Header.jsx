'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const NAV_LINKS = [
  { href: '#about', label: 'О курсе' },
  { href: '#program', label: 'Программа' },
  { href: '#team', label: 'Команда' },
  { href: '#apply', label: 'Запись' },
]

const MENU_ID = 'mobile-menu'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const dialogRef = useRef(null)
  const previouslyFocusedRef = useRef(null)

  const openMenu = () => {
    if (typeof document !== 'undefined') {
      previouslyFocusedRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null
    }
    setIsMenuOpen(true)
  }

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return undefined

    const dialog = dialogRef.current
    if (!dialog) return undefined

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ]
    const focusableElements = Array.from(dialog.querySelectorAll(focusableSelectors.join(',')))
    const firstFocusable = focusableElements[0] || dialog
    const lastFocusable = focusableElements[focusableElements.length - 1] || dialog

    const body = document.body
    const previousOverflow = body.style.overflow
    body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu()
        return
      }

      if (event.key === 'Tab') {
        if (focusableElements.length === 0) {
          event.preventDefault()
          dialog.focus()
          return
        }

        const isShiftPressed = event.shiftKey
        const activeElement = document.activeElement

        if (!isShiftPressed && activeElement === lastFocusable) {
          event.preventDefault()
          firstFocusable.focus()
        } else if (isShiftPressed && activeElement === firstFocusable) {
          event.preventDefault()
          lastFocusable.focus()
        }
      }
    }

    const handleFocus = (event) => {
      if (dialog.contains(event.target)) return
      event.stopPropagation()
      ;(firstFocusable || dialog).focus({ preventScroll: true })
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('focus', handleFocus, true)

    const frame = requestAnimationFrame(() => {
      if (firstFocusable && 'focus' in firstFocusable) {
        firstFocusable.focus({ preventScroll: true })
      } else {
        dialog.focus({ preventScroll: true })
      }
    })

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('focus', handleFocus, true)
      body.style.overflow = previousOverflow

      const prev = previouslyFocusedRef.current
      if (prev && 'focus' in prev) {
        prev.focus({ preventScroll: true })
      }
    }
  }, [isMenuOpen, closeMenu])

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#top" className="font-semibold tracking-tight">
          4I.R22.01
        </a>
        <nav className="hidden gap-6 text-sm md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="opacity-70 transition hover:opacity-100">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#apply"
            className="hidden rounded-xl border border-black/10 px-3 py-1.5 text-sm transition hover:bg-black hover:text-white md:inline-flex"
          >
            Поступить
          </a>
          <button
            type="button"
            onClick={isMenuOpen ? closeMenu : openMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 text-black transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black md:hidden"
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isMenuOpen}
            aria-controls={MENU_ID}
            aria-haspopup="dialog"
          >
            <span className="sr-only">{isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}</span>
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isMenuOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 z-50 bg-black/40" aria-hidden="true" onClick={closeMenu} />
          <div
            ref={dialogRef}
            role="dialog"
            id={MENU_ID}
            aria-modal="true"
            tabIndex={-1}
            className="fixed inset-y-0 right-0 z-50 flex w-72 max-w-full flex-col gap-6 overflow-y-auto bg-white px-6 py-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold tracking-tight">Меню</span>
              <button
                type="button"
                onClick={closeMenu}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 text-black transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                <span className="sr-only">Закрыть меню</span>
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-4 text-base">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-lg px-2 py-1.5 font-medium text-black transition hover:bg-black/5"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <a
              href="#apply"
              onClick={closeMenu}
              className="rounded-xl bg-black px-4 py-2 text-center text-sm font-semibold text-white transition hover:opacity-90"
            >
              Поступить
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
