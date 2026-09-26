import { AdminController } from "./controllers/AdminController";
import { AuthController } from "./controllers/AuthController";
import { CategoriaController } from "./controllers/CategoriaController";
import { MaquinaController } from "./controllers/MaquinaController";
import { PedidoController } from "./controllers/PedidoController";
import { ProdutoController } from "./controllers/ProdutoController";
import { UsuarioController } from "./controllers/UsuarioController";
import { AdminRepository } from "./repositories/AdminRepository";
import { CategoriaRepository } from "./repositories/CategoriaRepository";
import { MaquinaRepository } from "./repositories/MaquinaRepository";
import { PedidoRepository } from "./repositories/PedidoRepository";
import { ProdutoRepository } from "./repositories/ProdutoRepository";
import { UsuarioRepository } from "./repositories/UsuarioRepository";
import { AdminPolicy } from "./services/AdminPolicy";
import { AdminService } from "./services/AdminService";
import { AuthService } from "./services/AuthService";
import { CategoriaService } from "./services/CategoriaService";
import { MaquinaService } from "./services/MaquinaService";
import { PasswordHasher } from "./services/PasswordHasher";
import { PedidoService } from "./services/PedidoService";
import { ProdutoService } from "./services/ProdutoService";
import { UsuarioService } from "./services/UsuarioService";

/** Raiz de composição: cria repositórios → serviços → controllers (injeção de dependência). */
const hasher = new PasswordHasher();
const adminPolicy = new AdminPolicy();

const usuarioRepository = new UsuarioRepository();
const categoriaRepository = new CategoriaRepository();
const produtoRepository = new ProdutoRepository();
const maquinaRepository = new MaquinaRepository();
const pedidoRepository = new PedidoRepository();

export const authController = new AuthController(new AuthService(usuarioRepository, hasher, adminPolicy));
const usuarioService = new UsuarioService(usuarioRepository, hasher, adminPolicy);

export const usuarioController = new UsuarioController(usuarioService);
export const adminController = new AdminController(new AdminService(new AdminRepository()));
export const categoriaController = new CategoriaController(new CategoriaService(categoriaRepository));
export const produtoController = new ProdutoController(new ProdutoService(produtoRepository));
export const maquinaController = new MaquinaController(new MaquinaService(maquinaRepository));
export const pedidoController = new PedidoController(new PedidoService(pedidoRepository, produtoRepository));
