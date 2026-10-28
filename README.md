# Y3D Creations

Projeto com **duas partes** no mesmo repositório:

| Parte | Tecnologias | Onde |
|---|---|---|
| **Loja (site em PHP)** | PHP + TypeScript compilado para `assets/js/` | arquivos `*.php` na raiz, `includes/`, `handlers/`, `ts/`, `assets/`, `data/` |
| **Aplicação TypeScript (rubrica)** | Express + MySQL (backend), React + Vite (frontend), Docker + Nginx | `backend/`, `frontend/`, `docker/`, `nginx/`, `database/`, `docker-compose.yml` |

## Rodar a loja em PHP

```bash
php -S localhost:8000
```

Contas ficam em `data/usuarios.json` (no Docker, a pasta `data/` é montada fora da raiz pública, em `/var/www/data`, via `Y3D_DATA_DIR`; em outros servidores, mantenha-a fora da pasta pública ou bloqueie o acesso). Para recompilar o TypeScript da loja: `npm run build`.

## Rodar a aplicação TypeScript com Docker

```bash
cp .env.example .env     # ajuste as senhas
docker compose up --build
```

O Nginx recebe tudo na porta `HTTP_PORT` (padrão 80) e encaminha para o serviço certo:

| Endereço | Vai para |
|---|---|
| `http://localhost/` | React (frontend) |
| `http://localhost/api/...` | API (backend) |
| `http://localhost/loja-php/` | loja em PHP |

Só o Nginx fica exposto; backend e banco ficam em redes internas. Veja `docs/` para arquitetura, autenticação, CRUDs, DevOps, IA generativa e `docs/avaliacao.md` (onde está cada item da rubrica).

## Agentes de IA

`AGENTS.md` define as regras; `.claude/skills/` tem as 3 skills (`novo-crud`, `docker-compose-seguro`, `revisao-poo-solid`) e `.claude/settings.json` os guardrails (incluindo bloqueio de leitura do `.env`). `.cursorignore` também protege o `.env`.
