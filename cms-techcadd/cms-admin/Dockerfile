FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
# Coolify injects all env vars as ARGs into every stage, so NODE_ENV=production
# would skip devDependencies (vite, typescript) needed for the build step.
ENV NODE_ENV=development
RUN npm ci
COPY . .

# Vite inlines import.meta.env.* into the bundle at build time.
# Hardcoded to /api because nginx proxies /api/ to cms-api-hoshiarpur:4000
# (see nginx.conf) for same-origin cookies. Coolify injects VITE_API_URL as a
# build ARG which would override this — the explicit ENV here wins over any ARG.
ENV VITE_API_URL=/api

# The public website URL, used by the page/course preview panel and "view on
# site" links (see previewProtocol.ts / siteMap.ts). Unlike VITE_API_URL this
# varies per deployment, so it must come through as a build ARG — falls back
# to localhost:3000 in the frontend source if left unset.
ARG VITE_SITE_URL
ENV VITE_SITE_URL=${VITE_SITE_URL}

RUN npm run build


FROM nginx:1.27-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:80/ || exit 1
