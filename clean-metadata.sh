#!/usr/bin/env bash
# clean-metadata.sh — strip provenance and header metadata from images and videos.
# POSIX-style bash: no bashisms required beyond the shebang interpreter.

set -eu

OUTPUT_DIR="output"

usage() {
  cat <<'EOF'
Usage: clean-metadata.sh <file|directory>

Remove provenance and header metadata from supported media files.
Results are written to an output/ subfolder (created if missing).

Supported formats:
  Images: .jpg .jpeg .png .webp  (exiftool)
  Videos: .mp4 .mov .mkv         (ffmpeg)

Examples:
  clean-metadata.sh photo.jpg
  clean-metadata.sh ./media/
EOF
}

die() {
  printf 'Error: %s\n' "$1" >&2
  exit 1
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    die "'$1' is required but was not found in PATH."
  fi
}

is_image() {
  case "$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]')" in
    *.jpg | *.jpeg | *.png | *.webp) return 0 ;;
    *) return 1 ;;
  esac
}

is_video() {
  case "$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]')" in
    *.mp4 | *.mov | *.mkv) return 0 ;;
    *) return 1 ;;
  esac
}

is_supported() {
  is_image "$1" || is_video "$1"
}

# Skip anything already under output/ to avoid re-processing cleaned files.
is_under_output() {
  case "$1" in
    */output/* | */output | ./output/* | output/* | output) return 0 ;;
    *) return 1 ;;
  esac
}

clean_image() {
  src=$1
  dst=$2

  mkdir -p "$(dirname "$dst")"
  cp "$src" "$dst"

  # Strip all metadata and C2PA/JUMBF manifests; restore color profile tags only.
  exiftool -overwrite_original -q -q \
    -all= \
    -jumbf:all= \
    -tagsFromFile "$src" \
    '-ICC_Profile:all' \
    '-Profile:all' \
    "$dst"
}

clean_video() {
  src=$1
  dst=$2

  mkdir -p "$(dirname "$dst")"
  ffmpeg -y -hide_banner -loglevel error -i "$src" \
    -map_metadata -1 \
    -map_metadata:s:v -1 \
    -map_metadata:s:a -1 \
    -c copy \
    "$dst"
}

process_file() {
  src=$1
  rel=${2:-}

  if is_under_output "$src"; then
    return 0
  fi

  if ! is_supported "$src"; then
    printf 'Skipping unsupported file: %s\n' "$src"
    return 0
  fi

  if [ -n "$rel" ]; then
    dst="${OUTPUT_DIR}/${rel}"
  else
    dst="${OUTPUT_DIR}/$(basename "$src")"
  fi

  printf 'Processing: %s -> %s\n' "$src" "$dst"

  if is_image "$src"; then
    clean_image "$src" "$dst"
  else
    clean_video "$src" "$dst"
  fi
}

collect_files() {
  input=$1
  base=""

  if [ -f "$input" ]; then
    if ! is_supported "$input"; then
      die "Unsupported file type: $input"
    fi
    printf '%s\n' "$input"
    return 0
  fi

  if [ ! -d "$input" ]; then
    die "Input path is neither a file nor a directory: $input"
  fi

  base=${input%/}
  find "$base" -type f | while IFS= read -r file; do
    if is_supported "$file" && ! is_under_output "$file"; then
      printf '%s\n' "$file"
    fi
  done
}

main() {
  if [ "$#" -ne 1 ]; then
    usage
    exit 1
  fi

  input=$1

  if [ "$input" = "-h" ] || [ "$input" = "--help" ]; then
    usage
    exit 0
  fi

  require_command exiftool
  require_command ffmpeg

  if [ ! -e "$input" ]; then
    die "Input path does not exist: $input"
  fi

  count=0
  base=""

  if [ -d "$input" ]; then
    base=${input%/}
  fi

  # Use a temp file to avoid subshell issues with piped while-read.
  tmp_list=$(mktemp)
  trap 'rm -f "$tmp_list"' EXIT INT TERM

  if [ -f "$input" ]; then
    if ! is_supported "$input"; then
      die "Unsupported file type: $input"
    fi
    printf '%s\n' "$input" >"$tmp_list"
  else
    find "${input%/}" -type f | while IFS= read -r file; do
      if is_supported "$file" && ! is_under_output "$file"; then
        printf '%s\n' "$file"
      fi
    done >"$tmp_list"
  fi

  if [ ! -s "$tmp_list" ]; then
    die "No supported media files found in: $input"
  fi

  while IFS= read -r file; do
    rel=""
    if [ -n "$base" ]; then
      rel=${file#"$base"/}
    fi
    process_file "$file" "$rel"
    count=$((count + 1))
  done <"$tmp_list"

  printf 'Done. %s file(s) written to %s/\n' "$count" "$OUTPUT_DIR"
}

main "$@"
