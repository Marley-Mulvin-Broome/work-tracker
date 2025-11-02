# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm config set registry https://registry.npmjs.org/

# Copy package files
COPY package.json package-lock.json ./

# Clean npm cache before install to avoid corruption
RUN npm cache clean --force

# Install deps (faster, avoids audit and progress output)
RUN npm ci --prefer-offline --no-audit --progress=false


# Copy source code
COPY . .

# Build the application (NOT migrations - those run at runtime)
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

RUN npm config set registry https://registry.npmjs.org/

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
CMD ["sh", "-c", "node build"]
