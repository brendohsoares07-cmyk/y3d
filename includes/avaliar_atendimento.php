<?php
// Pergunta de avaliação do atendimento, mostrada na tela de pedido concluído. Espera $pedidoId.
$pedidoId = (int) ($pedidoId ?? 0);
if ($pedidoId <= 0) {
    return;
}
?>
<section class="aval-atend" data-aval-caixa aria-labelledby="aval-titulo">
  <h2 id="aval-titulo">O nosso atendimento foi bom?</h2>
  <p class="aval-sub">Conte como foi a sua experiência: toque nas estrelas para avaliar.</p>
  <form method="post" action="handlers/avaliar_atendimento.php" data-aval-form novalidate>
    <input type="hidden" name="csrf" value="<?= e(y3d_csrf_token()) ?>">
    <input type="hidden" name="pedido" value="<?= $pedidoId ?>">
    <fieldset class="estrelas-input">
      <legend class="sr-only">Nota do atendimento, de 1 a 5 estrelas</legend>
      <?php foreach ([5 => 'Excelente', 4 => 'Muito bom', 3 => 'Bom', 2 => 'Regular', 1 => 'Ruim'] as $valor => $rotulo): ?>
        <input type="radio" name="nota" id="atend-<?= $valor ?>" value="<?= $valor ?>">
        <label for="atend-<?= $valor ?>" title="<?= e($rotulo) ?>">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.7l-5.9 3.1 1.2-6.5L2.5 9.7l6.6-.9z" stroke-linejoin="round"/></svg>
          <span class="sr-only"><?= $valor ?> estrela(s): <?= e($rotulo) ?></span>
        </label>
      <?php endforeach; ?>
    </fieldset>
    <p class="aval-frase" data-aval-texto aria-live="polite">Nenhuma estrela marcada ainda</p>
    <textarea name="comentario" rows="3" maxlength="600" placeholder="Quer contar mais? (opcional)" aria-label="Comentário sobre o atendimento"></textarea>
    <p class="aval-erro" data-aval-erro role="alert" hidden></p>
    <button type="submit" class="btn btn-grad">Enviar avaliação</button>
  </form>
</section>
