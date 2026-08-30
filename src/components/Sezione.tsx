type Props = {
  titolo: string
  sottotitolo?: string
  children?: React.ReactNode
}

export default function Sezione({ titolo, sottotitolo, children }: Props) {
  return (
    <section>
      <h1 className="font-display text-4xl tracking-tight">{titolo}</h1>
      {sottotitolo && (
        <p className="mt-2 text-antracite-chiaro">{sottotitolo}</p>
      )}
      <div className="mt-8">{children}</div>
    </section>
  )
}
