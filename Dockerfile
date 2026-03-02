# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci


# Lean migration image — only prisma CLI + schema, no app source
FROM base AS migrator
WORKDIR /app
COPY --from=deps /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=deps /app/node_modules/prisma ./node_modules/prisma
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma
ENV NODE_ENV=production
CMD ["node_modules/.bin/prisma", "migrate", "deploy"]

FROM base AS builder
WORKDIR /app
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