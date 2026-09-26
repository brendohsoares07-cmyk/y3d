</main>
<?php
// Categorias (vindas de dados_produtos.php) e fotos reais dos produtos para a galeria do rodapé
$ftrCategorias = array_slice($CATEGORIAS ?? [], 0, 6, true);
$ftrFotos = [
    ['assets/img/produtos/estatua-harry-potter.png', 'Estátua Harry Potter'],
    ['assets/img/produtos/varinha-magica.png',       'Varinha mágica'],
    ['assets/img/catalogo/foto-so/miniaturas-personagens.png', 'Miniaturas e personagens'],
    ['assets/img/produtos/quadro-flamengo.png',      'Quadro Flamengo'],
    ['assets/img/produtos/army-patches.png',         'Patches Army'],
    ['assets/img/catalogo/foto-so/suportes-controles.png', 'Suportes para controles'],
];
?>
<footer class="ftr">
  <div class="wrap">

    <section class="ftr-cta">
      <div>
        <h3>Tem uma ideia? A gente <span>transforma em 3D.</span></h3>
        <p>Peças personalizadas, miniaturas, brindes e muito mais. Peça seu orçamento sem compromisso.</p>
      </div>
      <a href="contato.php" class="btn btn-grad">Pedir orçamento</a>
    </section>

    <div class="ftr-main">
      <div class="ftr-brand">
        <a href="index.php" class="logo"><img src="assets/img/logo-icon.svg" class="logo-ic" alt=""><span class="y3d">Y3D</span><small>CREATIONS</small></a>
        <p>Mais que modelos, realizamos ideias.</p>
        <div class="ftr-social">
          <a href="<?= htmlspecialchars(INSTAGRAM_URL) ?>" title="Instagram" aria-label="Instagram da Y3D Creations" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor"/></svg></a>
          <a href="#" title="TikTok" aria-label="TikTok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.4 2.6 2.1 4.2 5 4.4"/></svg></a>
          <a href="#" title="YouTube" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10.2 9.4v5.2l4.4-2.6z" fill="currentColor"/></svg></a>
          <a href="#" title="Discord" aria-label="Discord"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4.5H4A1.5 1.5 0 0 0 2.5 6v10A1.5 1.5 0 0 0 4 17.5h3V21l4-3.5h9a1.5 1.5 0 0 0 1.5-1.5V6A1.5 1.5 0 0 0 20 4.5z"/><circle cx="8.5" cy="11" r=".9" fill="currentColor"/><circle cx="12" cy="11" r=".9" fill="currentColor"/><circle cx="15.5" cy="11" r=".9" fill="currentColor"/></svg></a>
        </div>
      </div>

      <nav class="ftr-col" aria-label="Navegação">
        <h4>Navegação</h4>
        <div class="ftr-nav">
          <a href="index.php">Início</a>
          <a href="produtos.php">Produtos</a>
          <a href="produtos.php?categoria=personagens">Modelos 3D</a>
          <a href="sobre.php">Sobre</a>
          <a href="contato.php">Contato</a>
        </div>
      </nav>

      <nav class="ftr-col" aria-label="Categorias">
        <h4>Categorias</h4>
        <div class="ftr-nav">
          <?php foreach ($ftrCategorias as $slug => $cat): ?>
            <a href="produtos.php?categoria=<?= htmlspecialchars($slug) ?>"><?= htmlspecialchars($cat['nome']) ?></a>
          <?php endforeach; ?>
        </div>
      </nav>

      <div class="ftr-col">
        <h4>Atendimento</h4>
        <div class="ftr-contact">
          <a href="mailto:suporte@y3dcreations.com" class="c-mail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7.5l8 6 8-6"/></svg>suporte@y3dcreations.com</a>
          <a href="tel:+5511987654321" class="c-tel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 5.3 5.3l1.4-2.2L19 14.5V18a2 2 0 0 1-2 2A14 14 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>(11) 98765-4321</a>
        </div>
      </div>

      <div class="ftr-col ftr-gallery-col">
        <h4>Nossas criações</h4>
        <div class="ftr-gallery">
          <?php foreach ($ftrFotos as [$src, $alt]): ?>
            <a href="produtos.php" title="<?= htmlspecialchars($alt) ?>"><img src="<?= $src ?>" alt="<?= htmlspecialchars($alt) ?>" loading="lazy"></a>
          <?php endforeach; ?>
        </div>
      </div>
    </div>

    <div class="ftr-bottom">
      <span>© 2026 Y3D Creations. Todos os direitos reservados.</span>
      <div class="ftr-pay">
        <em>Formas de pagamento:</em>
        <strong>Pix</strong><strong>Visa</strong><strong>Mastercard</strong><strong>Elo</strong>
      </div>
      <span>Modelos 3D para um mundo mais criativo.</span>
    </div>
  </div>
</footer>
<div id="toast" role="status" aria-live="polite"></div>
<script src="assets/js/main.js"></script>
</body>
</html>
