# Y3D Creations

Loja e painel administrativo para impressão 3D. A aplicação usa React, Vite e TypeScript no frontend; Express e TypeScript na API; MySQL para persistência; e Nginx como único serviço exposto.

## Executar com Docker

1. Copie o arquivo de exemplo:

   ```sh
   cp .env.example .env
   ```

   No PowerShell, use `Copy-Item .env.example .env`.
2. Preencha o `.env` com valores próprios. Troque as senhas de exemplo e defina um `JWT_SECRET` aleatório e longo. Configure SMTP se quiser habilitar envio e recuperação por e-mail.
3. Na raiz do projeto, construa e inicie os serviços:

   ```sh
   docker compose up --build
   ```
4. Acesse [http://localhost](http://localhost). Se alterar `HTTP_PORT` no `.env`, use a porta escolhida.

Não versione o `.env`; o `.env.example` contém apenas valores ilustrativos.

## Arquitetura

```text
Navegador → Nginx → frontend (React/Vite)
                   └→ backend (Express) → MySQL
```

- O Nginx publica a única porta HTTP do Compose. Requisições `/api/` vão para o backend; as demais são encaminhadas ao frontend.
- O frontend e o Nginx comunicam-se pela rede interna `app_net`.
- O backend conecta-se ao MySQL pela rede interna `db_net`; o serviço `db-sync` aplica o esquema e atualiza o catálogo.
- O volume `db_data` persiste os dados do MySQL. Não remova esse volume para reiniciar os serviços.
- As portas do banco, backend e frontend não são publicadas no host.

## Administrador

Defina em `ADMIN_EMAILS` os endereços autorizados, separados por vírgulas. Cadastre uma conta usando um desses e-mails e faça login; o backend atribui a permissão administrativa com base nessa configuração. Novas alterações nessa lista valem quando a conta obtiver um novo JWT ao entrar novamente.

## Verificações de desenvolvimento

```sh
cd backend
npx tsc --noEmit

cd ../frontend
npm run build
```
