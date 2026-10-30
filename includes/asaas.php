<?php
declare(strict_types=1);

require_once __DIR__ . '/loja_dados.php';

function y3d_asaas_configuracao_erro(): ?string
{
    if (trim((string) getenv('Y3D_ASAAS_API_KEY')) === '') {
        return 'O Pix ainda não está configurado. Preencha Y3D_ASAAS_API_KEY no arquivo .env do site.';
    }
    if (trim((string) getenv('Y3D_ASAAS_WEBHOOK_TOKEN')) === '') {
        return 'A confirmação automática do Pix ainda não está configurada. Preencha Y3D_ASAAS_WEBHOOK_TOKEN no arquivo .env do site.';
    }

    $base = rtrim(trim((string) (getenv('Y3D_ASAAS_API_URL') ?: 'https://api-sandbox.asaas.com/v3')), '/');
    $partes = parse_url($base);
    if (
        $partes === false
        || ($partes['scheme'] ?? '') !== 'https'
        || !in_array($partes['host'] ?? '', ['api.asaas.com', 'api-sandbox.asaas.com'], true)
        || ($partes['path'] ?? '') !== '/v3'
        || isset($partes['user'])
        || isset($partes['pass'])
        || isset($partes['query'])
        || isset($partes['fragment'])
    ) {
        return 'A URL da API do Asaas está inválida. Confira a configuração do ambiente.';
    }
    if (!function_exists('curl_init')) {
        return 'O servidor está sem suporte a cURL, necessário para gerar a cobrança Pix.';
    }

    return null;
}

function y3d_asaas_requisicao(string $metodo, string $caminho, ?array $dados = null): ?array
{
    $chave = trim((string) getenv('Y3D_ASAAS_API_KEY'));
    $base = rtrim(trim((string) (getenv('Y3D_ASAAS_API_URL') ?: 'https://api-sandbox.asaas.com/v3')), '/');
    $partes = parse_url($base);
    $erroConfiguracao = y3d_asaas_configuracao_erro();
    if ($erroConfiguracao !== null) {
        error_log('Asaas: ' . $erroConfiguracao);
        return null;
    }

    $curl = curl_init($base . $caminho);
    if ($curl === false) {
        error_log('Asaas: não foi possível iniciar a requisição HTTP.');
        return null;
    }

    $opcoes = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $metodo,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_HTTPHEADER => [
            'Accept: application/json',
            'Content-Type: application/json',
            'access_token: ' . $chave,
        ],
    ];
    if ($dados !== null) {
        $json = json_encode($dados, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        if ($json === false) {
            curl_close($curl);
            error_log('Asaas: não foi possível serializar os dados da requisição.');
            return null;
        }
        $opcoes[CURLOPT_POSTFIELDS] = $json;
    }
    curl_setopt_array($curl, $opcoes);
    $resposta = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    $erroCurl = curl_errno($curl);
    curl_close($curl);

    if ($resposta === false) {
        error_log('Asaas: falha de comunicação com a API (cURL ' . $erroCurl . ').');
        return null;
    }
    if ($status < 200 || $status >= 300) {
        error_log('Asaas: a API retornou HTTP ' . $status . '.');
        return null;
    }

    $resultado = json_decode($resposta, true);
    if (!is_array($resultado)) {
        error_log('Asaas: a API retornou uma resposta JSON inválida.');
        return null;
    }
    return $resultado;
}

function y3d_asaas_cliente_id(string $nome, string $cpf, string $telefone, string $email, int $pedidoId): ?string
{
    $cpf = preg_replace('/\D+/', '', $cpf) ?? '';
    $telefone = preg_replace('/\D+/', '', $telefone) ?? '';
    $consulta = y3d_asaas_requisicao(
        'GET',
        '/customers?cpfCnpj=' . rawurlencode($cpf) . '&limit=1'
    );
    if ($consulta === null || !isset($consulta['data']) || !is_array($consulta['data'])) {
        error_log('Asaas: não foi possível consultar o cliente.');
        return null;
    }
    if (isset($consulta['data'][0]['id']) && is_string($consulta['data'][0]['id'])) {
        return $consulta['data'][0]['id'];
    }

    $cliente = [
        'name' => $nome,
        'cpfCnpj' => $cpf,
        'mobilePhone' => $telefone,
        'externalReference' => 'y3d-order-' . $pedidoId,
    ];
    if ($email !== '') {
        $cliente['email'] = $email;
    }
    $criado = y3d_asaas_requisicao('POST', '/customers', $cliente);
    if ($criado === null || !isset($criado['id']) || !is_string($criado['id'])) {
        error_log('Asaas: não foi possível criar o cliente.');
        return null;
    }
    return $criado['id'];
}

function y3d_asaas_criar_pix(int $pedidoId, array $pedido): ?array
{
    $referencia = 'y3d-order-' . $pedidoId;
    $clienteId = y3d_asaas_cliente_id(
        (string) ($pedido['nome'] ?? ''),
        (string) ($pedido['cpf'] ?? ''),
        (string) ($pedido['telefone'] ?? ''),
        (string) ($pedido['email'] ?? ''),
        $pedidoId
    );
    if ($clienteId === null) {
        return null;
    }

    $consulta = y3d_asaas_requisicao(
        'GET',
        '/payments?externalReference=' . rawurlencode($referencia) . '&limit=1'
    );
    if ($consulta === null || !isset($consulta['data']) || !is_array($consulta['data'])) {
        error_log('Asaas: não foi possível consultar a cobrança do pedido.');
        return null;
    }
    $paymentId = $consulta['data'][0]['id'] ?? null;
    if (!is_string($paymentId) || $paymentId === '') {
        $valor = round((float) ($pedido['total'] ?? 0), 2);
        if ($valor <= 0) {
            error_log('Asaas: valor do pedido inválido.');
            return null;
        }
        $cobranca = y3d_asaas_requisicao('POST', '/payments', [
            'customer' => $clienteId,
            'billingType' => 'PIX',
            'value' => $valor,
            'dueDate' => date('Y-m-d'),
            'description' => 'Pedido Y3D #' . $pedidoId,
            'externalReference' => $referencia,
            'notificationDisabled' => true,
        ]);
        if ($cobranca === null || !isset($cobranca['id']) || !is_string($cobranca['id'])) {
            error_log('Asaas: não foi possível criar a cobrança Pix.');
            return null;
        }
        $paymentId = $cobranca['id'];
    }

    $qr = y3d_asaas_requisicao('GET', '/payments/' . rawurlencode($paymentId) . '/pixQrCode');
    $imagem = $qr['encodedImage'] ?? null;
    $payload = $qr['payload'] ?? null;
    if (
        !is_string($imagem)
        || base64_decode($imagem, true) === false
        || !is_string($payload)
        || $payload === ''
    ) {
        error_log('Asaas: a API não retornou um QR Code Pix válido.');
        return null;
    }

    return [
        'payment_id' => $paymentId,
        'imagem' => $imagem,
        'payload' => $payload,
    ];
}
