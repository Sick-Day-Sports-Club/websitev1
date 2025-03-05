#!/bin/bash

echo "Running post-build script to restore API routes..."

# Run the restore script
node scripts/restore-api-routes.js

echo "API routes restored successfully." 