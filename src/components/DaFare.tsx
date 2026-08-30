export default function DaFare({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-antracite/30 bg-avorio-scuro/30 px-5 py-4 text-sm text-antracite-chiaro">
      {children}
    </div>
  )
}
