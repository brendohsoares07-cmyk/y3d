<?php
// Bloco "Nossas máquinas": ilustrações das impressoras 3D (SVG em assets/img/maquinas)
$maquinas = [
    ['impressora-fdm.svg',      'Impressora FDM',           'Peças resistentes em PLA, PETG e ABS, ótimas para protótipos, suportes e decoração.'],
    ['impressora-fechada.svg',  'Impressora fechada CoreXY', 'Cabine fechada e movimento rápido, para acabamento limpo e materiais mais técnicos.'],
    ['impressora-resina.svg',   'Impressora de resina',      'Detalhes finos para miniaturas, personagens e estatuetas.'],
];
?>
<section class="sec">
  <div class="sec-h"><h2>Nossas máquinas</h2><a class="more" href="contato.php">Peça um orçamento →</a></div>
  <div class="grid g3">
    <?php foreach ($maquinas as [$arq, $nome, $desc]): ?>
      <article class="machine">
        <img src="assets/img/maquinas/<?= $arq ?>" alt="Ilustração: <?= htmlspecialchars($nome) ?>" loading="lazy">
        <div class="machine-body">
          <h3><?= htmlspecialchars($nome) ?></h3>
          <p><?= htmlspecialchars($desc) ?></p>
        </div>
      </article>
    <?php endforeach; ?>
  </div>
</section>
