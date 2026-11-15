# DevOps (Docker, Nginx, MySQL)

| Critério | Onde está |
|---|---|
| Organização do docker-compose | `docker-compose.yml` (serviços, volumes, redes, variáveis comentados) |
| Integração entre serviços | backend → `db` (host `db`), frontend consumido via `/`, Nginx proxy para `/api` |
| Persistência no MySQL | volume `db_data` em `/var/lib/mysql` |
| Nginx como proxy reverso | `nginx/nginx.conf` |
| Isolamento por Docker Network | Só `nginx` tem `ports`; `app_net` e `db_net` são `internal: true` |

## Como rodar
```bash
cp .env.example .env      # edite o .env e troque as senhas
docker compose up --build
```
- `docker/backend/Dockerfile` e `docker/frontend/Dockerfile`: imagens (o `docker-compose.yml` aponta para elas).
- `database/database.sql`: contém a estrutura e os dados iniciais; o serviço `db-sync` reaplica o arquivo quando seu conteúdo muda.
- **Não use `docker compose down -v`**: apaga o volume do MySQL.
