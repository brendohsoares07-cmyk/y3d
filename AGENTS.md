# AGENTS.md — Y3D Creations

Instruções para agentes de IA (Claude Code, Codex, Cursor, etc.) que trabalham neste repositório.
Leia este arquivo inteiro antes de alterar qualquer coisa.

## Sobre o projeto

Loja/oficina de impressão 3D (**Y3D Creations**). Full stack 100% TypeScript, em Docker.

| Parte    | Tecnologia                                   | Pasta        |
|----------|----------------------------------------------|--------------|
| API      | Node 22, Express 5, TypeScript, mysql2, JWT  | `backend/`   |
| Frontend | React 18, Vite, React Router, TypeScript     | `frontend/`  |
| Banco    | MySQL 8.4 (script inicial em `database/`)    | `database/`  |
| Proxy    | Nginx (único serviço exposto)                | `nginx/`     |

## Comandos

```bash
cp .env.example .env            # uma vez; o preenchimento do .env é feito pela pessoa, não pelo agente
docker compose up --build       # sobe tudo em http://localhost

cd backend  && npm install && npx tsc --noEmit   # checa tipos da API
cd frontend && npm install && npm run build      # checa tipos + build do React
```

## Arquitetura do backend (siga o padrão)

`routes → controllers → services → repositories → MySQL`, com entidades em `entities/`.

- `entities/`: classes com campos privados, getters/setters **só quando há validação**, herdam de `BaseEntity` (abstrata).
- `repositories/`: estendem `BaseRepository<T>` (genérico). SQL fica só aqui.
- `services/`: estendem `CrudService<T, TInput>`. Regras de negócio ficam aqui.
- `controllers/`: estendem `CrudController<T, TInput>`. Só lidam com HTTP.
- `errors/AppError.ts`: erros customizados (`ValidationError`, `NotFoundError`...). Nunca lance `Error` genérico para erro de negócio.
- `container.ts`: única raiz de composição (injeção de dependência manual).

## Arquitetura do frontend

- `pages/`: uma pasta por recurso, com `XListPage` (listagem paginada) e `XFormPage` (cadastro/edição) em telas separadas.
- `components/ui/`: componentes genéricos e reutilizáveis (`DataTable`, `FormField`, `Pagination`...).
- `components/layout/`: estrutura de tela. Componentes usados por uma única página ficam como função separada no arquivo dessa página.
- `pages/store/` + `components/store/`: loja (detalhe do produto, checkout, minha conta). `pages/admin/` + `components/admin/`: painel admin.
- `context/CartContext.tsx` e `FavoritesContext.tsx`: carrinho e favoritos por usuário (no `localStorage`).
- `context/AuthContext.tsx`: usuário logado global. Token JWT no `localStorage` (via `services/http.ts`).
- `services/`: acesso à API. `hooks/`: lógica reutilizável de listagem e formulário.

## Convenções de código

- TypeScript estrito. **Proibido `any`** e proibido criar arquivos `.js`/`.jsx` de código-fonte.
- Nomes: classes `PascalCase`, variáveis/funções `camelCase`, tabelas e colunas `snake_case`, textos da interface em português.
- Toda rota, exceto `/api/auth/*` e `/api/health`, exige JWT. `/api/admin/*` exige também o claim `admin` do JWT (e-mails em `ADMIN_EMAILS`).
- Preço, frete e total de pedidos são sempre calculados no servidor; nunca confie em valores vindos do cliente.
- Listagens sempre paginadas (`?page=&limit=`).
- Editar/excluir recurso inexistente responde 404.
- Mudou uma regra de validação (CPF, senha, e-mail)? Altere backend **e** frontend.

## Skills do projeto

Ficam em `.claude/skills/<nome>/SKILL.md`. Use quando a tarefa combinar:

| Skill                    | Quando usar                                                           |
|--------------------------|-----------------------------------------------------------------------|
| `novo-crud`              | Criar um novo recurso completo (backend + frontend)                   |
| `revisao-poo-solid`      | Revisar/refatorar classes TypeScript (POO, SOLID, tipagem, exceções)  |
| `docker-compose-seguro`  | Mexer em `docker-compose.yml`, Nginx, rede ou variáveis de ambiente   |

## Guardrails (limites obrigatórios)

### Arquivos sensíveis
- **Nunca ler, abrir, imprimir, copiar, resumir ou citar** o conteúdo de `.env` ou `.env.*` (exceto `.env.example`), chaves (`*.pem`, `*.key`) ou a pasta `secrets/`.
  Isso vale para `cat`, `grep`, `head`, `docker compose config`, `printenv`, `env` e qualquer forma indireta.
- Precisa saber quais variáveis existem? Leia `.env.example`.
- Nunca colocar segredo real (senha, `JWT_SECRET`) em código, logs, testes, commits ou respostas.
- Nunca commitar `.env`. Ele deve continuar no `.gitignore`.
- Se um valor de segredo aparecer por acidente, avise a pessoa e **não o repita**.

### Ações proibidas sem pedido explícito da pessoa
- `docker compose down -v`, `docker volume rm`, `DROP`/`TRUNCATE` ou `DELETE` sem `WHERE` (apagam dados do MySQL).
- `rm -rf` fora de `node_modules/` e `dist/`; `git push --force`; `git reset --hard`; reescrever histórico.
- Publicar portas de `db`, `backend` ou `frontend` no compose. **Somente o `nginx` tem `ports`.**
- Remover autenticação de rotas, enfraquecer validação de senha/CPF, ou guardar senha sem hash.
- Instalar dependência nova sem justificar. Alterar `.claude/settings.json` ou este arquivo.

### Comportamento
- Faça a menor mudança que resolve o pedido; não reescreva o que não foi pedido.
- Antes de concluir, rode a checagem de tipos das partes alteradas e informe o resultado.
- Se o pedido conflitar com estes guardrails, explique o conflito e pergunte antes de agir.
