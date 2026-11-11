// Gera as versões leves das imagens usadas na página principal.
// Uso: node scripts/otimizar-imagens.mjs
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const pasta = "public/images";

const tarefas = [
  { de: "hero-leandro.jpg", para: "hero-leandro.webp", largura: 682, qualidade: 74 },
  { de: "leandro.jpg", para: "leandro.webp", largura: 480, qualidade: 78 },
  { de: "guaciara.jpg", para: "guaciara.webp", largura: 480, qualidade: 78 },
  { de: "mk/ana-clara.png", para: "ana-clara.webp", largura: 600, qualidade: 78 },
];

for (const n of [1, 2, 3, 4]) {
  for (const largura of [480, 960]) {
    tarefas.push({
      de: `ambiente-${n}.webp`,
      para: `ambiente-${n}-${largura}.webp`,
      largura,
      altura: (largura * 3) / 4,
      qualidade: 72,
    });
  }
}

for (const t of tarefas) {
  await sharp(`${pasta}/${t.de}`)
    .rotate()
    .resize({ width: t.largura, height: t.altura, fit: "cover", withoutEnlargement: true })
    .webp({ quality: t.qualidade })
    .toFile(`${pasta}/${t.para}`);
  console.log(`${t.para}`);
}

const videos = ["6JuHeCETFT0", "6FwxZEKQaC0", "kdY579l18To", "nP8JC4RUjfs"];
await mkdir(`${pasta}/yt`, { recursive: true });
for (const id of videos) {
  const resposta = await fetch(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
  if (!resposta.ok) throw new Error(`Capa ${id}: HTTP ${resposta.status}`);
  const webp = await sharp(Buffer.from(await resposta.arrayBuffer())).webp({ quality: 72 }).toBuffer();
  await writeFile(`${pasta}/yt/${id}.webp`, webp);
  console.log(`yt/${id}.webp`);
}
