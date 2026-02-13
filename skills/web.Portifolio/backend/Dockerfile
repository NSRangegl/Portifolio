FROM node:20 AS base
RUN npm install -g pnpm

FROM base AS build
WORKDIR /usr/src/app
COPY . .

# Removido --frozen-lockfile para permitir que o pnpm ajuste o lockfile se necessário durante o build
RUN pnpm install

RUN pnpm prisma:generate
RUN pnpm build

FROM base AS runner
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=build /usr/src/app/dist /usr/src/app/dist
COPY --from=build /usr/src/app/prisma /usr/src/app/prisma
COPY --from=build /usr/src/app/package.json /usr/src/app/package.json

EXPOSE 5000
CMD [ "pnpm", "start" ]
