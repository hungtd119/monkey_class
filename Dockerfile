# Install dependencies only when needed
FROM node:18-alpine AS deps
RUN npm install -g npm@latest

ENV NODE_ENV=production
RUN apk add --no-cache libc6-compat


WORKDIR /app
COPY package.json ./
RUN npm install

# Rebuild the source code only when needed
FROM node:18-alpine  AS builder
RUN npm install -g npm@latest

ENV NODE_ENV=production
WORKDIR /app

COPY . ./
COPY --from=deps /app/node_modules ./node_modules

#RUN rm -f tsconfig.json
RUN rm -f next-env.d.ts
RUN rm -f pnpm-lock.yaml
RUN rm -f .npmrc
RUN rm -f package-lock.json
RUN npm run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
RUN rm -rf tsconfig.json

USER nextjs

CMD ["node", "server.js"]
#CMD ["npx", "next", "start"]
EXPOSE 3000

#FROM node:18-alpine AS base
#
#RUN npm install -g npm@latest
#
#WORKDIR /app
#COPY package.json ./
##COPY package-lock.json ./
#RUN npm install
#
#COPY . .
#
#RUN npm run build
#RUN rm -f .env.production
#RUN rm -f .env.development
#
#COPY .env.production ./
#
#CMD ["npx", "next", "start"]
#
#EXPOSE 3000
