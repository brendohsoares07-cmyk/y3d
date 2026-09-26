---
name: docker-compose-seguro
description: Regras para editar docker-compose.yml, Nginx, redes e variáveis de ambiente do Y3D sem quebrar o isolamento (só o Nginx exposto), a persistência do MySQL e sem vazar segredos do .env. Use ao mexer em Docker, Nginx, portas, volumes ou deploy.
---

# Docker Compose seguro

## Arquitetura que deve ser preservada
```
Internet → nginx (porta 80) ──/──────→ frontend (nginx interno, arquivos do React)
                            └─/api/──→ backend (Express :3000) ──→ db (MySQL)
```

## Regras
1. **Somente `nginx` tem `ports`.** `db`, `backend` e `frontend` usam apenas `networks`. Nunca use `ports:` neles (nem "só para testar").
2. **Redes**: `public_net` (só nginx, com acesso externo), `app_net` (`internal: true`: nginx, frontend, backend), `db_net` (`internal: true`: backend e db). O `db` não entra em `app_net`.
3. **Persistência**: o volume `db_data` monta em `/var/lib/mysql`. Nunca remova esse volume; nunca sugerir `docker compose down -v` sem pedido explícito.
4. **Segredos**: valores vêm de `${VARIAVEL}` lidas do `.env`. Não escreva senha no compose, no código nem em respostas. **Não abra o `.env`**: para saber quais variáveis existem, leia `.env.example`. Não rode `docker compose config` (imprime os valores).
5. **Ordem de subida**: `backend` usa `depends_on` com `condition: service_healthy` do `db` (healthcheck com `mysqladmin ping`).
6. **Nginx**: `/api/` → `backend:3000`; `/` → `frontend:80`. Toda nova rota da API deve ficar sob `/api/`.
7. Imagens com versão fixa (ex.: `mysql:8.4`), nunca `latest`.

## Antes de concluir
- Confirme que só existe um bloco `ports:` no arquivo (`grep -n "ports:" docker-compose.yml`).
- Explique a mudança e como testar: `docker compose up --build` e abrir http://localhost.
