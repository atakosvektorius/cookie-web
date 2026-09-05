FROM node:24.2.0-alpine AS builder

WORKDIR /app

# Dependencies first, from the lockfile — this layer is reused
# while only the source changes
COPY app/package.json app/package-lock.json ./
RUN npm ci

# Application source code and the production build
COPY app .
RUN npm run build



################################
##### Production container #####
################################
FROM caddy:2.11-alpine AS prod

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
