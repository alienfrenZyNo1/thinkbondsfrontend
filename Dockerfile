# Use Node.js 18 alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all files
COPY . .

# Build the app
RUN pnpm run build

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["pnpm", "start"]