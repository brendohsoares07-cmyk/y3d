# Y3D Creations — site em React + TypeScript

Migração do site em PHP para **React + TypeScript** (front) e **Express + TypeScript** (API, no lugar do PHP).
O visual é o mesmo: o `style.css` e o `admin.css` originais foram copiados sem alterações.

## Como rodar

```bash
npm install
cp .env.example .env     # ajuste ADMIN_EMAILS e, se quiser e-mail, o SMTP
npm run dev              # site em http://localhost:5173 (API em :3001)
```

Produção: `npm run build` e `NODE_ENV=production SESSION_SECRET=... npm start` (a API serve o site compilado).

## Administrador
Cadastre-se no site com um e-mail listado em `ADMIN_EMAILS` e depois entre pelo **login** (o cadastro nunca concede admin, igual ao PHP). Contas com `"admin": true` em `data/usuarios.json` também valem.

## Dados
Mesmos arquivos JSON do PHP, em `data/` (`usuarios`, `pedidos`, `mensagens`, `avaliacoes`, `catalogo_produtos`).
Se copiar o `data/` do site antigo, as contas continuam funcionando (senhas bcrypt `$2y$` são aceitas).
Fotos de perfil ficam em `data/avatares/`. A pasta `data/` não vai para o git.


## Validação contra o repositório (brendohsoares07-cmyk/y3d)
- Catálogo: agora tem os 30 produtos do repositório com os **mesmos ids** (inclui Porta-Óculos Coelhinho, Bailarina Azul, Clipes BT21, Suporte para Lightstick, Chaveiros Emblema BTS, Koya BT21, Estátua Guerreira, Grinch e Bailarina Rosa) mais os 4 produtos extras que já existiam neste projeto (ids 31 a 34). Assim pedidos antigos do PHP continuam apontando para o produto certo.
- Coiote, Frajola e Harry Potter voltaram para os ids 26, 27 e 28 (como no repositório) e a promoção de personagens usa 26, 27, 28 e 29.
- Combo Personagens: R$ 349,00 (as quatro peças separadas somam R$ 675,00; economia de R$ 326,00, 48% OFF), igual ao vídeo do site.
- Carrossel BT21: voltou o Koya (7 personagens, como diz o texto da coleção).
- Imagens que faltavam foram copiadas do repositório: segunda foto de produtos, galeria de fotos reservas (assets/img/produtos/galeria/, usada quando um produto fica sem foto), logo-y3d.png e rodape-malha.svg (o CSS do rodapé já apontava para ele). Fotos de perfil de usuários do repositório não foram copiadas.
- O servidor passou a usar a galeria reserva quando o produto não tem nenhuma imagem válida (igual a y3d_imagens_fallback_arquivos do PHP).
- A parte "rubrica" do repositório (backend/, frontend/, docker/, docs/, MySQL) é outro aplicativo e não foi misturada aqui.

## Rodar a loja no Docker
```
docker compose -f docker-compose.loja.yml up --build
```
Abra http://localhost (troque a porta com `HTTP_PORT` no `.env`). Essa configuração usa somente uma porta HTTP publicada e salva os dados (contas, pedidos, mensagens) em arquivos na pasta `data/`; ela não usa MySQL.

O sistema principal (`docker-compose.yml`) também usa apenas a porta HTTP publicada por `HTTP_PORT` (padrão 80); o MySQL fica acessível somente dentro da rede Docker, sem porta exposta no computador. As duas configurações são alternativas: execute apenas uma por vez.
O `docker-compose.yml` da raiz continua sendo o do sistema de gestão (rubrica), sem alterações.
