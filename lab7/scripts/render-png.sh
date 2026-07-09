#!/usr/bin/env bash
# Usage: render-png.sh <svg-id>   (e.g. p1-backup)  -> diagrams/_preview_<id>.png
EDGE="/c/Program Files (x86)/Microsoft/EdgeCore/149.0.4022.69/msedge.exe"
BASE="D:/Stuff/isolated_env/ISM/lab7/diagrams"
ID="$1"
# read width/height from the svg tag
DIMS=$(grep -o 'width="[0-9]*" height="[0-9]*"' "$BASE/$ID.svg" | head -1)
W=$(echo "$DIMS" | grep -o 'width="[0-9]*"' | grep -o '[0-9]*')
H=$(echo "$DIMS" | grep -o 'height="[0-9]*"' | grep -o '[0-9]*')
"$EDGE" --headless=new --disable-gpu --no-sandbox --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=$((W+8)),$((H+8)) --screenshot="$BASE/_preview_$ID.png" "file:///$BASE/$ID.svg" 2>/dev/null
echo "$BASE/_preview_$ID.png ($W x $H)"
