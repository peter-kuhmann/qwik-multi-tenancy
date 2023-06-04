FROM node:18.16.0-alpine as builder
WORKDIR website
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn --frozen-lockfile
COPY . .
#RUN yarn prisma generate
RUN yarn build

FROM node:18.16.0-alpine
WORKDIR website
COPY --from=builder website/node_modules node_modules
COPY --from=builder website/dist dist
COPY --from=builder website/server server
COPY --from=builder website/package.json package.json
CMD node server/entry.fastify