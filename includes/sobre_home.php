<?php
// Seção "Sobre a Y3D" da página inicial (logo abaixo do vídeo): apresentação, como funciona e diferenciais.
// Imagens: usa fotos e ilustrações que já existem em assets/img (nada externo).
$passos = [
    ['Escolha seu modelo 3D', 'Navegue pelo nosso catálogo e encontre o objeto que deseja produzir. Você pode visualizar o modelo digital e conhecer seus detalhes antes de fazer o pedido.'],
    ['Faça seu pedido pelo site', 'Depois de escolher o modelo, solicite a impressão diretamente pela plataforma, selecionando as opções disponíveis para o produto.'],
    ['Transformamos o modelo em realidade', 'Nossa equipe utiliza impressoras 3D para fabricar o objeto escolhido, construindo a peça camada por camada, de acordo com o projeto digital.'],
    ['Seu projeto ganha forma', 'O que antes era apenas uma imagem na tela se transforma em um produto físico, pronto para ser utilizado, exposto ou fazer parte de um novo projeto.'],
];
$diferenciais = [
    ['Mais criatividade',  '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.9.7 1.5 1.6 1.5 2.6V17h4v-.5c0-1 .6-1.9 1.5-2.6A6 6 0 0 0 12 3z"/>'],
    ['Personalização',     '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.6-3.6 3.4-5.5 7-5.5s6.4 1.9 7 5.5z"/>'],
    ['Tecnologia de ponta','<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>'],
    ['Sustentabilidade',   '<path d="M20 4C10 4 5 9 5 15c0 2 .8 3.6 2 5 1.4 1.2 3 2 5 2 6 0 8-8 8-18z"/><path d="M5 20c3-5 6-8 11-11"/>'],
];
?>
<section class="sec sobre-home" id="sobre">

  <!-- 1) Apresentação -->
  <div class="sh-intro">
    <div class="sh-intro-copy">
      <span class="sh-eyebrow">SOBRE A</span>
      <img class="sh-logo" src="assets/img/logo-y3d-transparente.png" alt="Y3D Creations">
      <h2 class="sh-title">Da sua ideia para<br><span class="grad">o mundo real.</span></h2>
      <p>A Y3D nasceu para transformar ideias digitais em objetos reais por meio da tecnologia de impressão 3D. Nosso objetivo é tornar essa tecnologia mais acessível, prática e inovadora, oferecendo uma experiência simples para quem deseja criar produtos personalizados.</p>
      <p>Em nosso site, você pode explorar um catálogo de modelos 3D, visualizar imagens e escolher o projeto que mais combina com sua ideia. Cada modelo funciona como um rascunho digital, mostrando como o produto ficará antes de ser produzido.</p>
    </div>
    <div class="sh-intro-art" aria-hidden="true">
      <div class="sh-monitor">
        <div class="sh-monitor-screen"><img src="assets/img/produtos/dragao-artistico.jpg" alt="" loading="lazy"></div>
        <div class="sh-monitor-stand"></div>
      </div>
      <img class="sh-printer" src="assets/img/maquinas/impressora-fechada.svg" alt="" loading="lazy">
      <p class="sh-quote">O que hoje é um modelo digital, amanhã pode ser parte da sua realidade.</p>
    </div>
  </div>

  <!-- 2) Como funciona -->
  <div class="sh-steps-wrap">
    <span class="sh-eyebrow">COMO FUNCIONA?</span>
    <h3 class="sh-h3">É simples, rápido e <span class="grad">direto.</span></h3>
    <ol class="sh-steps">
      <?php foreach ($passos as $i => [$titulo, $texto]): ?>
        <li class="sh-step">
          <div class="sh-step-img sh-step-img-<?= $i + 1 ?>">
            <?php if ($i === 0): ?>
              <img src="assets/img/produtos/dragao-artistico.jpg" alt="" loading="lazy" style="filter:grayscale(1) contrast(1.05) brightness(.95)">
            <?php elseif ($i === 1): ?>
              <div class="sh-mock">
                <img src="assets/img/produtos/dragao-artistico.jpg" alt="" loading="lazy" style="filter:grayscale(1)">
                <div class="sh-mock-lines"><i></i><i></i><i></i><span>Comprar</span></div>
              </div>
            <?php elseif ($i === 2): ?>
              <img src="assets/img/maquinas/impressora-fdm.svg" alt="" loading="lazy">
            <?php else: ?>
              <img src="assets/img/produtos/dragao-artistico.jpg" alt="" loading="lazy">
            <?php endif; ?>
            <b class="sh-num"><?= $i + 1 ?></b>
          </div>
          <h4><?= htmlspecialchars($titulo) ?></h4>
          <p><?= htmlspecialchars($texto) ?></p>
        </li>
      <?php endforeach; ?>
    </ol>
  </div>

  <!-- 3) Tecnologia que transforma ideias -->
  <div class="sh-tech">
    <div class="sh-tech-main">
      <div class="sh-tech-title">
        <span class="sh-eyebrow">TECNOLOGIA QUE</span>
        <h3>transforma <span class="grad">ideias.</span></h3>
      </div>
      <p>Na <b>Y3D</b>, acreditamos que a impressão 3D vai além de fabricar objetos: ela abre portas para a <b>criatividade</b>, a personalização e novas possibilidades. Unimos inovação e praticidade para aproximar você do futuro da fabricação digital.</p>
      <div class="sh-tech-brand">
        <img src="assets/img/logo-y3d-transparente.png" alt="Y3D Creations">
        <span>Imagine, escolha<br>e transforme.</span>
      </div>
    </div>
    <ul class="sh-feats">
      <?php foreach ($diferenciais as [$nome, $icone]): ?>
        <li>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><?= $icone ?></svg>
          <span><?= htmlspecialchars($nome) ?></span>
        </li>
      <?php endforeach; ?>
    </ul>
  </div>
</section>
