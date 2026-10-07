import type { APIRoute } from "astro";
import fs from "node:fs";
import path from "node:path";

const CAMPOS = new Set([
  "cidade",
  "dataBarra",
  "dataShow",
  "casa",
  "endereco",
  "vendidos",
  "lugares",
  "produtora",
  "whatsapp",
  "razaoSocial",
  "cnpj",
]);

const NUMERICOS = new Set(["vendidos", "lugares"]);

function escapar(valor: string) {
  return valor.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function semTags(origem: string) {
  let limpo = "";
  const mapa: number[] = [];
  for (let i = 0; i < origem.length; i++) {
    if (origem[i] === "<") {
      const fim = origem.indexOf(">", i);
      if (fim === -1) break;
      i = fim;
      continue;
    }
    mapa.push(i);
    limpo += origem[i];
  }
  return { limpo, mapa };
}

function trocarTexto(origem: string, de: string, para: string) {
  const palavras = de.trim().split(/\s+/).filter(Boolean);
  if (!palavras.length) return { origem, vezes: 0 };
  const miolo = palavras.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\s+");
  const busca = new RegExp(`(?<![\\p{L}\\p{N}])${miolo}(?![\\p{L}\\p{N}])`, "gu");
  const { limpo, mapa } = semTags(origem);
  const achados = [...limpo.matchAll(busca)];
  if (!achados.length) return { origem, vezes: 0 };

  let resultado = origem;
  for (const achado of achados.reverse()) {
    const inicio = mapa[achado.index ?? 0];
    const fim = mapa[(achado.index ?? 0) + achado[0].length - 1] + 1;
    resultado = resultado.slice(0, inicio) + para + resultado.slice(fim);
  }
  return { origem: resultado, vezes: achados.length };
}

export const POST: APIRoute = async ({ request }) => {
  if (!import.meta.env.DEV) {
    return Response.json({ ok: false, erro: "Só funciona com a página rodando no seu computador." }, { status: 403 });
  }

  let corpo: {
    textos?: { de?: string; para?: string }[];
    campos?: { campo?: string; para?: string }[];
  };
  try {
    corpo = (await request.json()) as typeof corpo;
  } catch {
    return Response.json({ ok: false, erro: "Não entendi o que salvar." }, { status: 400 });
  }

  const arquivo = path.join(process.cwd(), "src", "pages", "index.astro");
  let origem: string;
  try {
    origem = fs.readFileSync(arquivo, "utf8");
  } catch {
    return Response.json({ ok: false, erro: "Não achei o arquivo da página." }, { status: 500 });
  }
  const antes = origem;
  const falhas: string[] = [];

  for (const item of corpo.campos ?? []) {
    const campo = item.campo ?? "";
    const para = (item.para ?? "").trim();
    if (!CAMPOS.has(campo) || !para || /[<>]/.test(para)) {
      falhas.push(campo || "campo");
      continue;
    }
    const valor = NUMERICOS.has(campo) && /^\d+$/.test(para) ? para : `"${escapar(para)}"`;
    const linha = new RegExp(`(${campo}:\\s*)(?:"(?:\\\\.|[^"\\\\])*"|\\d+)`);
    if (!linha.test(origem)) {
      falhas.push(para);
      continue;
    }
    origem = origem.replace(linha, `$1${valor.replace(/\$/g, "$$$$")}`);
  }

  for (const item of corpo.textos ?? []) {
    const de = (item.de ?? "").trim();
    const para = (item.para ?? "").trim();
    if (!de || !para || de === para || /[<>]/.test(para)) {
      falhas.push(de || "texto");
      continue;
    }
    const troca = trocarTexto(origem, de, para);
    if (!troca.vezes) {
      falhas.push(de);
      continue;
    }
    origem = troca.origem;
  }

  const gravou = origem !== antes;
  if (!gravou) {
    return Response.json(
      { ok: false, gravou: false, erro: "Uma parte não foi salva.", falhas },
      { status: 400 },
    );
  }

  try {
    fs.writeFileSync(arquivo, origem);
  } catch {
    return Response.json({ ok: false, gravou: false, erro: "Não consegui gravar o arquivo da página." }, { status: 500 });
  }

  return Response.json({ ok: falhas.length === 0, gravou: true, falhas });
};
