</main>
<?php
// Rodapé: navegação, formas de pagamento, entrega e compra segura.
?>
<footer class="ftr">
  <div class="wrap">
    <div class="ftr-main">
      <div class="ftr-brand">
        <a href="index.php" class="ftr-logo" aria-label="Y3D Creations — página inicial"><img src="frontend/public/logo-y3d.png" alt="Y3D Creations" loading="lazy"></a>
        <p>Transformando ideias em realidade com tecnologia, inovação e qualidade. Sua loja de produtos e soluções em impressão 3D.</p>
        <div class="ftr-social">
          <a href="<?= htmlspecialchars(INSTAGRAM_URL) ?>" title="Instagram" aria-label="Instagram da Y3D Creations" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor"/></svg></a>
          <a href="#" title="YouTube" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3z"/></svg></a>
          <a href="#" title="LinkedIn" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM2.5 9h3v12h-3zM9 9h2.9v1.7c.5-.9 1.7-2 3.6-2 3.4 0 4 2.2 4 5.100V21h-3v-6.300c0-1.500 0-3.200-2-3.200s-2.500 1.500-2.500 3.100V21H9z"/></svg></a>
          <span class="ftr-follow">Siga-nos</span>
        </div>
      </div>

      <nav class="ftr-col" aria-label="Navegação">
        <h4>Navegação</h4>
        <ul class="ftr-nav">
          <li><a href="index.php"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg></i>Início</a></li>
          <li><a href="produtos.php"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2.5l2 11h10l2-8H7"/><circle cx="9" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/></svg></i>Produtos</a></li>
          <li><a href="sobre.php"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21V10l5 3V9l5 3V6h3v6h5v9z"/><path d="M8 17h.01M12 17h.01M16 17h.01"/></svg></i>Sobre a Y3D</a></li>
          <li><a href="contato.php"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M9 12h.01M12 12h.01M15 12h.01"/></svg></i>Contato</a></li>
        </ul>
      </nav>

      <div class="ftr-col">
        <h4>Formas de Pagamento</h4>
        <p class="ftr-sub">Compre com total segurança.</p>
        <div class="ftr-pay">
          <span class="pay-visa">VISA</span>
          <svg class="pay-mc" viewBox="0 0 46 30" aria-label="Mastercard"><circle cx="16" cy="15" r="14" fill="#eb001b"/><circle cx="30" cy="15" r="14" fill="#f79e1b"/><path d="M23 3.6a14 14 0 0 1 0 22.800A14 14 0 0 1 23 3.600z" fill="#ff5f00"/></svg>
          <span class="pay-elo"><b>e</b>lo</span>
          <span class="pay-pix"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#32bcad" d="M12 2.5l4.100 4.100-1.900 1.900L12 6.300 9.800 8.500 7.900 6.600zM12 21.500l-4.100-4.100 1.900-1.900 2.200 2.200 2.200-2.200 1.900 1.900zM2.500 12l4.100-4.100 1.900 1.900L6.300 12l2.200 2.200-1.900 1.900zM21.500 12l-4.100 4.100-1.900-1.900 2.200-2.200-2.200-2.200 1.900-1.900z"/></svg>pix</span>
        </div>
        <div class="ftr-boleto">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="2.500" y="3.500" width="19" height="17" rx="3"/><path d="M6.500 7.500v9M9 7.500v9M11.500 7.500v9M14 7.500v9M16.500 7.500v9M18 7.500v9" stroke-linecap="round"/></svg>
          <span>Boleto bancário</span>
        </div>
      </div>

      <div class="ftr-col">
        <h4>Entrega</h4>
        <p class="ftr-sub">Enviamos para todo o Brasil.</p>
        <ul class="ftr-feat">
          <li><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 6h11v10H2z"/><path d="M13 9h5l3 3.5V16h-8"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg></i><span><b>Frete seguro</b>para todo o país</span></li>
          <li><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2L5 13.5h6L10 22l9-12h-6z"/></svg></i><span><b>Entrega expressa</b>(consulte regiões)</span></li>
          <li><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg></i><span><b>Rastreie seu pedido</b>em tempo real</span></li>
        </ul>
      </div>

      <div class="ftr-col">
        <h4>Compra Segura</h4>
        <p class="ftr-sub">Seus dados protegidos.</p>
        <ul class="ftr-feat">
          <li><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 4.6-3.2 7.9-8 9-4.8-1.1-8-4.4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg></i><span><b>Ambiente 100% seguro</b>com criptografia SSL</span></li>
          <li><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/><path d="M12 14.5v2"/></svg></i><span><b>Privacidade garantida</b>em todas as etapas</span></li>
        </ul>
      </div>
    </div>

    <div class="ftr-bottom">
      <span>© 2026 Y3D — Projeto acadêmico. Todos os direitos reservados.</span>
      <div class="ftr-end">
        <span>Impressão 3D é <b>o futuro.</b></span>
      </div>
    </div>
  </div>
</footer>
<div id="toast" role="status" aria-live="polite"></div>
<script src="assets/js/main.js"></script>
</body>
</html>
