<?php
$tituloPagina = 'Sobre';
require_once __DIR__ . '/includes/header.php';
?>

<div class="card-panel">
  <div class="grid g2" style="align-items:center">
    <div>
      <h1 style="font-size:clamp(24px,3vw,34px);margin:0 0 14px">Sobre a <span class="grad" style="background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent">Y3D</span></h1>
      <p style="color:var(--mute)">Somos uma plataforma criada para conectar criadores, artistas e entusiastas do mundo 3D. Aqui você encontra modelos exclusivos, de alta qualidade e com suporte completo — do arquivo digital até a impressão em suas mãos.</p>
      <a href="produtos.php" class="btn btn-grad" style="margin-top:16px">Explorar loja →</a>
    </div>
    <div class="promo" style="align-items:center;text-align:center">
      <div class="promo-art" style="margin:0"><img src="assets/img/logo-y3d-creations.jpg" alt="Logo Y3D Creations"></div>
      <div class="grid g3" style="text-align:center">
        <div><b style="font-size:20px">+10k</b><br><span style="color:var(--mute);font-size:12px">Modelos disponíveis</span></div>
        <div><b style="font-size:20px">+5k</b><br><span style="color:var(--mute);font-size:12px">Clientes satisfeitos</span></div>
        <div><b style="font-size:20px">99%</b><br><span style="color:var(--mute);font-size:12px">Avaliação positiva</span></div>
      </div>
    </div>
  </div>
</div>

<div class="sec grid g3">
  <div class="card-panel"><h3 style="margin:0 0 8px">🎨 Modelagem</h3><p style="color:var(--mute);font-size:14px">Cada peça nasce de um modelo 3D cuidadosamente criado por nossa equipe de artistas.</p></div>
  <div class="card-panel"><h3 style="margin:0 0 8px">🖨️ Impressão</h3><p style="color:var(--mute);font-size:14px">Também oferecemos impressão 3D sob encomenda, com diversos materiais e cores.</p></div>
  <div class="card-panel"><h3 style="margin:0 0 8px">📦 Entrega</h3><p style="color:var(--mute);font-size:14px">Modelos digitais com download imediato; peças físicas embaladas com cuidado.</p></div>
</div>

<?php require __DIR__ . '/includes/marca.php'; ?>
<?php require __DIR__ . '/includes/maquinas.php'; ?>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
