import Sezione from '../components/Sezione'
import ProgrammaCompleto from '../components/ProgrammaCompleto'

export default function Programma() {
  return (
    <Sezione
      titolo="Programma"
      sottotitolo="Gli orari possono cambiare fino all'ultimo. Questa pagina è sempre la versione buona."
    >
      <ProgrammaCompleto />
    </Sezione>
  )
}
