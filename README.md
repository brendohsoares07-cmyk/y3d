# Y3D Creations — site em PHP

Mesma base do projeto original (header, footer, hero com vídeo, loja, carrinho, login), com a home enxuta.

## Como rodar

```bash
php -S localhost:8000
```

Abra http://localhost:8000. O vídeo da hero é `assets/video/producao.mp4`; se o arquivo sumir, a hero volta para o slideshow de fotos.

## Diferenças em relação ao original

Removidos da home (`index.php`): seção **Catálogo Y3D**, seção **Os favoritos da comunidade / Mais vendidos em destaque** e o banner **Impressão 3D**.

Mantidos: header, footer, hero com vídeo, faixa da marca, Sobre + FAQ e o bloco de login.

Contas de usuário ficam em `data/usuarios.json` (criado no primeiro cadastro; já está no `.gitignore`).
