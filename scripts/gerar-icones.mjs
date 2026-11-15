// Extrai os SVGs dos templates PHP (migração) e gera src/icones.ts com o conteúdo idêntico.
import fs from "node:fs";
const raiz = process.argv[2];
const arquivos = ["includes/footer.php","includes/form_login.php","includes/form_cadastro.php","includes/login_arte.php","conta.php","contato.php","login.php","includes/avaliar_atendimento.php"];
const todos = [];
for (const f of arquivos) {
  const t = fs.readFileSync(`${raiz}/${f}`, "utf8").replace(/\r/g, "");
  for (const m of t.matchAll(/<svg[\s\S]*?<\/svg>/g)) todos.push(m[0]);
}
const nomes = {
  1:"casa",2:"carrinho",3:"conversa",4:"instagram",5:"youtube",6:"whatsapp",7:"mastercard",8:"pix",9:"boleto",10:"caminhao",11:"raio",12:"pino",13:"escudo",14:"cadeado",
  15:"usuario",16:"cadeadoCampo",17:"olhoAberto",18:"olhoFechado",19:"marca",20:"entrar",
  21:"usuarioAlt",22:"usuario2",23:"cadeadoCampo2",24:"olhoAberto",25:"olhoFechado",26:"cadeadoCampo2",27:"olhoAberto",28:"olhoFechado",29:"entrar",
  30:"cubo",31:"escudoArte",32:"raioArte",
  33:"contaNome",34:"contaEmail",35:"contaSenha",36:"contaData",
  38:"voltar",39:"email",40:"cadeadoNovo",41:"cadeadoNovo",42:"estrela",
};
const saida = {};
todos.forEach((svg, i) => {
  const nome = nomes[i + 1];
  if (!nome || saida[nome]) return;
  const abre = svg.match(/^<svg([^>]*)>/);
  const inner = svg.slice(abre[0].length, -"</svg>".length);
  const attrs = {};
  for (const a of abre[1].matchAll(/([a-zA-Z-:]+)="([^"]*)"/g)) {
    let k = a[1];
    if (k === "class") continue; // a classe é passada por quem usa (on/off)
    if (k.startsWith("aria-")) { attrs[k] = a[2]; continue; }
    k = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    attrs[k] = a[2];
  }
  saida[nome] = { attrs, inner };
});
// o ícone de pix do rodapé está dentro de .pay-pix e o mastercard tem classe própria: ver Rodape.tsx
const ts = `// GERADO por scripts/gerar-icones.mjs a partir dos SVGs do site PHP. Conteúdo estático e confiável.\n` +
  `export interface DadosIcone { attrs: Record<string, string>; inner: string }\n` +
  `export const ICONES: Record<string, DadosIcone> = ${JSON.stringify(saida, null, 2)};\n` +
  `export type NomeIcone = ${Object.keys(saida).map((n) => JSON.stringify(n)).join(" | ")};\n`;
fs.writeFileSync("src/icones.ts", ts);
console.log(Object.keys(saida).length, "ícones");
