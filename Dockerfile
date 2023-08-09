ARG NODE_IMAGE=node:16.13.1-alpine

FROM $NODE_IMAGE AS base
RUN apk --no-cache add dumb-init
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node
RUN mkdir tmp

FROM base AS dependencies
COPY --chown=node:node ./package*.json ./
RUN npm ci
COPY --chown=node:node . .

FROM dependencies AS build
RUN node ace build --production --ignore-ts-errors

FROM base AS production
ENV NODE_ENV=production
ENV APP_KEY=zmySFzSMOgVl-c91euBqzLjYb0EheK6z
ENV DRIVE_DISK=local
ENV DB_CONNECTION=sqlite
# ENV PORT=3333
# ENV HOST=0.0.0.0
COPY --chown=node:node ./package*.json ./
RUN npm ci --production
COPY --chown=node:node --from=build /home/node/app/build .
EXPOSE 5000
CMD [ "dumb-init", "node", "server.js" ]
