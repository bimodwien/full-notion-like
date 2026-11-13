# Build from the repo root:
#   docker build -f apps/web/Dockerfile -t nobimotion-web \
#     --build-arg NEXT_PUBLIC_API_URL=https://nobimotion.bimodwien.id/api \
#     --build-arg NEXT_PUBLIC_SYNC_URL=wss://nobimotion.bimodwien.id .

FROM node:24.21.0-slim AS base
WORKDIR /app
ENV TURBO_TELEMETRY_DISABLED=1 NEXT_TELEMETRY_DISABLED=1

# 1) Cut the monorepo down to what "web" needs.
FROM base AS prepare
RUN npm install -g turbo@2.11.10
COPY . .
RUN turbo prune web --docker

# 2) Install dependencies, then build.
FROM base AS builder
COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/package-lock.json ./package-lock.json
RUN npm ci
COPY --from=prepare /app/out/full/ .
# NEXT_PUBLIC_* values are baked into the browser bundle at build time, not read at runtime.
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SYNC_URL
RUN test -n "$NEXT_PUBLIC_API_URL" && test -n "$NEXT_PUBLIC_SYNC_URL"
RUN npm run build --workspace=web

# 3) Final image: only the standalone server and its static files.
FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder --chown=node:node /app/apps/web/.next/standalone ./
COPY --from=builder --chown=node:node /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=node:node /app/apps/web/public ./apps/web/public
USER node
CMD ["node", "apps/web/server.js"]
