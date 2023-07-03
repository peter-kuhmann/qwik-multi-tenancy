FROM node:20.3-alpine as builder
WORKDIR qwik-multi-tenancy
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm prisma generate
RUN pnpm build
CMD node server/entry.fastify