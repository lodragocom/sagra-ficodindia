import { edizione } from '../data/edizione'
import DaFare from '../components/DaFare'

export default function Home() {
  return (
    <div className="py-8">
      <p className="text-sm uppercase tracking-[0.2em] text-cactus-scuro">
        {edizione.luogo}
      </p>

      <h1 className="mt-4 font-display text-5xl sm:text-6xl leading-[1.05] tracking-tight">
        {edizione.numero}ª {edizione.nome}
      </h1>

      <p className="mt-6 text-2xl text-magenta font-display">{edizione.claim}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        {edizione.weekend.map((w) => (
          <span
            key={w.dal}
            className="rounded-full bg-cactus px-5 py-2 text-avorio text-lg"
          >
            {w.etichetta}
          </span>
        ))}
        <span className="rounded-full bg-giallo px-5 py-2 text-antracite text-lg">
          {edizione.anno}
        </span>
      </div>

      <div className="mt-12">
        <DaFare>
          Qui va il key visual dell'edizione, quando il concept master è approvato.
          Il claim «{edizione.claim}» è ancora da confermare con la Proloco.
        </DaFare>
      </div>
    </div>
  )
}
