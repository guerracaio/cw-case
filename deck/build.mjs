/**
 * Monta os artboards do deck.
 *
 * Cada slide vive em `slides/<Stem>.html` com apenas a marcacao do conteudo.
 * Este script embrulha essa marcacao no formato Design Component e injeta,
 * em cada arquivo, o CSS compartilhado (`shared.css`) e a Cera Pro como
 * @font-face data: URI.
 *
 * A injecao existe porque cada artboard roda em um iframe proprio e nao tem
 * como compartilhar folha de estilo nem fonte com os outros. Mantendo o
 * base64 fora dos arquivos de trabalho, os slides continuam legiveis e
 * editaveis.
 *
 *   node deck/build.mjs
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SLIDES = join(HERE, "slides");
const ASSETS = join(HERE, "assets");
const OUT = join(HERE, "build");

const WEIGHTS = [
  ["Regular", 400],
  ["Medium", 500],
  ["Bold", 700],
];

const fontFaces = WEIGHTS.map(([name, weight]) => {
  const b64 = readFileSync(join(ASSETS, `CeraPro-${name}.woff2`)).toString("base64");
  return [
    "@font-face{font-family:'Cera Pro';",
    `src:url(data:font/woff2;base64,${b64}) format('woff2');`,
    `font-weight:${weight};font-style:normal;font-display:block}`,
  ].join("");
}).join("\n");

const shared = readFileSync(join(HERE, "shared.css"), "utf8");

mkdirSync(OUT, { recursive: true });

const files = readdirSync(SLIDES).filter((f) => f.endsWith(".html"));
if (files.length === 0) throw new Error("nenhum slide em deck/slides/");

for (const file of files) {
  const stem = basename(file, ".html");
  const markup = readFileSync(join(SLIDES, file), "utf8").trim();

  const doc = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<style>
${fontFaces}
${shared}
</style>
</helmet>
${markup}
</x-dc>
<script data-dc-script data-props='{}'>
class Component extends DCLogic {
  renderVals() {
    return {};
  }
}
</script>
</body>
</html>
`;

  writeFileSync(join(OUT, `${stem}.dc.html`), doc, "utf8");
  console.log(`${stem}.dc.html  ${(doc.length / 1024).toFixed(0)} KB`);
}

console.log(`\n${files.length} artboards em deck/build/`);
