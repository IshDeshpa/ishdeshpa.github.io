#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
POSTS_DIR="$SCRIPT_DIR"
OUTPUT_FILE="$SCRIPT_DIR/blog-list.json"

TMP_FILE=$(mktemp)

for post_dir in "$POSTS_DIR"/*/; do
    md_file=$(find "$post_dir" -maxdepth 1 -name "*.md" | head -n 1)
    
    if [ -n "$md_file" ] && head -n 10 "$md_file" | grep -q '<!--PUBLISH-->'; then
        first_line=$(head -n 1 "$md_file")

        # Extract date using grep + sed (safe on any shell)
        date_str=$(echo "$first_line" | grep -oE '[0-9]{2}-[0-9]{2}-[0-9]{4}')
        if [ -n "$date_str" ]; then
            mm=$(echo "$date_str" | cut -d'-' -f1)
            dd=$(echo "$date_str" | cut -d'-' -f2)
            yyyy=$(echo "$date_str" | cut -d'-' -f3)
            sortable_date="${yyyy}${mm}${dd}"

            rel_path="${post_dir#$POSTS_DIR/}"
            echo "$sortable_date $rel_path $md_file" >> "$TMP_FILE"
        fi
    fi
done

# Sort by date descending
sorted_entries=$(sort -r "$TMP_FILE")

echo "[" > "$OUTPUT_FILE"
first=true

while read -r sortable_date rel_path md_file; do
    [ -z "$sortable_date" ] && continue
    if [ "$first" = true ]; then
        first=false
    else
        echo "," >> "$OUTPUT_FILE"
    fi
    echo "  \"$rel_path\"" >> "$OUTPUT_FILE"

    md_filename=$(basename "$md_file")
    html_filename="${md_filename%.md}.html"
    cp "$SCRIPT_DIR/blog-template.html" "$POSTS_DIR/$rel_path/$html_filename"
done <<< "$sorted_entries"

echo "]" >> "$OUTPUT_FILE"
echo "Generated $OUTPUT_FILE"

rm -f "$TMP_FILE"
