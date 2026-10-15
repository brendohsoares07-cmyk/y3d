# CRUDs (Categorias, Produtos, Máquinas e Pedidos)

Backend: uma pasta por recurso em `backend/src/crud/` (`categoria/`, `produto/`, `maquina/`, `pedido/`), cada uma com entidade, repositório, serviço e controller.
Frontend: uma pasta por recurso em `frontend/src/pages/`, com `XListPage` (listagem paginada) e `XFormPage` (cadastro/edição) em telas separadas.

## Backend
| Item da rubrica | Onde está |
|---|---|
| 4 CRUDs completos, todos autenticados | Categorias, Produtos, Máquinas, Pedidos — `routes/index.ts` |
| Paginação | `shared/base/BaseRepository.findPage` · `shared/utils/http.ts` (`parsePagination`) |
| Não editar/deletar o que não existe | `shared/base/CrudService.getOrFail` → `NotFoundError` (404) |
| Relacionamento entre recursos | `database/schema.sql` (FKs, `pedido_itens`) · `crud/pedido/PedidoService` (busca os produtos e calcula o total) |

## Frontend
| Item da rubrica | Onde está |
|---|---|
| 4 CRUDs, paginação, validação de obrigatórios, listagem e formulário em telas separadas | `pages/{Categorias,Produtos,Maquinas,Pedidos}/` (`XListPage` + `XFormPage`) |
| Componentes genéricos e reutilizáveis | `components/ui/` (`DataTable`, `FormField`, `Pagination`, `ResourceForm`...) · `hooks/` |
| Telas compostas por vários componentes | ex.: `ProdutosListPage` = `PageHeader` + `DataTable` + `Pagination` |
| Componentes e páginas em pastas separadas | `src/components/` e `src/pages/` |
| Componentes exclusivos da página em funções separadas | `CategoriaTag`, `StatusTag`, `TipoTag`, `SenhaChecklist`, `AtalhoCard` |

## Como criar um novo CRUD
Use a skill `.claude/skills/novo-crud/SKILL.md` (passo a passo de backend + frontend).
