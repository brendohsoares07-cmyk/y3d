---
name: novo-crud
description: Cria um novo recurso CRUD completo (entidade, repositório, serviço, controller, rota, tabela SQL e telas React de listagem paginada + formulário) seguindo o padrão do projeto Y3D Creations. Use quando pedirem "novo CRUD", "novo recurso" ou "cadastro de X".
---

# Novo CRUD no padrão Y3D

Use `Categoria` (simples) e `Produto` (com relacionamento) como modelos. Siga a ordem abaixo.

## Backend (`backend/src/`)
1. **Tabela**: adicione o `CREATE TABLE` em `database/init.sql` (snake_case, FK quando houver relacionamento). Avise que o script só roda em volume novo.
2. **Tipos**: em `types/index.ts` crie `XInput`.
3. **Entidade** `entities/X.ts`: `extends BaseEntity`; campos privados `_campo`; getter/setter **apenas** onde houver validação (use `requireText`, `requireInt`, `requireOneOf` de `utils/validators.ts`); implemente `toRow()` (snake_case) e `toJSON()` (camelCase).
4. **Repositório** `repositories/XRepository.ts`: `extends BaseRepository<X>`, `super("tabela")`, implemente `toEntity(row)`.
5. **Serviço** `services/XService.ts`: `extends CrudService<X, XInput>`, mensagem "não encontrado(a)" no `super`, implemente `build(input, id?)`.
6. **Controller** `controllers/XController.ts`: `extends CrudController<X, XInput>`.
7. **Composição**: registre repositório → serviço → controller em `container.ts`.
8. **Rota**: em `routes/index.ts` adicione `routes.use("/xs", authMiddleware, crudRouter(xController));` — toda rota de CRUD é autenticada.

## Frontend (`frontend/src/`)
1. `types/index.ts`: tipos `X` e `XInput`.
2. `services/resources.ts`: `export const xsApi = new CrudApi<X, XInput>("xs");`
3. `pages/xs/XsListPage.tsx`: `usePaginatedList` + `PageHeader` + `DataTable` + `Pagination`; componentes usados só nesta página viram funções separadas no mesmo arquivo.
4. `pages/xs/XFormPage.tsx`: `useResourceForm` + `ResourceForm` + `FormField`; validação de campos obrigatórios em `validate`.
5. `App.tsx`: rotas `/xs`, `/xs/novo`, `/xs/:id/editar` dentro do `ProtectedRoute`; link em `AppLayout.tsx`.

## Checklist final
- [ ] Sem `any` e sem arquivos `.js`
- [ ] Paginação na listagem; 404 ao editar/excluir inexistente
- [ ] `npx tsc --noEmit` no backend e `npm run build` no frontend passam
