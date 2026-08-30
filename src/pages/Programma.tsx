import Sezione from '../components/Sezione'
import DaFare from '../components/DaFare'
import { edizione } from '../data/edizione'

const formato = new Intl.DateTimeFormat('it-IT', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

export default function Programma() {
  return (
    <Sezione
      titolo="Programma"
      sottotitolo="Sei giornate su due weekend. Gli orari possono cambiare: questa pagina è sempre la versione buona."
    >
      <div className="space-y-10">
        {edizione.weekend.map((w, i) => (
          <div key={w.dal}>
            <h2 className="font-display text-2xl text-cactus-scuro">
              {i === 0 ? 'Primo weekend' : 'Secondo weekend'}
            </h2>
            <div className="mt-4 space-y-4">
              {giorniDi(w.dal, w.al).map((g) => (
                <div key={g} className="border-l-2 border-magenta pl-4">
                  <p className="font-medium capitalize">
                    {formato.format(new Date(g))}
                  </p>
                  <p className="text-sm text-antracite-chiaro mt-1">
                    Programma da caricare
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <DaFare>
          Gli eventi arriveranno dalla tabella <code>sagra_eventi</code> su Supabase.
          Serve prima il programma definitivo dalla Proloco.
        </DaFare>
      </div>
    </Sezione>
  )
}

function giorniDi(dal: string, al: string): string[] {
  const out: string[] = []
  const d = new Date(dal)
  const fine = new Date(al)
  while (d <= fine) {
    out.push(d.toISOString().slice(0, 10))
    d.setDate(d.getDate() + 1)
  }
  return out
}
