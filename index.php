<?php
$tituloPagina = 'Início';
require_once __DIR__ . '/includes/dados_produtos.php';
require_once __DIR__ . '/includes/header.php';

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

<?php require __DIR__ . '/includes/promo_bt21.php'; ?>

<?php require __DIR__ . '/includes/marca.php'; ?>

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
