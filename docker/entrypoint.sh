#!/bin/bash

# Exit on any error
set -e

# Install dependencies
pnpm install

# Build the app
pnpm run build

# Start the app
exec pnpm start