import { useEffect, useState } from 'react'

/** L'ora corrente, che si aggiorna da sola. Serve a "adesso in corso". */
export function useAdesso(intervalloMs = 30_000) {
  const [adesso, setAdesso] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setAdesso(new Date()), intervalloMs)
    return () => clearInterval(t)
  }, [intervalloMs])
  return adesso
}
