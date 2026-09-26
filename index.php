<?php
$tituloPagina = 'Início';
require_once __DIR__ . '/includes/dados_produtos.php';
require_once __DIR__ . '/includes/header.php';

// Vitrine principal da home: seis produtos de categorias diferentes.
$maisVendidos = array_filter($PRODUTOS, fn($p) => in_array($p['id'], [1, 3, 4, 12, 16, 21], true));
$maisVendidos = array_values($maisVendidos);

// Vídeo real de produção. Se existir assets/video/producao.mp4 ele vira o fundo da hero;
// caso contrário cai no slideshow com fotos reais das peças.
$videoProducao = __DIR__ . '/assets/video/producao.mp4';
$temVideoProducao = file_exists($videoProducao);

$faq = [
    ['Quais formatos de arquivo são suportados?', 'Trabalhamos com OBJ, STL, FBX e BLEND, além de peças físicas já impressas e prontas para envio.'],
    ['Como funciona o envio?', 'Modelos digitais são liberados para download imediato. Peças físicas são embaladas com cuidado e enviadas em até 3 dias úteis.'],
    ['Posso solicitar um modelo personalizado?', 'Sim! Envie sua ideia ou foto de referência pela página de Contato e preparamos um orçamento sob medida.'],
    ['Há garantia de qualidade?', 'Todo modelo passa por checagem antes da liberação, e toda peça impressa tem garantia contra defeitos de fabricação.'],
    ['Quais são as formas de pagamento?', 'Aceitamos Pix, cartão de crédito (com parcelamento) e boleto bancário.'],
];
?>

<!-- HERO: a peça principal da página, sozinha, em destaque total -->
<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-media">
    <?php if ($temVideoProducao): ?>
      <video autoplay muted loop playsinline poster="assets/img/produtos/army-patches.png">
        <source src="assets/video/producao.mp4" type="video/mp4">
      </video>
    <?php else: ?>
      <div class="hero-slide" style="background-image:url('assets/img/produtos/army-patches.png')"></div>
      <div class="hero-slide" style="background-image:url('assets/img/produtos/varinha-magica.png')"></div>
      <div class="hero-slide" style="background-image:url('assets/img/produtos/estatua-harry-potter.png')"></div>
      <div class="hero-slide" style="background-image:url('assets/img/produtos/quadro-flamengo.png')"></div>
      <div class="hero-slide" style="background-image:url('assets/img/produtos/quadro-harry-potter.png')"></div>
    <?php endif; ?>
    <div class="hero-overlay"></div>
  </div>
  <div class="hero-copy">
    <h1>Transforme suas ideias em <span class="grad">REALIDADE 3D</span></h1>
    <p>Modelos 3D de alta qualidade, prontos para seus projetos, impressões e animações.</p>
    <a href="produtos.php" class="btn btn-grad">Explorar loja →</a>
    <ul class="hero-tags">
      <li><span class="tag-ic">✨</span><span>Modelos Premium<br><b>Alta qualidade</b></span></li>
      <li><span class="tag-ic">⚡</span><span>Entrega instantânea<br><b>Download imediato</b></span></li>
      <li><span class="tag-ic">🛟</span><span>Suporte especializado<br><b>Sempre com você</b></span></li>
    </ul>
  </div>
</section>

<?php require __DIR__ . '/includes/marca.php'; ?>

