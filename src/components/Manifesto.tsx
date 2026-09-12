import { locandina, percorsoLocandina, srcsetLocandina } from '../data/locandina'

/**
 * L'immagine della locandina, e nient'altro. Unico punto del sito che sa dove
 * stanno i file: tutto passa da `src/data/locandina.ts`.
 *
 * `sizes` descrive quanto spazio occupa davvero il manifesto nel layout, così
 * il browser scarica la derivata giusta e non la più grande. Sulla home è
 * l'elemento più grande sopra la piega: niente `loading="lazy"`, che lo
 * ritarderebbe, e `fetchPriority="high"` per farlo partire prima.
 */
export default function Manifesto({
  alt,
  priorita = false,
  sizes = '(min-width: 1024px) 40rem, 100vw',
  className = '',
}: {
  alt: string
  priorita?: boolean
  sizes?: string
  className?: string
}) {
  return (
    <picture>
      <source type="image/avif" srcSet={srcsetLocandina('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcsetLocandina('webp')} sizes={sizes} />
      <img
        src={percorsoLocandina(1080, 'jpg')}
        srcSet={srcsetLocandina('jpg')}
        sizes={sizes}
        // Dimensioni del sorgente: riservano lo spazio esatto e tolgono il
        // salto di layout mentre l'immagine arriva.
        width={locandina.larghezzaSorgente}
        height={locandina.altezzaSorgente}
        alt={alt}
        decoding={priorita ? 'sync' : 'async'}
        loading={priorita ? 'eager' : 'lazy'}
        fetchPriority={priorita ? 'high' : 'auto'}
        className={`h-auto w-full ${className}`}
      />
    </picture>
  )
}
