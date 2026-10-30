# Configuração do Pix com Asaas

O checkout cria uma cobrança Pix por pedido no servidor. A página só mostra **Pagamento concluído** depois que o webhook do Asaas envia `PAYMENT_RECEIVED`; `PAYMENT_CONFIRMED` não é usado porque pode ocorrer antes de o dinheiro estar disponível na conta.

## Credenciais

No `.env` local ou no gerenciador de segredos do servidor, configure:

```dotenv
Y3D_ASAAS_API_KEY=chave-da-api-do-ambiente
Y3D_ASAAS_WEBHOOK_TOKEN=token-aleatorio-exclusivo-do-webhook
Y3D_ASAAS_API_URL=https://api-sandbox.asaas.com/v3
```

Use a chave de API de sandbox durante os testes. Para produção, use a chave de produção e `https://api.asaas.com/v3`. Gere um token de webhook separado da chave da API; não coloque nenhum desses valores no código nem os envie pelo chat.

## Webhook

Cadastre no painel Asaas a URL pública HTTPS:

```text
https://seu-dominio/loja-php/handlers/asaas-webhook.php
```

Selecione o evento `PAYMENT_RECEIVED` e configure a autenticação pelo token exclusivo em `Y3D_ASAAS_WEBHOOK_TOKEN`. O endpoint verifica o token, a referência do pedido, o ID da cobrança e o valor antes de atualizar o pedido. Eventos repetidos são seguros. O status exibido no checkout é consultado pela sessão do cliente; a navegação de retorno do navegador não confirma pagamentos.

O webhook precisa alcançar o site pela internet; `localhost` não recebe notificações do Asaas. Em desenvolvimento, use uma URL HTTPS pública de teste ou valide a integração em um ambiente publicado. Sem as credenciais e o webhook configurados, o checkout mantém o carrinho e informa que não foi possível gerar a cobrança.
