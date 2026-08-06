# Dockerfile

# use the official Node.js image
# see all versions at https://hub.docker.com/_/node
FROM node:26 AS base
WORKDIR /usr/src/app

# install pnpm (version pinned in package.json devEngines)
RUN npm install -g pnpm@11

# install dependencies into a temp folder
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json pnpm-lock.yaml /temp/dev/
RUN cd /temp/dev && pnpm install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json pnpm-lock.yaml /temp/prod/
RUN cd /temp/prod && pnpm install --frozen-lockfile --prod

# copy node_modules from the temp folder
# then copy all (non-ignored) project files into the image
FROM install AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional] tests & typecheck
# ENV NODE_ENV=production
# RUN pnpm typecheck
# RUN pnpm test

# copy production dependencies and source code into the final image
FROM base AS release
ENV NODE_ENV=production
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/src ./src
COPY --from=prerelease /usr/src/app/package.json .

# create the log directory and grant write access to the node user
RUN mkdir -p logs && chown -R node:node /usr/src/app

# run the app
USER node
EXPOSE 3000/tcp
CMD ["node", "./src/index.ts"]
