#!/bin/sh
# entrypoint.sh

echo "Generating runtime configuration..."

# Define the path to the template and the output file
TEMPLATE_FILE="/usr/share/nginx/html/env.template.js"
OUTPUT_FILE="/usr/share/nginx/html/env.js" # This should be in your build output directory

# Check if the template file exists
if [ ! -f "$TEMPLATE_FILE" ]; then
  echo "Error: Template file not found at $TEMPLATE_FILE"
  exit 1
fi

# Use envsubst to substitute environment variables in the template
# We list the variables we expect to substitute.
# Ensure these match the placeholders in public/env.template.js
envsubst '$VITE_API_BASE_URL' < "$TEMPLATE_FILE" > "$OUTPUT_FILE"

echo "Runtime configuration generated at $OUTPUT_FILE"
cat "$OUTPUT_FILE" # Optional: print the generated file content

# Replace placeholders in env.template.js with actual env vars
envsubst < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js

# Execute the original command (e.g., starting the web server)
# This assumes your Dockerfile's CMD is set to start the web server (like Nginx)
exec "$@"
# Note: Ensure that the environment variables are set in your Dockerfile or docker-compose.yml