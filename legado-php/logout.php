<?php
require_once __DIR__ . '/includes/funcoes.php';
unset($_SESSION['usuario']);
session_regenerate_id(true);
$_SESSION['flash'] = 'Você saiu da sua conta.';
header('Location: index.php');
exit;
