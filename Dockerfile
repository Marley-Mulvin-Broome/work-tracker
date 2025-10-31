# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (including dev dependencies for building)
RUN npm ci

# Copy source code
COPY . .

# Build the application (NOT migrations - those run at runtime)
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copy package files (needed for npm ci)
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built application from builder stage
COPY --from=builder /app/build ./build

# Copy migration files (needed at runtime)
COPY --from=builder /app/drizzle ./drizzle

# Expose port
EXPOSE 3000

# Run migrations then start the server
CMD ["sh", "-c", "npm run db:migrate && node build"]
