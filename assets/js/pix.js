"use strict";
(() => {
    const bloco = document.querySelector('[data-pix-valor]');
    if (!bloco)
        return;
    const urlStatus = bloco.dataset.pixStatusUrl;
    const status = bloco.querySelector('[data-pix-status]');
    const pendente = bloco.querySelector('[data-pix-pendente]');
    const pago = bloco.querySelector('[data-pix-pago]');
    const erro = bloco.querySelector('[data-pix-erro]');
    const campo = bloco.querySelector('[data-pix-codigo]');
    const botao = bloco.querySelector('[data-pix-copiar]');
    const statusCopia = bloco.querySelector('[data-pix-copia-status]');
    if (!urlStatus || !status || !pendente || !pago)
        return;
    if (botao && campo && statusCopia) {
        botao.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(campo.value);
                statusCopia.textContent = 'Código Pix copiado.';
            }
            catch {
                campo.focus();
                campo.select();
                if (document.execCommand('copy')) {
                    statusCopia.textContent = 'Código Pix copiado.';
                }
                else {
                    statusCopia.textContent = 'Não foi possível copiar. Selecione e copie o código manualmente.';
                }
            }
        });
    }
    if (bloco.dataset.pixPagoInicial === 'true')
        return;
    const consultarStatus = async () => {
        try {
            const respostaHttp = await fetch(urlStatus, {
                cache: 'no-store',
                credentials: 'same-origin',
                headers: { Accept: 'application/json' },
            });
            if (!respostaHttp.ok) {
                throw new Error(`Consulta de pagamento retornou HTTP ${respostaHttp.status}.`);
            }
            const resposta = await respostaHttp.json();
            if (typeof resposta !== 'object' || resposta === null || !('status' in resposta)) {
                throw new Error('Resposta de status de pagamento inválida.');
            }
            if (resposta.status === 'pago') {
                status.textContent = 'Pagamento concluído!';
                pendente.hidden = true;
                pago.hidden = false;
                if (erro)
                    erro.hidden = true;
                return;
            }
            if (resposta.status === 'cancelado') {
                status.textContent = 'Cobrança Pix cancelada.';
                pendente.hidden = true;
                if (erro) {
                    erro.textContent = 'Entre em contato com a loja para receber ajuda com este pedido.';
                    erro.hidden = false;
                }
                return;
            }
            if (erro)
                erro.hidden = true;
        }
        catch (falha) {
            if (erro) {
                erro.textContent = 'Não foi possível consultar a confirmação agora. Vamos tentar novamente.';
                erro.hidden = false;
            }
            console.error('Falha ao consultar confirmação do Pix.', falha);
        }
        window.setTimeout(() => {
            void consultarStatus();
        }, 4000);
    };
    void consultarStatus();
})();
