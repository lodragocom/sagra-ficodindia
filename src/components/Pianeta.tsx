import { Suspense, lazy, useEffect, useState } from 'react'

const PianetaTre = lazy(() => import('./PianetaTre'))

/**
 * Il ficodindia-pianeta del concept 02. Sotto una certa larghezza, o se il
 * sistema chiede meno movimento, si degrada a un'immagine ferma: in piazza
 * il sito si deve aprire anche su un telefono vecchio.
 */
export default function Pianeta() {
  const [tridimensionale, setTridimensionale] = useState(false)

  useEffect(() => {
    const grande = window.matchMedia('(min-width: 768px)')
    const menoMovimento = window.matchMedia('(prefers-reduced-motion: reduce)')
    const valuta = () => setTridimensionale(grande.matches && !menoMovimento.matches)
    valuta()
    grande.addEventListener('change', valuta)
    menoMovimento.addEventListener('change', valuta)
    return () => {
      grande.removeEventListener('change', valuta)
      menoMovimento.removeEventListener('change', valuta)
    }
  }, [])

  if (!tridimensionale) return <PianetaFermo />

  return (
    <div className="h-[420px] w-full sm:h-[520px]">
      <Suspense fallback={<PianetaFermo />}>
        <PianetaTre />
      </Suspense>
    </div>
  )
}

function PianetaFermo() {
  return (
    <div className="flex h-[320px] w-full items-center justify-center sm:h-[420px]">
      <div
        className="relative h-56 w-56 rounded-full sm:h-72 sm:w-72"
        style={{
          background:
            'radial-gradient(circle at 32% 28%, #6FBF84 0%, #4B9A64 42%, #2A6C5F 100%)',
          boxShadow: '0 24px 60px rgba(42,108,95,0.35)',
        }}
      >
        <div
          className="absolute inset-0 rounded-full opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(220,172,12,0.85) 1.6px, transparent 1.7px)',
            backgroundSize: '18px 18px',
          }}
        />
        <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.25em] text-antracite/60">
          Militello
        </span>
      </div>
    </div>
  )
}
