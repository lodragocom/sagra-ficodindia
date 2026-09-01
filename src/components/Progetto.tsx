import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import Pianeta from './Pianeta'
import { Vuoto } from './Stato'
import { useTabella } from '../hooks/useTabella'
import type { Passaggio } from '../lib/tipi'

const mese = new Intl.DateTimeFormat('it-IT', { month: 'short', year: '2-digit' })

/** Le tre parti discorsive: cosa serviva, cosa resta, come si declina quest'anno. */
type Blocco = {
  id: string
  etichetta: string
  quando: string
  titolo: string
  paragrafi: string[]
  extra?: 'pianeta'
}

const discorso: Blocco[] = [
  {
    id: 'briefing',
    etichetta: 'Briefing',
    quando: 'punto zero',
    titolo: 'Cosa deve fare questo manifesto',
    paragrafi: [
      'Un manifesto di sagra non è una decorazione: è il primo e spesso l’unico contatto fra il paese e chi non ci è mai stato. Deve funzionare in due condizioni opposte — a otto metri, su un muro, mentre qualcuno passa in macchina; e a cinque centimetri, dentro un telefono, in mezzo a decine di altre immagini. Se regge tutte e due, regge ovunque.',
      'Da qui i tre obblighi del progetto. Farsi riconoscere come Sagra della Mostarda e del Ficodindia prima ancora che si legga il titolo. Dare al frutto la statura che gli spetta, senza scivolare nel folklore. Far leggere date e luogo in tre secondi, lasciando il resto — programma, orari, contatti — dietro il QR.',
    ],
  },
  {
    id: 'identita',
    etichetta: 'Identità',
    quando: 'permanente',
    titolo: 'Ciò che resta, edizione dopo edizione',
    paragrafi: [
      'Una manifestazione che ogni anno cambia faccia ricomincia ogni anno da zero. Una che ripete lo stesso sistema accumula: alla terza o quarta volta la gente riconosce il manifesto prima di leggerlo, e quel riconoscimento vale più di qualsiasi campagna.',
      'Il patrimonio della Sagra esiste già, non è stato inventato adesso: il fondo avorio, il numero dell’edizione costruito con le pale di fico d’India, il panorama di Militello in monocromia, la fascia scura dei patrocini. Il lavoro sulla 34ª non lo sostituisce — lo mette per iscritto, lo rende ripetibile e lo consegna alla Proloco in un manuale che vale anche per le edizioni future.',
    ],
  },
  {
    id: 'sistema',
    etichetta: 'Sistema visivo',
    quando: '2026',
    titolo: 'Come si declina quest’anno',
    paragrafi: [
      'Il sistema è fatto di poche regole che non cambiano: un solo carattere, Archivo, in tutti i pesi che servono; una palette limitata dove il colore protagonista è sempre il frutto e mai il testo; il numero dell’edizione e la denominazione uniti in un blocco unico, in versione verticale e orizzontale, così che nessuno debba più accostarli a occhio.',
      'Dentro queste regole ogni anno cambia il tema. Per la 34ª è il confronto fra il ficodindia e le grandi meraviglie del mondo: l’ottava sta qui. Il frutto smette di essere un’illustrazione e diventa il corpo attorno a cui ruota tutto il resto — sul manifesto come su questa pagina.',
    ],
    extra: 'pianeta',
  },
]

/**
 * Il progetto raccontato per esteso, con la timeline compatta a lato.
 * I paragrafi fissi introducono; le tappe arrivano da `sagra_passaggi` e si
 * aggiungono dal database senza ripubblicare il sito.
 */
