import Sezione from '../components/Sezione'
import { Vuoto } from '../components/Stato'
import { useTabella } from '../hooks/useTabella'
import type { Info as InfoRiga } from '../lib/tipi'

export default function Info() {
  const { righe, stato, errore } = useTabella<InfoRiga>('sagra_info', 'ordine')

  return (
    <Sezione
      titolo="Info pratiche"
      sottotitolo="Come arrivare, dove parcheggiare, dove mangiare e dormire."
    >
      {righe.length === 0 ? (
        <Vuoto stato={stato} errore={errore} tabella="sagra_info" cosa="le informazioni" />
      ) : (
        <div className="space-y-8">
          {righe.map((i) => (
            <div key={i.id}>
              <h2 className="font-display text-xl text-cactus-scuro">{i.titolo}</h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed">{i.testo}</p>
            </div>
          ))}
        </div>
      )}
    </Sezione>
  )
}
