# Arquitetura

| Parte | Tecnologia | Pasta |
|---|---|---|
| API | Node 22, Express 5, TypeScript, mysql2, JWT | `backend/` |
| Frontend | React 18, Vite, React Router, TypeScript | `frontend/` |
| Banco | MySQL 8.4 | `database/` |
| Proxy | Nginx (único serviço exposto) | `nginx/` |

## Backend (`routes → controllers → services → repositories → MySQL`)
- `crud/<recurso>/`: entidade, repositório, serviço e controller de cada CRUD.
- `users/`, `auth/`, `admin/`: usuário, autenticação e painel administrativo.
- `shared/base/`: classes genéricas (`BaseEntity`, `BaseRepository<T>`, `CrudService`, `CrudController`, `IRepository`).
- `shared/types`, `shared/utils`, `shared/validators`: tipos, utilitários e validações.
- `errors/`, `middlewares/`, `config/`, `routes/`; `container.ts` é a raiz de composição (injeção de dependência).

## Frontend
- `pages/`: telas · `components/`: `ui/` (genéricos), `layout/`, `rotas/`, `store/`, `admin/`.
- `contexts/` (Auth, Cart, Favorites) · `services/` · `hooks/` · `validations/` · `types/` · `styles/` · `utils/`.

## Tech Forge (TypeScript / POO / SOLID)
| Critério | Onde está |
|---|---|
| Encapsulamento e proteção do estado | Campos `private _x` nas entidades; `readonly`; construtores que inicializam tudo (`crud/*/` e `users/`) |
| Acesso controlado (get/set só com regra) | `Produto.preco` (arredonda, > 0), `Usuario.cpf` (valida e normaliza), `Usuario.email` (regex, minúsculas) |
| Domínio e pilares da POO | `shared/base/BaseEntity` (abstract) → 5 entidades; polimorfismo em `toRow()`/`toJSON()`; `buildInput` sobrescrito em `PedidoController` |
| Tipagem avançada | `interface IRepository<T>`, `type Row`, `Page<T>`, unions (`StatusPedido`, `TipoMaquina`), generics em `BaseRepository<T>` / `CrudService<T, TInput>` / `CrudApi<T, TInput>`; sem `any` |
| SOLID | **S** `PasswordHasher`, repos só com SQL · **O** novo CRUD = novas subclasses · **L** `PedidoService.update` respeita o contrato de `CrudService` · **D** serviços dependem de `IRepository` |
| Exceções e organização | `errors/AppError.ts` (Validation, Unauthorized, Forbidden, NotFound, Conflict) · `middlewares/errorHandler.ts` · uma pasta por módulo (`crud/categoria`, `crud/produto`, `crud/maquina`, `crud/pedido`, `users`, `auth`, `admin`) com entidade, repositório, serviço e controller lado a lado |
| TS sem JS injetado | Nenhum `.js` no código-fonte; `backend` e `frontend` compilam com `strict` |
