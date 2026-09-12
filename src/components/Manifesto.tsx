import {
  locandina,
  percorsoLocandina,
  srcsetLocandina,
  type VersioneLocandina,
} from '../data/locandina'

/**
 * L'immagine di una locandina, e nient'altro. Unico punto del sito che sa dove
 * stanno i file: tutto passa da `src/data/locandina.ts`.
 *
 * `versione` permette di mostrare anche gli stati precedenti del manifesto,
 * perché questo sito racconta il percorso e non solo l'ultimo esito. Senza
 * argomento mostra la versione corrente.
 *
 * `sizes` descrive quanto spazio occupa davvero il manifesto nel layout, così
 * il browser scarica la derivata giusta e non la più grande. Sulla home è
 * l'elemento più grande sopra la piega: niente `loading="lazy"`, che lo
 * ritarderebbe, e `fetchPriority="high"` per farlo partire prima.
 */
export default function Manifesto({
  alt,
  versione = locandina,
  priorita = false,
  sizes = '(min-width: 1024px) 40rem, 100vw',
  className = '',
}: {
  alt: string
  versione?: VersioneLocandina
  priorita?: boolean
  sizes?: string
  className?: string
}) {
  return (
    <picture>
      <source type="image/avif" srcSet={srcsetLocandina(versione.id, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcsetLocandina(versione.id, 'webp')} sizes={sizes} />
      <img
        src={percorsoLocandina(versione.id, 1080, 'jpg')}
        srcSet={srcsetLocandina(versione.id, 'jpg')}
        sizes={sizes}
        // Dimensioni del sorgente: riservano lo spazio esatto e tolgono il
        // salto di layout mentre l'immagine arriva. Cambiano da una versione
        // all'altra, perché cambia la tela da cui escono.
        width={versione.larghezzaSorgente}
        height={versione.altezzaSorgente}
        alt={alt}
        decoding={priorita ? 'sync' : 'async'}
        loading={priorita ? 'eager' : 'lazy'}
        fetchPriority={priorita ? 'high' : 'auto'}
        className={`h-auto w-full ${className}`}
      />
    </picture>
  )
}
