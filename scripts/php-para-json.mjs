// Converte os arrays PHP de includes/dados_produtos.php em JSON (uso único, na migração).
import fs from "node:fs";
const src = fs.readFileSync(process.argv[2], "utf8").replace(/\r/g, "");
function extrair(nome) {
  const i = src.indexOf(`$${nome} = [`);
  const p = src.indexOf("[", i);
  let depth = 0, q = null, fim = p;
  for (let k = p; k < src.length; k++) {
    const c = src[k];
    if (q) { if (c === "\\") k++; else if (c === q) q = null; continue; }
    if (c === "'") q = c; else if (c === "[") depth++; else if (c === "]") { depth--; if (depth === 0) { fim = k; break; } }
  }
  return src.slice(p, fim + 1);
}
function parse(txt) {
  let i = 0;
  const ws = () => { while (i < txt.length && /[\s,]/.test(txt[i])) i++; };
  function valor() {
    ws();
    if (txt[i] === "[") return arr();
    if (txt[i] === "'") { i++; let s = ""; while (txt[i] !== "'") { if (txt[i] === "\\") i++; s += txt[i++]; } i++; return s; }
    const m = /^-?\d+(\.\d+)?/.exec(txt.slice(i));
    if (m) { i += m[0].length; return Number(m[0]); }
    throw new Error("token inesperado em " + txt.slice(i, i + 30));
  }
  function arr() {
    i++; const lista = []; const obj = {}; let assoc = false;
    for (;;) {
      ws(); if (txt[i] === "]") { i++; break; }
      const v = valor(); ws();
      if (txt.startsWith("=>", i)) { i += 2; assoc = true; obj[v] = valor(); } else lista.push(v);
    }
    return assoc ? obj : lista;
  }
  return valor();
}
const out = { categorias: parse(extrair("CATEGORIAS")), produtos: parse(extrair("PRODUTOS")) };
process.stdout.write(JSON.stringify(out, null, 2));
