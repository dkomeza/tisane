# syntax=docker.io/docker/dockerfile:1

FROM node:24-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Lean migration image — only prisma CLI + schema, no app source
FROM base AS migrator
WORKDIR /app
COPY package.json ./
RUN PRISMA_VERSION=$(node -e "const pkg = require('./package.json'); console.log(pkg.devDependencies?.prisma || pkg.dependencies?.prisma || 'latest')") && \
    rm package.json && \
    npm init -y && \
    npm install prisma@$PRISMA_VERSION dotenv
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
ENV NODE_ENV=production
CMD ["npx", "prisma", "migrate", "deploy"]

FROM base AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN DATABASE_URL="postgresql://user:password@localhost:5432/db?schema=public" npm run db:generate

ARG APP_VERSION
ENV NEXT_PUBLIC_APP_VERSION=$APP_VERSION

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

ARG APP_VERSION
ENV NEXT_PUBLIC_APP_VERSION=$APP_VERSION

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]