# Build desde la RAIZ del monorepo (docker build -f apps/cms/Dockerfile .)
# Necesario porque pnpm-lock.yaml vive en la raiz del workspace.
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN npm i -g pnpm@10.12.4

# Instalar dependencias (todo el workspace, para que el lockfile resuelva)
FROM base AS deps
WORKDIR /repo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/cms/package.json apps/cms/package.json
COPY apps/web/package.json apps/web/package.json
RUN pnpm install --frozen-lockfile

# Build solo del paquete cms
FROM base AS builder
WORKDIR /repo
COPY --from=deps /repo ./
COPY . .
RUN pnpm --filter cms generate:importmap
RUN pnpm --filter cms build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /repo/apps/cms/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /repo/apps/cms/.next/static ./apps/cms/.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "apps/cms/server.js"]
