import Sezione from '../components/Sezione'
import DaFare from '../components/DaFare'

export default function Sponsor() {
  return (
    <Sezione
      titolo="Sponsor e patrocini"
      sottotitolo="Chi sostiene la Sagra."
    >
      <DaFare>
        Griglia loghi dalla tabella <code>sagra_sponsor</code>, divisa per livello.
        I loghi della 33ª stanno in Proloco_Militello/33_Sagra/Sponsor/Loghi e vanno
        riconfermati uno per uno: non è detto che tutti rinnovino.
      </DaFare>
    </Sezione>
  )
}
