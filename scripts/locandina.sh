#!/usr/bin/env bash
# Prepara la locandina per il web a partire dal file di compositing.
#
#   ./scripts/locandina.sh <sorgente.jpg> <versione>
#   ./scripts/locandina.sh ~/.../compositing/locandina-34sagra-v6.jpg v6
#
# Produce in public/locandina/ le derivate avif + webp + jpg alle larghezze di
# src/data/locandina.ts. Dopo averlo lanciato resta UNA cosa da fare a mano:
# cambiare `versione` in src/data/locandina.ts. Nessun altro file va toccato.
#
# Richiede: sips (macOS), cwebp, avifenc  (brew install webp libavif)

set -euo pipefail

sorgente="${1:?percorso del file sorgente}"
versione="${2:?etichetta di versione, es. v6}"

radice="$(cd "$(dirname "$0")/.." && pwd)"
uscita="$radice/public/locandina"
larghezze=(480 720 1080 1600)

[ -f "$sorgente" ] || { echo "Sorgente non trovata: $sorgente" >&2; exit 1; }
for strumento in sips cwebp avifenc; do
  command -v "$strumento" >/dev/null || { echo "Manca $strumento" >&2; exit 1; }
done

mkdir -p "$uscita"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

echo "Sorgente: $sorgente"
sips -g pixelWidth -g pixelHeight "$sorgente" | tail -n 2

for w in "${larghezze[@]}"; do
  base="$uscita/locandina-$versione-$w"
  # sips resampleWidth mantiene le proporzioni.
  sips -s format jpeg -s formatOptions 82 --resampleWidth "$w" \
       "$sorgente" --out "$base.jpg" >/dev/null
  # PNG intermedio: cwebp/avifenc leggono il JPEG, ma partire dal ricampionato
  # evita un secondo ricampionamento con algoritmo diverso.
  sips -s format png --resampleWidth "$w" "$sorgente" --out "$tmp/$w.png" >/dev/null
  cwebp -q 78 -m 6 -quiet "$tmp/$w.png" -o "$base.webp"
  avifenc --min 20 --max 34 --speed 4 "$tmp/$w.png" "$base.avif" >/dev/null
  printf '  %5spx  jpg %6sK  webp %6sK  avif %6sK\n' "$w" \
    "$(( $(stat -f%z "$base.jpg") / 1024 ))" \
    "$(( $(stat -f%z "$base.webp") / 1024 ))" \
    "$(( $(stat -f%z "$base.avif") / 1024 ))"
done

echo
echo "Fatto. Ora, se la versione è cambiata, aggiorna in src/data/locandina.ts:"
echo "  versione: '$versione'"
echo "e cancella le derivate della versione vecchia da public/locandina/."
