<?php
$tituloPagina = 'Início';
require_once __DIR__ . '/includes/dados_produtos.php';
require_once __DIR__ . '/includes/header.php';

// Vídeo real de produção. Se existir assets/video/producao.mp4 ele vira o fundo da hero;
// caso contrário cai no slideshow com fotos reais das peças.
$videoProducao = __DIR__ . '/assets/video/producao.mp4';
$temVideoProducao = file_exists($videoProducao);

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

<!-- SOBRE: logo abaixo do vídeo de abertura -->
<?php require __DIR__ . '/includes/sobre_home.php'; ?>

<?php require __DIR__ . '/includes/promo_bt21.php'; ?>
<?php require __DIR__ . '/includes/promo-personagens.php'; ?>

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