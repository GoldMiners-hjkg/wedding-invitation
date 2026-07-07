#!/usr/bin/env bash
# Re-encode hero videos for WeChat / mobile browsers (H.264 + AAC, 1080p).
# Originals are kept in media-backup/hero-videos-original/

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP="$ROOT/media-backup/hero-videos-original"
PUBLIC="$ROOT/public"

if ! command -v ffmpeg >/dev/null; then
  echo "ffmpeg is required. Install with: brew install ffmpeg"
  exit 1
fi

mkdir -p "$BACKUP"

for name in 1000024734.mp4 1000024735.mp4 1000024737.mp4; do
  src="$PUBLIC/$name"
  backup="$BACKUP/$name"
  tmp="$PUBLIC/${name%.mp4}.wechat.tmp.mp4"

  if [[ ! -f "$src" ]]; then
    echo "Skip missing: $src"
    continue
  fi

  if [[ ! -f "$backup" ]]; then
    echo "Backing up $name"
    cp "$src" "$backup"
  fi

  echo "Converting $name → H.264 baseline 1080p (CRF 21)..."
  ffmpeg -y -hide_banner -loglevel error -stats -i "$src" \
    -c:v libx264 -profile:v baseline -level 3.1 -pix_fmt yuv420p \
    -vf "scale='min(1920,iw)':-2" \
    -crf 21 -preset medium \
    -c:a aac -b:a 128k -ar 48000 \
    -movflags +faststart \
    "$tmp"

  mv "$tmp" "$src"
  echo "Done: $name ($(du -h "$src" | cut -f1))"
done

echo "All hero videos converted. Originals: $BACKUP"
