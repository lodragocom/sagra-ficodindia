import Sezione from '../components/Sezione'
import DaFare from '../components/DaFare'

export default function Aggiornamenti() {
  return (
    <Sezione
      titolo="Aggiornamenti"
      sottotitolo="Cambi di orario, meteo, novità dell'ultimo minuto."
    >
      <DaFare>
        Elenco datato dalla tabella <code>sagra_aggiornamenti</code>.
        È il motivo per cui il QR della locandina porta qui e non a un PDF.
      </DaFare>
    </Sezione>
  )
}
