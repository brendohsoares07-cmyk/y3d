import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { HeartIcon } from "./Icons";

/** Mostrado quando um visitante sem login tenta favoritar um produto: leva para login ou cadastro
 *  e volta para a página atual (`returnTo`) depois de autenticar. */
export function AuthRequiredModal({ returnTo, onClose }: { returnTo: string; onClose: () => void }) {
  const navigate = useNavigate();

  const ir = (destino: string) => navigate(`${destino}?returnTo=${encodeURIComponent(returnTo)}`);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="auth-modal-titulo" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Fechar">×</button>
        <span className="modal-icon"><HeartIcon size={26} filled /></span>
        <h3 id="auth-modal-titulo">Entre para favoritar</h3>
        <p className="muted">Crie uma conta ou faça login para guardar este produto nos seus favoritos.</p>
        <div className="modal-actions">
          <Button className="btn-wide" onClick={() => ir("/login")}>Entrar</Button>
          <Button variant="outline" className="btn-wide" onClick={() => ir("/cadastro")}>Criar conta</Button>
        </div>
      </div>
    </div>
  );
}
