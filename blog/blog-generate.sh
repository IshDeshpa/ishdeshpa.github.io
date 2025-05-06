#!/bin/bash

POSTS_DIR="blog"
OUTPUT_FILE="blog-list.json"

echo "[" > "$OUTPUT_FILE"

first=true
for file in $(find "$POSTS_DIR" -maxdepth 1 -name "*.md" | sort); do
  # Check if the file has <!--PUBLISH--> in the first 10 lines
  if head -n 10 "$file" | grep -q '<!--PUBLISH-->'; then
    if [ "$first" = true ]; then
      first=false
    else
      echo "," >> "$OUTPUT_FILE"
    fi

    echo "  \"${file}\"" >> "$OUTPUT_FILE"
    cp blog-template.html ${file%.md}.html
  fi
done

echo "]" >> "$OUTPUT_FILE"
echo "Generated $OUTPUT_FILE"
