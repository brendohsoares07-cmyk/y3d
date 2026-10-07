import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AddressForm, AddressValues } from "../../components/store/AddressForm";
import { OrderSummary } from "../../components/store/OrderSummary";
import { PaymentOptions } from "../../components/store/PaymentOptions";
import { Alert } from "../../components/ui/Alert";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useFormState } from "../../hooks/useFormState";
import { ApiError } from "../../services/http";
import { pedidosApi } from "../../services/resources";
import { FormaPagamento } from "../../types";
import { collectErrors, requiredMsg } from "../../utils/validators";

function validar(v: AddressValues) {
  const telefone = v.telefone.replace(/\D/g, "");
  const cep = v.cep.replace(/\D/g, "");
  return collectErrors<AddressValues>([
    ["nome", requiredMsg(v.nome, "Nome completo")],
    ["telefone", requiredMsg(v.telefone, "Telefone") ?? (telefone.length >= 10 ? null : "Telefone inválido")],
    ["cep", requiredMsg(v.cep, "CEP") ?? (cep.length === 8 ? null : "CEP inválido")],
    ["endereco", requiredMsg(v.endereco, "Endereço")],
    ["bairro", requiredMsg(v.bairro, "Bairro")],
    ["cidade", requiredMsg(v.cidade, "Cidade")],
  ]);
}

/** Finalizar compra: endereço, pagamento e revisão do pedido. */
export function CheckoutPage() {
  const { usuario } = useAuth();
  const { itens, subtotal, alterarQuantidade, remover, limpar } = useCart();
  const navigate = useNavigate();
  const { values, errors, setErrors, setField } = useFormState<AddressValues>({
    nome: usuario?.nome ?? "", telefone: "", cep: "", endereco: "", bairro: "", cidade: "",
  });
  const [pagamento, setPagamento] = useState<FormaPagamento>("PIX");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (itens.length === 0) {
    return (
      <div className="panel empty-cart">
        <h1>Seu carrinho está vazio</h1>
        <p className="muted">Escolha um produto para começar.</p>
        <Link to="/loja/produtos" className="btn btn-primary">Ver produtos</Link>
      </div>
    );
  }

  const finalizar = async (event: FormEvent) => {
    event.preventDefault();
    const encontrados = validar(values);
    setErrors(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    setEnviando(true);
    setErro(null);
    try {
      const pedido = await pedidosApi.create({
        itens: itens.map((i) => ({ produtoId: i.produtoId, quantidade: i.quantidade, personalizacao: i.personalizacao })),
        formaPagamento: pagamento,
        entrega: { ...values },
      });
      limpar();
      navigate("/loja/conta", { state: { mensagem: `Pedido #${pedido.id} realizado com sucesso!` } });
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Não foi possível finalizar o pedido.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <h1>Finalizar compra</h1>
      {erro && <Alert>{erro}</Alert>}
      <form className="checkout-grid" onSubmit={finalizar} noValidate>
        <section className="panel">
          <h2><span className="step">1</span> Endereço de entrega</h2>
          <AddressForm values={values} errors={errors} onChange={setField} />
          <PaymentOptions valor={pagamento} onChange={setPagamento} />
        </section>
        <section className="panel">
          <h2><span className="step">2</span> Revisão do pedido</h2>
          <OrderSummary itens={itens} subtotal={subtotal} enviando={enviando} onQuantidade={alterarQuantidade} onRemover={remover} />
        </section>
      </form>
    </>
  );
}
