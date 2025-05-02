#!/bin/bash

# Directory containing your markdown ublog
POSTS_DIR="ublog"
OUTPUT_FILE="ublog-list.json"

# Start JSON array
echo "[" > "$OUTPUT_FILE"

# Find all .md files, sort them (optional), and loop
first=true
for file in $(find "$POSTS_DIR" -maxdepth 1 -name "*.md" | sort); do
    # Add a comma before each entry except the first
    if [ "$first" = true ]; then
        first=false
    else
        echo "," >> "$OUTPUT_FILE"
    fi
    # Append the file path as a JSON string
    echo "  \"${file}\"" >> "$OUTPUT_FILE"
done

# End JSON array
echo "]" >> "$OUTPUT_FILE"

echo "Generated $OUTPUT_FILE"

