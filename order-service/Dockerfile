# ==========================================
# Stage 1 - Build
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.15.0

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build NestJS application
RUN pnpm run build

# ==========================================
# Stage 2 - Production
# ==========================================
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g pnpm@10.15.0

COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy compiled application
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]