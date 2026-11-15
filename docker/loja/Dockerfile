# Docker da LOJA (site React + API Express, as pastas src/ e server/ na raiz do projeto).

# Etapa 1: instala as dependências e compila o site (Vite) e a API (TypeScript)
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json tsconfig.server.json vite.config.ts index.html ./
COPY public ./public
COPY src ./src
COPY server ./server
COPY shared ./shared
RUN npm run build

# Etapa 2: imagem final, só com o que precisa para rodar
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/dist-server ./dist-server
# O servidor usa a pasta public para achar as fotos dos produtos (galeria e miniaturas)
COPY --from=build /app/public ./public
# Pasta dos dados (contas, pedidos...). No compose ela vem da pasta ./data do seu computador.
RUN mkdir -p /app/data && chown -R node:node /app/data
USER node
EXPOSE 3001
CMD ["node", "dist-server/server/index.js"]
