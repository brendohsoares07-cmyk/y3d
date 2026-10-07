import { AdminController } from "./admin/AdminController";
import { AuthController } from "./auth/AuthController";
import { CategoriaController } from "./crud/categoria/CategoriaController";
import { MaquinaController } from "./crud/maquina/MaquinaController";
import { PedidoController } from "./crud/pedido/PedidoController";
import { ProdutoController } from "./crud/produto/ProdutoController";
import { UsuarioController } from "./users/UsuarioController";
import { AdminRepository } from "./admin/AdminRepository";
import { CategoriaRepository } from "./crud/categoria/CategoriaRepository";
import { MaquinaRepository } from "./crud/maquina/MaquinaRepository";
import { PedidoRepository } from "./crud/pedido/PedidoRepository";
import { ProdutoRepository } from "./crud/produto/ProdutoRepository";
import { UsuarioRepository } from "./users/UsuarioRepository";
import { AdminPolicy } from "./admin/AdminPolicy";
import { AdminService } from "./admin/AdminService";
import { AuthService } from "./auth/AuthService";
import { CategoriaService } from "./crud/categoria/CategoriaService";
import { MaquinaService } from "./crud/maquina/MaquinaService";
import { PasswordHasher } from "./auth/PasswordHasher";
import { PedidoService } from "./crud/pedido/PedidoService";
import { ProdutoService } from "./crud/produto/ProdutoService";
import { UsuarioService } from "./users/UsuarioService";

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
