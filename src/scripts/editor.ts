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

const SELECAO =
  "[data-campo], [data-edit], h1, h2, h3, p, li, a.btn, summary, blockquote, figcaption, .preco, .selo, .lote-nome, .continuacao, .desce, .kicker, .numero-grande";

function texto(el: HTMLElement) {
  const bruto = el.hasAttribute("data-campo") ? el.textContent || "" : el.innerText || "";
  return bruto.replace(/\s+/g, " ").trim();
}

function alvos() {
  return [...document.querySelectorAll<HTMLElement>(SELECAO)].filter((el) => {
    if (el.closest("#editor-barra") || el.id === "topbar-timer") return false;
    if (el.hasAttribute("data-campo")) return true;
    if (el.querySelector("[data-campo], " + SELECAO)) return false;
    return texto(el).length > 0;
  });
}

const ultimoCampo = new Map<string, string>();

function montarBarra() {
  document.querySelector("#editor-barra")?.remove();
  const barra = document.createElement("div");
  barra.id = "editor-barra";
  barra.innerHTML = `
    <p id="editor-ajuda">Clique em <strong>Editar textos</strong>. Depois clique na frase, digite e salve.</p>
    <button type="button" id="editor-celular">Ver celular</button>
    <button type="button" id="editor-ligar">Editar textos</button>
    <button type="button" id="editor-salvar" hidden>Salvar</button>
  `;
  document.body.append(barra);
  return barra;
}

function ligarEdicao(ativo: boolean) {
  document.body.classList.toggle("editando", ativo);
  const salvar = document.querySelector<HTMLButtonElement>("#editor-salvar");
  const ligar = document.querySelector<HTMLButtonElement>("#editor-ligar");
  const ajuda = document.querySelector("#editor-ajuda");
  if (salvar) salvar.hidden = !ativo;
  if (ligar) ligar.textContent = ativo ? "Cancelar" : "Editar textos";
  if (ajuda) {
    ajuda.textContent = ativo
      ? "Clique na frase com contorno dourado e digite. Quando terminar, clique em Salvar."
      : "Clique em Editar textos. Depois clique na frase, digite e salve.";
  }
  for (const el of alvos()) {
    if (ativo) {
      el.dataset.original = texto(el);
      el.contentEditable = "true";
      el.spellcheck = true;
    } else {
      el.contentEditable = "false";
      if (el.dataset.original != null) el.innerText = el.dataset.original;
    }
  }
}

function escolherCampo(campo: string, instancias: HTMLElement[]) {
  const digitado = ultimoCampo.get(campo);
  if (digitado != null) return digitado.trim();
  const mudou = instancias.filter((el) => texto(el) !== (el.dataset.original ?? ""));
  if (!mudou.length) return null;
  const original = (instancias[0].dataset.original ?? "").toLocaleLowerCase("pt-BR");
  const real = mudou.find((el) => texto(el).toLocaleLowerCase("pt-BR") !== original);
  return texto(real ?? mudou[mudou.length - 1]);
}

