# Etapa 1: instala dependências e compila o TypeScript
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY tsconfig.scripts.json ./
COPY src ./src
COPY scripts ./scripts
RUN npm run build && npm run build:scripts

# Etapa 2: imagem final só com o necessário para rodar
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/dist-scripts ./dist-scripts
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
