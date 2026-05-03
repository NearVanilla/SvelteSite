# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies (including devDependencies needed for build)
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM nginx:alpine AS runner

# Copy built static files from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80


# nginx runs by default