async function salvar() {
  const textos: { de: string; para: string }[] = [];
  const campos: { campo: string; para: string }[] = [];
  const grupos = new Map<string, HTMLElement[]>();

  for (const el of alvos()) {
    const campo = el.dataset.campo;
    if (campo && CAMPOS.has(campo)) {
      const lista = grupos.get(campo) ?? [];
      lista.push(el);
      grupos.set(campo, lista);
      continue;
    }
    const agora = texto(el);
    const antes = el.dataset.original ?? "";
    if (agora !== antes && antes) textos.push({ de: antes, para: agora });
  }

  for (const [campo, instancias] of grupos) {
    const para = escolherCampo(campo, instancias);
    const original = instancias[0].dataset.original ?? "";
    if (para == null || para === original) continue;
    if (!para) throw new Error("Tem um campo vazio. Escreva o texto e clique em Salvar de novo.");
    campos.push({ campo, para });
  }

  if (!textos.length && !campos.length) {
    const ajuda = document.querySelector("#editor-ajuda");
    if (ajuda) ajuda.textContent = "Nada mudou ainda. Clique numa frase e altere o texto.";
    return;
  }

  const resposta = await fetch("/api/salvar-copy", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ textos, campos }),
  });
  let corpo: { ok?: boolean; gravou?: boolean; falhas?: string[]; erro?: string } = {};
  try {
    corpo = (await resposta.json()) as typeof corpo;
  } catch {
    throw new Error("O servidor não respondeu. Clique em Salvar de novo.");
  }
  if (corpo.gravou) {
    sessionStorage.setItem("editor-salvo", corpo.falhas?.length ? "aviso" : "1");
    if (corpo.falhas?.length) sessionStorage.setItem("editor-aviso", corpo.falhas.join(" | "));
    location.reload();
    return;
  }
  if (!resposta.ok || !corpo.ok) {
    const falhas = corpo.falhas?.length ? ` Não consegui gravar: ${corpo.falhas.join(" | ")}` : "";
    throw new Error((corpo.erro || "Não salvou.") + falhas);
  }
  sessionStorage.setItem("editor-salvo", "1");
  location.reload();
}

function aplicarCelular(ativo: boolean) {
  document.body.classList.toggle("modo-celular", ativo);
  localStorage.setItem("modo-celular", ativo ? "1" : "0");
  const botao = document.querySelector("#editor-celular");
  if (botao) botao.textContent = ativo ? "Ver computador" : "Ver celular";
}

if (import.meta.env.DEV) {
  const barra = montarBarra();
  const celularGuardado = localStorage.getItem("modo-celular");
  aplicarCelular(celularGuardado === null ? true : celularGuardado === "1");
  barra.querySelector("#editor-celular")?.addEventListener("click", () => {
    aplicarCelular(!document.body.classList.contains("modo-celular"));
  });
  const aviso = sessionStorage.getItem("editor-aviso");
  const salvo = sessionStorage.getItem("editor-salvo");
  if (salvo) {
    sessionStorage.removeItem("editor-salvo");
    sessionStorage.removeItem("editor-aviso");
    const ajuda = barra.querySelector("#editor-ajuda");
    if (ajuda) {
      ajuda.textContent = aviso
        ? `Salvo em parte. Esta frase não entrou: ${aviso}`
        : "Salvo. A página já está com o texto novo.";
    }
  }

  document.addEventListener("input", (evento) => {
    const el = evento.target;
    if (!(el instanceof HTMLElement) || !document.body.classList.contains("editando")) return;
    const campo = el.dataset.campo;
    if (!campo || !CAMPOS.has(campo)) return;
    const valor = texto(el);
    ultimoCampo.set(campo, valor);
    for (const outro of document.querySelectorAll<HTMLElement>(`[data-campo="${campo}"]`)) {
      if (outro !== el && texto(outro) !== valor) outro.textContent = valor;
    }
  });

  document.addEventListener(
    "click",
    (evento) => {
      if (!document.body.classList.contains("editando")) return;
      const link = (evento.target as HTMLElement | null)?.closest("a");
      if (link && !link.closest("#editor-barra")) evento.preventDefault();
    },
    true,
  );

  barra.querySelector("#editor-ligar")?.addEventListener("click", () => {
    if (document.body.classList.contains("editando")) {
      location.reload();
      return;
    }
    ligarEdicao(true);
  });

  barra.querySelector("#editor-salvar")?.addEventListener("click", async () => {
    const ajuda = barra.querySelector("#editor-ajuda");
    try {
      if (ajuda) ajuda.textContent = "Salvando…";
      await salvar();
    } catch (erro) {
      if (ajuda) ajuda.textContent = erro instanceof Error ? erro.message : "Não salvou.";
    }
  });
}