export default function Progetto() {
  const { righe, stato, errore } = useTabella<Passaggio>('sagra_passaggi', 'ordine')

  const tappe: Blocco[] = righe.map((p) => ({
    id: `tappa-${p.ordine}`,
    etichetta: p.titolo,
    quando: p.data ? mese.format(new Date(`${p.data}T12:00:00`)) : 'in arrivo',
    titolo: p.titolo,
    paragrafi: p.testo ? [p.testo] : [],
  }))

  const tutti = [...discorso, ...tappe]
  const attivo = useAttivo(tutti.map((b) => b.id))

  return (
    <section id="progetto" className="mt-28 scroll-mt-24">
      <div className="border-t-2 border-antracite pt-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-cactus-scuro">
          CalatinoLab25 per la Proloco di Militello
        </p>
        <h2 className="mt-2 max-w-3xl font-display text-4xl tracking-tight sm:text-5xl">
          Il progetto dietro il manifesto
        </h2>
      </div>

      <div className="mt-14 grid gap-14 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-16">
        <Timeline blocchi={tutti} attivo={attivo} />

        <div className="min-w-0 space-y-16">
          {discorso.map((b) => (
            <Discorsivo key={b.id} blocco={b} />
          ))}

          <div className="border-t border-antracite/15 pt-14">
            <p className="text-[11px] uppercase tracking-[0.22em] text-cactus-scuro">
              Il percorso
            </p>
            <p className="mt-3 max-w-2xl leading-relaxed text-antracite-chiaro">
              Le tappe con cui il manifesto è arrivato alla forma che si vede in alto. La pagina
              cresce insieme al lavoro: ogni passaggio compare qui appena è chiuso.
            </p>

            {righe.length === 0 ? (
              <div className="mt-10">
                <Vuoto stato={stato} errore={errore} tabella="sagra_passaggi" cosa="il percorso" />
              </div>
            ) : (
              <ol className="mt-12 space-y-16">
                {righe.map((p) => (
                  <Tappa key={p.id} passaggio={p} />
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Timeline({ blocchi, attivo }: { blocchi: Blocco[]; attivo: string | null }) {
  return (
    <nav
      aria-label="Le tappe del progetto"
      className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto"
    >
      <ol className="relative border-l border-antracite/20 pl-5">
        {blocchi.map((b) => {
          const acceso = b.id === attivo
          return (
            <li key={b.id} className="relative py-2">
              <span
                aria-hidden
                className={
                  acceso
                    ? 'absolute -left-[1.4rem] top-[0.95rem] h-2 w-2 rounded-full bg-magenta ring-4 ring-avorio'
                    : 'absolute -left-[1.28rem] top-[1.05rem] h-1.5 w-1.5 rounded-full bg-antracite/30 ring-4 ring-avorio'
                }
              />
              <a href={`#${b.id}`} className="block group">
                <span className="block text-[10px] uppercase tracking-[0.16em] tabular-nums text-antracite-chiaro">
                  {b.quando}
                </span>
                <span
                  className={
                    acceso
                      ? 'block text-sm leading-snug text-antracite'
                      : 'block text-sm leading-snug text-antracite-chiaro transition-colors group-hover:text-antracite'
                  }
                >
                  {b.etichetta}
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function Discorsivo({ blocco }: { blocco: Blocco }) {
  return (
    <motion.article
      id={blocco.id}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="scroll-mt-28"
    >
      <p className="text-[11px] uppercase tracking-[0.18em] text-cactus-scuro">
        {blocco.etichetta}
      </p>
      <h3 className="mt-2 max-w-2xl font-display text-3xl tracking-tight">{blocco.titolo}</h3>
      <div className="mt-5 max-w-2xl space-y-4 leading-relaxed">
        {blocco.paragrafi.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
      </div>
      {blocco.extra === 'pianeta' && <Pianeta />}
    </motion.article>
  )
}

function Tappa({ passaggio: p }: { passaggio: Passaggio }) {
  const futura = p.stato !== 'fatto'

  return (
    <motion.li
      id={`tappa-${p.ordine}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="scroll-mt-28"
    >
      <div className="flex flex-wrap items-baseline gap-3">
        <h3 className="font-display text-2xl tracking-tight">{p.titolo}</h3>
        {futura && (
          <span className="rounded-full border border-cactus/40 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-cactus-scuro">
            in lavorazione
          </span>
        )}
      </div>

      {p.testo && <p className="mt-3 max-w-2xl leading-relaxed">{p.testo}</p>}

      {p.immagine_url && (
        <figure className="mt-7">
          <img
            src={p.immagine_url}
            alt={p.didascalia ?? p.titolo}
            loading="lazy"
            className="w-full max-w-2xl border border-antracite/12 bg-avorio-scuro/20"
          />
          {p.didascalia && (
            <figcaption className="mt-2 text-sm text-antracite-chiaro">{p.didascalia}</figcaption>
          )}
        </figure>
      )}
    </motion.li>
  )
}

/** Segue lo scorrimento e restituisce l'id del blocco più vicino alla lettura. */
function useAttivo(ids: string[]) {
  const [attivo, setAttivo] = useState<string | null>(null)
  const visibili = useRef(new Set<string>())
  const chiave = ids.join('|')

  useEffect(() => {
    const elenco = chiave ? chiave.split('|') : []
    const insieme = visibili.current
    insieme.clear()

    const osservatore = new IntersectionObserver(
      (voci) => {
        for (const v of voci) {
          if (v.isIntersecting) insieme.add(v.target.id)
          else insieme.delete(v.target.id)
        }
        const primo = elenco.find((id) => insieme.has(id))
        if (primo) setAttivo(primo)
      },
      { rootMargin: '-25% 0px -60% 0px' },
    )

    for (const id of elenco) {
      const nodo = document.getElementById(id)
      if (nodo) osservatore.observe(nodo)
    }
    return () => osservatore.disconnect()
  }, [chiave])

  return attivo
}
