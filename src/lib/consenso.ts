// Consenso ai cookie e Google Analytics 4, in Consent Mode v2.
//
// Stessa logica di calatinolab25.com: il consenso parte negato, gtag viene
// definito subito (così le chiamate fatte prima del caricamento non vanno
// perse) e lo script di Google si scarica SOLO dopo un sì esplicito.
//
// L'identificativo GA4 arriva da VITE_GA4_ID. Se manca — in locale, nelle
// anteprime — non si carica niente e il banner non compare: una pagina che
// non traccia non ha motivo di chiedere il permesso.

export type Consenso = 'tutti' | 'essenziali'

const CHIAVE = 'consenso_cookie'

export const idGa4 = (import.meta.env.VITE_GA4_ID as string | undefined)?.trim() || null

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...argomenti: unknown[]) => void
  }
}

/** Definisce gtag e nega tutto: da chiamare all'avvio, prima di qualsiasi rendering. */
export function preparaConsenso() {
  if (typeof window === 'undefined' || !idGa4) return

  window.dataLayer = window.dataLayer || []
  window.gtag = function () {
    // GA4 legge l'oggetto `arguments`, non un array: il push così com'è è voluto.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments)
  }

  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
  })

  window.gtag('js', new Date())
  window.gtag('config', idGa4, { anonymize_ip: true, ...provenienza() })
}

/**
 * Traduce il parametro corto del QR in una campagna GA4.
 * Sulla locandina stampata il QR porta `?da=locandina`: tenerlo corto rende il
 * codice meno fitto, quindi più leggibile da lontano e con la stampa storta.
 * La forma lunga utm_* si ricostruisce qui.
 */
function provenienza(): Record<string, string> {
  const da = new URLSearchParams(window.location.search).get('da')
  if (!da) return {}
  return {
    campaign_source: da,
    campaign_medium: da === 'locandina' || da === 'pieghevole' ? 'qr' : 'link',
    campaign_name: 'sagra34',
  }
}

/** Applica la scelta dell'utente e, se è un sì, carica davvero Google Analytics. */
export function applicaConsenso(scelta: Consenso) {
  if (typeof window === 'undefined' || !idGa4 || !window.gtag) return

  if (scelta === 'tutti') {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      functionality_storage: 'granted',
      personalization_storage: 'granted',
    })
    caricaGoogleAnalytics()
    return
  }

  window.gtag('consent', 'update', {
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
  })
}

function caricaGoogleAnalytics() {
  if (document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) return
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${idGa4}`
  document.head.appendChild(script)
}

export function consensoSalvato(): Consenso | null {
  if (typeof window === 'undefined') return null
  try {
    const valore = localStorage.getItem(CHIAVE)
    return valore === 'tutti' || valore === 'essenziali' ? valore : null
  } catch {
    // Navigazione privata o storage bloccato: si riparte dal banner ogni volta.
    return null
  }
}

export function salvaConsenso(scelta: Consenso) {
  try {
    localStorage.setItem(CHIAVE, scelta)
  } catch {
    // Se non si può salvare pazienza: il consenso vale per questa sessione.
  }
}
