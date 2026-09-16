# Build desde la RAIZ del monorepo (docker build -f apps/web/Dockerfile .)
# Necesario porque pnpm-lock.yaml vive en la raiz del workspace.
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN npm i -g pnpm@10.12.4

FROM base AS deps
WORKDIR /repo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/cms/package.json apps/cms/package.json
COPY apps/web/package.json apps/web/package.json
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /repo
COPY --from=deps /repo ./
COPY . .
RUN pnpm --filter web build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/public ./apps/web/public
USER nextjs
EXPOSE 3001
ENV PORT=3001
CMD ["node", "apps/web/server.js"]
