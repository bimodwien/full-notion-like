# Build from the repo root: docker build -f apps/api/Dockerfile -t nobimotion-api .

FROM node:24.21.0-slim AS base
# Prisma's migrate engine needs OpenSSL, which the slim image leaves out.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV TURBO_TELEMETRY_DISABLED=1

# 1) Cut the monorepo down to what "api" needs.
FROM base AS prepare
RUN npm install -g turbo@2.11.10
COPY . .
RUN turbo prune api --docker

# 2) Install dependencies, then build.
FROM base AS builder
COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/package-lock.json ./package-lock.json
# The api postinstall runs `prisma generate`, so the schema must exist before npm ci.
COPY --from=prepare /app/out/full/apps/api/prisma ./apps/api/prisma
COPY --from=prepare /app/out/full/apps/api/prisma.config.ts ./apps/api/prisma.config.ts
RUN npm ci
COPY --from=prepare /app/out/full/ .
RUN npm run build --workspace=api

# 3) Final image.
FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/apps/api ./apps/api
USER node
WORKDIR /app/apps/api
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]