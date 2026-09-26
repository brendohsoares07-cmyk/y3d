# Mapa da rubrica → código

## Backend

| Item da rubrica | Onde está |
|---|---|
| Login com e-mail/senha, regex de e-mail, JWT, só usuário existente | `backend/src/services/AuthService.ts` (`login`) · `utils/validators.ts` (`isEmail`) |
| Senha criptografada | `services/PasswordHasher.ts` (bcrypt) — o banco guarda só `senha_hash` |
| Cadastro (nome, e-mail, senha, CPF) + validações de CPF, senha e e-mail | `AuthService.register` · `entities/Usuario.ts` (setters) · `utils/validators.ts` |
| Edição: rota autenticada, só o próprio usuário | `routes/index.ts` (`authMiddleware`) · `UsuarioService.update` (403 se `id` ≠ token) |
| Edição: campos obrigatórios, CPF, senha, e-mail imutável | `UsuarioService.update` |
| 4 CRUDs completos, todos autenticados | Categorias, Produtos, Máquinas, Pedidos — `routes/index.ts` |
| Paginação | `BaseRepository.findPage` · `utils/http.ts` (`parsePagination`) |
| Não editar/deletar o que não existe | `CrudService.getOrFail` → `NotFoundError` (404) |
| Relacionamento entre recursos | `database/init.sql` (FKs, `pedido_itens`) · `PedidoService` (busca os produtos e calcula o total) |
| AGENTS.md + 3 skills + guardrails + proteção do `.env` | `AGENTS.md` · `.claude/skills/*` · `.claude/settings.json` · `.gitignore` · `.cursorignore` |

## Frontend

| Item da rubrica | Onde está |
|---|---|
| Login: campos, regex, token no localStorage, erros amigáveis, redirecionamento | `pages/LoginPage.tsx` · `services/http.ts` (`tokenStorage`, `friendlyMessage`) |
| Cadastro: obrigatórios, senha dupla, CPF, e-mail, redireciona ao login, erros da API | `pages/RegisterPage.tsx` |
| Edição: Context global, CPF, nível de senha, confirmação, e-mail bloqueado | `context/AuthContext.tsx` · `pages/ProfilePage.tsx` |
| 4 CRUDs, paginação, validação de obrigatórios, listagem e formulário em telas separadas | `pages/{categorias,produtos,maquinas,pedidos}/` (`XListPage` + `XFormPage`) |
| Componentes genéricos e reutilizáveis | `components/ui/` (`DataTable`, `FormField`, `Pagination`, `ResourceForm`...) · `hooks/` |
| Telas compostas por vários componentes | ex.: `ProdutosListPage` = `PageHeader` + `DataTable` + `Pagination` |
| Componentes e páginas em pastas separadas | `src/components/` e `src/pages/` |
| Componentes exclusivos da página em funções separadas | `CategoriaTag`, `StatusTag`, `TipoTag`, `SenhaChecklist`, `AtalhoCard` |

## Extras (loja e painel admin)

| Parte | Onde está |
|---|---|
| Detalhe do produto (mockup 3) | `pages/store/ProductDetailPage.tsx` + `components/store/{Breadcrumb,ProductGallery,ProductInfo,ProductAside,TrustStrip}.tsx` |
| Finalizar compra (mockup 7) | `pages/store/CheckoutPage.tsx` + `components/store/{AddressForm,PaymentOptions,OrderSummary}.tsx` |
| Minha conta (mockup 8) | `pages/store/Account*.tsx` + `components/store/{AccountSidebar,OrderCard}.tsx` |
| Painel admin (ordem da tela: KPIs → gráfico + top clientes → clientes) | `pages/admin/AdminPage.tsx` + `components/admin/{KpiCards,RevenueChart,TopClients,ClientsTable}.tsx` · backend `AdminService`, `AdminRepository`, `adminMiddleware` |
| Pedido com vários itens em transação | `entities/Pedido.ts`, `entities/Entrega.ts`, `repositories/PedidoRepository.ts` |

## Tech Forge (TypeScript / POO / SOLID)

| Critério | Onde está |
|---|---|
| Encapsulamento e proteção do estado | Campos `private _x` nas entidades; `readonly`; construtores que inicializam tudo (`entities/`) |
| Acesso controlado (get/set só com regra) | `Produto.preco` (arredonda, > 0), `Usuario.cpf` (valida e normaliza), `Usuario.email` (regex, minúsculas) |
| Domínio e pilares da POO | `BaseEntity` (abstract) → 5 entidades; polimorfismo em `toRow()`/`toJSON()`; `buildInput` sobrescrito em `PedidoController` |
| Tipagem avançada | `interface IRepository<T>`, `type Row`, `Page<T>`, unions (`StatusPedido`, `TipoMaquina`), generics em `BaseRepository<T>` / `CrudService<T, TInput>` / `CrudApi<T, TInput>`; sem `any` |
| SOLID | **S** `PasswordHasher`, repos só com SQL · **O** novo CRUD = novas subclasses · **L** `PedidoService.update` respeita o contrato de `CrudService` · **D** serviços dependem de `IRepository` |
| Exceções e organização | `errors/AppError.ts` (Validation, Unauthorized, Forbidden, NotFound, Conflict) · `middlewares/errorHandler.ts` · pastas `entities/services/repositories/controllers` |
| TS sem JS injetado | Nenhum `.js` no código-fonte; `backend` e `frontend` compilam com `strict` |

## DevOps

| Critério | Onde está |
|---|---|
| Organização do docker-compose | `docker-compose.yml` (serviços, volumes, redes, variáveis comentados) |
| Integração entre serviços | backend → `db` (host `db`), frontend consumido via `/`, Nginx proxy para `/api` |
| Persistência no MySQL | volume `db_data` em `/var/lib/mysql` |
| Nginx como proxy reverso | `nginx/default.conf` |
| Isolamento por Docker Network | Só `nginx` tem `ports`; `app_net` e `db_net` são `internal: true` |

## O que depende de você

- **Evolução do projeto / Nota das sprints**: dependem do seu histórico de commits e do que foi entregue em cada sprint.
- **Persona/cliente**: o tema, as categorias, os produtos e as máquinas vêm da Y3D Creations (parte 1). Ajuste os textos ao briefing da sua persona, se houver.