<!-- Catálogo Y3D: navegação por categoria em cartões visuais -->
<section class="sec">
  <div class="sec-h"><h2>Catálogo Y3D</h2><a class="more" href="produtos.php">Ver todas as categorias →</a></div>
  <div class="grid g4">
    <a class="cat-tile" href="produtos.php?categoria=personalizados"><img src="assets/img/catalogo/chaveiros.png" alt="Chaveiros"></a>
    <a class="cat-tile" href="produtos.php?categoria=personagens"><img src="assets/img/catalogo/miniaturas-personagens.png" alt="Miniaturas e Personagens"></a>
    <a class="cat-tile" href="produtos.php?categoria=objetos"><img src="assets/img/catalogo/suportes-celular.png" alt="Suportes para Celular"></a>
    <a class="cat-tile" href="produtos.php?categoria=cenarios"><img src="assets/img/catalogo/decoracao.png" alt="Decoração"></a>
    <a class="cat-tile" href="produtos.php?categoria=objetos"><img src="assets/img/catalogo/vasos.png" alt="Vasos"></a>
    <a class="cat-tile" href="produtos.php?categoria=objetos"><img src="assets/img/catalogo/organizadores.png" alt="Organizadores"></a>
    <a class="cat-tile" href="produtos.php?categoria=game-assets"><img src="assets/img/catalogo/suportes-controles.png" alt="Suportes para Controles"></a>
    <a class="cat-tile" href="produtos.php?categoria=props"><img src="assets/img/catalogo/pecas-personalizadas.png" alt="Peças Personalizadas"></a>
    <a class="cat-tile" href="produtos.php?categoria=personagens"><img src="assets/img/catalogo/estatuetas.png" alt="Estatuetas"></a>
    <a class="cat-tile" href="produtos.php?categoria=personalizados"><img src="assets/img/catalogo/letreiros-logos.png" alt="Letreiros e Logos"></a>
    <a class="cat-tile" href="produtos.php?categoria=personalizados"><img src="assets/img/catalogo/brindes-personalizados.png" alt="Brindes e Personalizados"></a>
    <a class="cat-tile" href="contato.php"><img src="assets/img/catalogo/cta.png" alt="Faça seu orçamento"></a>
  </div>
</section>

<!-- Mais vendidos em destaque -->
<section class="sec featured-products">
  <div class="featured-products-head">
    <div><span class="lg-eyebrow">OS FAVORITOS DA COMUNIDADE</span><h2>🔥 Mais vendidos em destaque</h2><p>Seis escolhas de categorias diferentes para começar seu próximo projeto 3D.</p></div>
    <a class="btn btn-outline btn-sm" href="produtos.php">Ver todos os produtos →</a>
  </div>
  <div class="grid g3">
      <?php foreach ($maisVendidos as $p) include __DIR__ . '/includes/card_produto.php'; ?>
  </div>
</section>

<!-- Impressão 3D: banner de serviço, largura total -->
<section class="sec">
  <div class="card-panel" style="display:flex;align-items:center;gap:26px;flex-wrap:wrap;background:linear-gradient(135deg,#3a1568,#101a3e)">
    <div style="font-size:52px;flex:none">🖨️</div>
    <div style="flex:1;min-width:240px">
      <h3 style="margin:0 0 4px;font-size:19px"><span class="grad">IMPRESSÃO 3D</span></h3>
      <p style="color:var(--mute);margin:0">Transforme seus modelos em peças reais! Alta precisão, diversos materiais e atendimento especializado.</p>
    </div>
    <a href="contato.php" class="btn btn-grad" style="flex:none">Saiba mais →</a>
  </div>
</section>

<!-- Sobre a Y3D + Dúvidas Frequentes -->
<section class="sec">
  <div class="grid g2" style="align-items:stretch">
    <div class="card-panel">
      <div class="sec-h"><h2>Sobre a Y3D</h2></div>
      <div class="about-mini">
        <p>Somos uma plataforma criada para conectar criadores, artistas e entusiastas do mundo 3D. Aqui você encontra modelos exclusivos, de alta qualidade e com suporte completo.</p>
        <a href="sobre.php" class="btn btn-grad btn-sm" style="align-self:flex-start">Saiba mais →</a>
        <div class="stats">
          <div><b>+10k</b><span>Modelos disponíveis</span></div>
          <div><b>+5k</b><span>Clientes satisfeitos</span></div>
          <div><b>99%</b><span>Avaliação positiva</span></div>
        </div>
      </div>
    </div>
    <div class="card-panel">
      <div class="sec-h"><h2>Dúvidas Frequentes</h2></div>
      <div class="faq">
        <?php foreach ($faq as $i => $qa): ?>
          <details<?= $i === 0 ? ' open' : '' ?>>
            <summary><?= htmlspecialchars($qa[0]) ?></summary>
            <p><?= htmlspecialchars($qa[1]) ?></p>
          </details>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
</section>

<?php if (!$usuarioLogado): ?>
<!-- Acesse sua conta: fecha a página como convite final, sem cortar o fluxo de compra -->
<section class="sec">
  <div class="sec-h"><h2>Acesse sua conta</h2></div>
  <div class="lg-embed">
    <div class="lg-art">
      <?php require __DIR__ . '/includes/login_arte.php'; ?>
    </div>
    <div class="lg-side">
      <div class="lg-card">
        <?php $lgPrefix = 'home'; $erro = null; require __DIR__ . '/includes/form_login.php'; ?>
      </div>
    </div>
  </div>
</section>
<?php endif; ?>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
