#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Directory containing your markdown ublog files
POSTS_DIR="$SCRIPT_DIR"
OUTPUT_FILE="$SCRIPT_DIR/ublog-list.json"

# Start JSON array
echo "[" > "$OUTPUT_FILE"

# Find all .md files, sort them, and loop
first=true
for file in $(find "$POSTS_DIR" -maxdepth 1 -name "*.md" | sort); do
    # Add a comma before each entry except the first
    if [ "$first" = true ]; then
        first=false
    else
        echo "," >> "$OUTPUT_FILE"
    fi
    # Append the file path as a JSON string (relative to POSTS_DIR)
    rel_path="${file#$SCRIPT_DIR/}"
    echo "  \"${rel_path}\"" >> "$OUTPUT_FILE"
done

# End JSON array
echo "]" >> "$OUTPUT_FILE"

echo "Generated $OUTPUT_FILE"
