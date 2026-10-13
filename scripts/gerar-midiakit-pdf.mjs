// Gera public/midiakit-raros.pdf a partir da página /midiakit.
// Uso: npm run midiakit:pdf
// Precisa do Microsoft Edge ou Google Chrome instalado (sem dependências extras).
import { spawn, spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const porta = 4399;
const url = `http://localhost:${porta}/midiakit`;
const saida = resolve(raiz, "public", "midiakit-raros.pdf");
const astro = resolve(raiz, "node_modules", "astro", "astro.js");

const navegadores = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];
const navegador = navegadores.find((c) => existsSync(c));
if (!navegador) {
  console.error("Edge ou Chrome não encontrado. Instale um deles para gerar o PDF.");
  process.exit(1);
}

// As fotos originais têm até 6192x4128 px; no PDF isso vira dezenas de MB.
// Para o mídia kit usamos cópias leves em public/images/mk/.
console.log("0/3 Otimizando imagens do mídia kit...");
const { default: sharp } = await import("sharp");
const origem = resolve(raiz, "public", "images");
const destino = resolve(origem, "mk");
mkdirSync(destino, { recursive: true });
const imagens = [
  "ambiente-1", "ambiente-2", "ambiente-3", "ambiente-4",
  "card-treinamento", "hero", "organizador",
  "depoimento-1", "depoimento-2", "depoimento-3",
  "perfil-clube.jpg",
  "tatiane.jpg", "leandro.jpg", "guaciara.jpg",
  "evento-anterior-1.jpg", "evento-anterior-2.jpg",
];
for (const item of imagens) {
  const [nome, ext = "webp"] = item.split(".");
  await sharp(resolve(origem, `${nome}.${ext}`))
    .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(resolve(destino, `${nome}.jpg`));
}

// `npm run midiakit:imagens` só otimiza as imagens (para trabalhar no dev server) e não gera PDF.
if (process.argv.includes("--so-imagens")) {
  console.log("Imagens otimizadas em public/images/mk/. PDF não foi gerado.");
  process.exit(0);
}

console.log("1/3 Build do site...");
const build = spawnSync(process.execPath, [astro, "build"], { cwd: raiz, stdio: "inherit" });
if (build.status !== 0) process.exit(build.status ?? 1);

console.log("2/3 Subindo o preview...");
const servidor = spawn(process.execPath, [astro, "preview", "--port", String(porta)], {
  cwd: raiz,
  stdio: "ignore",
});

async function esperarServidor() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("O preview não subiu a tempo.");
}

try {
  await esperarServidor();
  console.log("3/3 Gerando o PDF...");
  const perfil = resolve(raiz, ".astro", "pdf-profile");
  const r = spawnSync(
    navegador,
    [
      "--headless=new",
      "--disable-gpu",
      `--user-data-dir=${perfil}`,
      "--no-pdf-header-footer",
      "--run-all-compositor-stages-before-draw",
      "--virtual-time-budget=20000",
      `--print-to-pdf=${saida}`,
      url,
    ],
    { stdio: "inherit" },
  );
  if (r.status !== 0 || !existsSync(saida)) throw new Error("O navegador não gerou o PDF.");

  // Copia também para dist/, para o PDF ir junto no deploy atual.
  const dist = resolve(raiz, "dist");
  if (existsSync(dist)) {
    mkdirSync(dist, { recursive: true });
    copyFileSync(saida, resolve(dist, "midiakit-raros.pdf"));
  }
  console.log(`PDF gerado: ${saida} (${Math.round(statSync(saida).size / 1024)} KB)`);
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
} finally {
  servidor.kill();
}
