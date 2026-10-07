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
- `database/schema.sql` + `database/seeds/`: rodam na primeira vez que o volume `db_data` é criado. `database/migrations/`: scripts opcionais para bancos já criados.
- **Não use `docker compose down -v`**: apaga o volume do MySQL.
