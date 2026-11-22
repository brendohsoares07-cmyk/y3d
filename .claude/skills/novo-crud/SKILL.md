# Novo CRUD

Use esta skill para adicionar um recurso completo à API MySQL e ao painel React.

## Backend

1. Defina entradas e tipos de resposta em `backend/src/shared/types/`.
2. Crie a entidade em `backend/src/crud/<recurso>/`, estendendo `BaseEntity`; mantenha estado privado e valide nos setters/fábricas.
3. Crie o repositório baseado em `BaseRepository<T>` e mantenha SQL somente nele.
4. Crie serviço baseado em `CrudService<T, TInput>` para regras de negócio e controller baseado em `CrudController<T, TInput>` para HTTP.
5. Registre dependências em `backend/src/container.ts` e rotas em `backend/src/routes/index.ts`.
6. Exija JWT nas rotas CRUD e claim admin quando o recurso for administrativo. Use erros de `errors/AppError.ts`.
7. Para listagens, use `parsePagination`; para alterações/exclusões, retorne 404 quando o recurso não existir.
8. Adicione a tabela/relacionamentos em `database/database.sql` sem apagar dados existentes.

## Frontend

1. Adicione tipos, cliente do recurso em `frontend/src/services/resources.ts` e validações compartilhadas quando necessário.
2. Separe listagem paginada e formulário em páginas distintas.
3. Reutilize `DataTable`, `Pagination`, `ResourceForm`, `FormField` e hooks existentes.
4. Exiba mensagens amigáveis da API e não use `any`.

## Validação

Rode `npm run build` no `backend/` e no `frontend/`. Não leia `.env` nem arquivos de segredo; use `.env.example` para conhecer nomes de variáveis.
