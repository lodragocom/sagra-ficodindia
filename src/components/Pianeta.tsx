import { useEffect, useRef, useState } from 'react'

/**
 * Il ficodindia della campagna: il video scontornato dal green screen, in loop.
 * Non è una rotazione vera — è una fotografia che respira — ed è esattamente
 * quello che serve: il frutto è il monumento, e i monumenti stanno fermi.
 * A muoversi sono le rotte.
 *
 * Il WebM con canale alfa non è affidabile su Safari, che lo renderebbe con il
 * fondo nero: lì si mostra il fermo immagine PNG, che ha la stessa trasparenza.
 */
export default function Pianeta() {
  const [animato, setAnimato] = useState(false)
  const [inclinazione, setInclinazione] = useState({ x: 0, y: 0 })
  const contenitore = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const menoMovimento = window.matchMedia('(prefers-reduced-motion: reduce)')

    const supporta = () => {
      const v = document.createElement('video')
      const puo = v.canPlayType('video/webm; codecs="vp9"')
      const ua = navigator.userAgent
      const safari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua)
      return Boolean(puo) && !safari && !menoMovimento.matches
    }

    const valuta = () => setAnimato(supporta())
    valuta()
    menoMovimento.addEventListener('change', valuta)
    return () => menoMovimento.removeEventListener('change', valuta)
  }, [])

  useEffect(() => {
    const el = contenitore.current
    if (!el || !animato) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const muovi = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height
      setInclinazione({ x: Math.max(-1, Math.min(1, dx)) * 4, y: Math.max(-1, Math.min(1, dy)) * -3 })
    }
    const esci = () => setInclinazione({ x: 0, y: 0 })

    window.addEventListener('pointermove', muovi, { passive: true })
    window.addEventListener('pointerleave', esci)
    return () => {
      window.removeEventListener('pointermove', muovi)
      window.removeEventListener('pointerleave', esci)
    }
  }, [animato])

  return (
    <div
      ref={contenitore}
      className="flex justify-center py-4"
      style={{ perspective: '1200px' }}
    >
      <div
        style={{
          transform: `rotateY(${inclinazione.x}deg) rotateX(${inclinazione.y}deg)`,
          transition: 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1)',
          transformStyle: 'preserve-3d',
        }}
      >
        {animato ? (
          <video
            src="/ficodindia.webm"
            poster="/ficodindia.png"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Il ficodindia con le quattro meraviglie e le rotte che vi convergono"
            className="h-auto w-full max-w-[22rem] sm:max-w-[26rem]"
            onError={() => setAnimato(false)}
          />
        ) : (
          <img
            src="/ficodindia.png"
            alt="Il ficodindia con le quattro meraviglie e le rotte che vi convergono"
            className="h-auto w-full max-w-[22rem] sm:max-w-[26rem]"
          />
        )}
      </div>
    </div>
  )
}
