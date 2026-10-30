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

O formulário da página de contato envia as mensagens para `y3dsuporte@gmail.com` via SMTP; as mensagens também continuam salvas no painel admin. A recuperação de senha envia um link de uso único, válido por uma hora, pelo mesmo serviço. Configure no `.env` as variáveis `Y3D_SMTP_USER`, `Y3D_EMAIL_FROM` e `Y3D_SMTP_PASSWORD`; para Gmail, use uma senha de app do Google, nunca a senha normal da conta. Gere-a nas configurações de segurança do Google, com a verificação em duas etapas ativada, e guarde-a somente no `.env` local ou no gerenciador de segredos do servidor. Nunca a envie no chat nem a versione. O arquivo `.htaccess` bloqueia o acesso HTTP ao `.env`. O Docker instala o PHPMailer e permite a saída SMTP sem publicar portas da loja. `Y3D_BASE_URL` pode ficar vazia para detectar o endereço público da requisição; em proxy com URL diferente, informe a URL pública completa.

Em servidor Apache fora do Docker, rode `composer install --no-dev --prefer-dist --optimize-autoloader` no diretório da loja e configure as variáveis SMTP no ambiente do Apache/servidor. O envio só funciona depois que essas credenciais estiverem configuradas.

O checkout Pix usa cobranças dinâmicas do Asaas. Configure `Y3D_ASAAS_API_KEY`, `Y3D_ASAAS_WEBHOOK_TOKEN` e `Y3D_ASAAS_API_URL` no ambiente local/servidor e cadastre o webhook HTTPS conforme [`docs/pagamento-asaas.md`](docs/pagamento-asaas.md). O pedido só aparece como pago após o evento `PAYMENT_RECEIVED`.

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
