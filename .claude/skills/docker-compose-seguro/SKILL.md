# Docker Compose seguro

Use esta skill ao alterar Compose, Nginx, redes, volumes ou variáveis de ambiente.

## Regras

- Nunca abra, imprima ou carregue `.env`/`.env.*`; use somente `.env.example` para consultar nomes de variáveis.
- Não execute `docker compose config`, pois pode revelar valores interpolados.
- Publique somente a porta do Nginx. Banco, API e frontend devem permanecer em redes internas.
- Não execute `docker compose down -v`, remova volumes, nem apague ou recrie dados sem autorização explícita.
- Preserve nomes de serviços, volumes e redes existentes, salvo necessidade direta do requisito.
- Revise as diferenças do Compose e do Nginx antes de validar; não inclua segredos em configuração, logs ou exemplos.

## Validação

Use verificações não destrutivas e reporte se o Docker Engine não estiver disponível. Não inicialize serviços que possam migrar, limpar ou substituir dados sem autorização.
