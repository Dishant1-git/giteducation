# Debian slim, not Alpine — argon2 and the TypeScript 7 compiler both ship
# native binaries, and glibc has the widest prebuild coverage for both.
FROM node:22-bookworm-slim AS deps
WORKDIR /app
# Coolify injects all env vars as ARGs — force development so npm ci installs devDependencies.
ENV NODE_ENV=development
COPY package.json package-lock.json ./
RUN npm ci


FROM deps AS builder
WORKDIR /app
ENV NODE_ENV=production
COPY . .
RUN npm run build


FROM node:22-bookworm-slim AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev


FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000
ENV UPLOAD_DIR=uploads

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./

# tsc only compiles .ts files — the .sql migration files never reach dist/ on
# their own, but src/db/migrate.ts looks for them next to itself at runtime.
COPY --from=builder /app/src/db/migrations ./dist/db/migrations

# Mount a persistent volume here in Coolify, or uploaded media is lost on redeploy.
RUN mkdir -p /app/uploads

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||4000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# On every boot: migrate (idempotent), seed first admin (skips if exists), start.
CMD ["sh", "-c", "node dist/db/migrate.js && node dist/db/seed.js && node dist/server.js"]
