# Y3D Creations

Sistema da Y3D Creations (loja e oficina de impressão 3D) em **TypeScript de ponta a ponta**:
API Express + React + MySQL, tudo orquestrado com Docker e Nginx.

## Como rodar

```bash
cp .env.example .env      # depois edite o .env e troque as senhas
docker compose up --build
```

Abra **http://localhost** (ou a porta definida em `HTTP_PORT`). Crie uma conta em *Cadastre-se* e faça login: você cai na **loja**.
Para ver o **Painel admin**, cadastre-se com um e-mail listado em `ADMIN_EMAILS` (no `.env`) e faça login de novo.

Só o Nginx está exposto; frontend, backend e banco ficam em redes internas do Docker.
Os dados do MySQL ficam no volume `db_data` e sobrevivem a reinícios (`docker compose down` mantém; **não use `-v`**).

## Telas

| Rota | O que é |
|---|---|
| `/loja` · `/loja/produtos` | Início e catálogo (busca e filtro por categoria) |
| `/loja/produtos/:id` | **Detalhe do produto** (galeria, avaliação, personalização, quantidade, carrinho, favoritos) — um para cada um dos 25 produtos |
| `/loja/checkout` | **Finalizar compra** (endereço, forma de pagamento, revisão do pedido) |
| `/loja/conta` | **Minha conta** (meus pedidos com abas, meu perfil, favoritos) |
| `/admin` | **Painel admin** (KPIs, faturamento mensal, top clientes, tabela de clientes) — só administradores |
| `/dashboard` e CRUDs | Gestão de categorias, produtos, máquinas e pedidos |

## Funcionalidades

- **Autenticação**: login por e-mail e senha, senha com hash bcrypt, token JWT, token guardado no `localStorage`.
- **Cadastro** de usuário: nome, e-mail, senha (com confirmação), CPF. Valida e-mail, CPF e nível de senha.
- **Edição do próprio usuário**: e-mail bloqueado, todos os campos obrigatórios, dados globais via Context.
- **4 CRUDs autenticados e paginados**: Categorias, Produtos, Máquinas (impressoras) e Pedidos.
- **Relacionamentos**: Categoria 1:N Produto · Usuário 1:N Pedido · Pedido 1:N Itens → Produto.
- **Loja**: carrinho e favoritos guardados no navegador (por usuário); o pedido é gravado com itens, endereço e forma de pagamento. O preço e o frete são sempre calculados no servidor.
- **Permissões**: cliente vê e cria só os próprios pedidos; administrador vê todos, muda o status e acessa `/api/admin/*`.

## API (prefixo `/api`)

| Método | Rota | Auth |
|---|---|---|
| POST | `/auth/register`, `/auth/login` | pública |
| GET | `/usuarios/me` | JWT |
| PUT | `/usuarios/:id` (só o próprio) | JWT |
| GET, POST | `/categorias` `/produtos` `/maquinas` `/pedidos` (`?page=1&limit=10`) | JWT |
| GET, PUT, DELETE | `/categorias/:id` `/produtos/:id` `/maquinas/:id` `/pedidos/:id` | JWT |
| GET | `/admin/dashboard`, `/admin/clientes?page=&busca=&status=` | JWT + administrador |

`POST /pedidos` recebe `{ itens: [{ produtoId, quantidade, personalizacao? }], formaPagamento, entrega }`.
Em `PUT /pedidos/:id` (só administrador) apenas o `status` muda.

Erros voltam como `{ "message": "..." }` com o status HTTP adequado (400, 401, 403, 404, 409).

## Regras de validação

- **Senha**: mínimo 8 caracteres, com maiúscula, minúscula, número e caractere especial.
- **CPF**: dígitos verificadores (aceita com ou sem máscara; salvo só com dígitos).
- **E-mail**: regex, guardado em minúsculas, único.

## Estrutura

```
backend/    API (entities, repositories, services, controllers, errors, middlewares, routes)
frontend/   React (pages, components, hooks, context, services)
database/   init.sql (tabelas + catálogo de 25 produtos)
nginx/      default.conf (proxy reverso)
.claude/    guardrails e skills dos agentes  ·  AGENTS.md
RUBRICA.md  onde cada item da rubrica está no código
```

## Desenvolvimento sem Docker (opcional)

Precisa de um MySQL local com o `database/init.sql` aplicado.

```bash
cd backend  && npm install && DB_HOST=localhost DB_NAME=y3d DB_USER=... DB_PASSWORD=... JWT_SECRET=... npm run dev
cd frontend && npm install && npm run dev      # http://localhost:5173 (proxy /api → :3000)
```
