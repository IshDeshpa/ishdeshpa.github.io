#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
POSTS_DIR="$SCRIPT_DIR"
OUTPUT_FILE="$SCRIPT_DIR/blog-list.json"

echo "[" > "$OUTPUT_FILE"

first=true
for post_dir in "$POSTS_DIR"/*/; do
    # Look for a markdown file inside the folder
    md_file=$(find "$post_dir" -maxdepth 1 -name "*.md" | head -n 1)
    
    if [ -n "$md_file" ] && head -n 10 "$md_file" | grep -q '<!--PUBLISH-->'; then
        if [ "$first" = true ]; then
            first=false
        else
            echo "," >> "$OUTPUT_FILE"
        fi

        # Use relative folder name in JSON
        rel_path="${post_dir#$POSTS_DIR/}"
        echo "  \"$rel_path\"" >> "$OUTPUT_FILE"

        # Derive HTML filename from markdown filename
        md_filename=$(basename "$md_file")                 # e.g., "my-post.md"
        html_filename="${md_filename%.md}.html"           # e.g., "my-post.html"

        # Copy template and rename to match markdown file
        cp "$SCRIPT_DIR/blog-template.html" "$post_dir/$html_filename"
    fi
done

echo "]" >> "$OUTPUT_FILE"
echo "Generated $OUTPUT_FILE"
