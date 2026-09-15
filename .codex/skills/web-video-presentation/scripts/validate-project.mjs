#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log("Usage: node validate-project.mjs <project-root|presentation-dir>");
  console.log("Validates outline.md and the optional presentation/ implementation.");
  process.exit(0);
}

const inputRoot = path.resolve(args.find((arg) => !arg.startsWith("-")) ?? process.cwd());
const hasPresentationChild = fs.existsSync(path.join(inputRoot, "presentation"));
const presentationRoot = hasPresentationChild
  ? path.join(inputRoot, "presentation")
  : fs.existsSync(path.join(inputRoot, "src"))
    ? inputRoot
    : null;
const projectRoot = hasPresentationChild
  ? inputRoot
  : presentationRoot
    ? path.dirname(presentationRoot)
    : inputRoot;
const outlinePath = [path.join(projectRoot, "outline.md"), path.join(inputRoot, "outline.md")]
  .find((candidate) => fs.existsSync(candidate));

const errors = [];
const warnings = [];
const outlineChapters = new Map();

const error = (message) => errors.push(message);
const warn = (message) => warnings.push(message);

function walk(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...walk(full, predicate));
    else if (predicate(full)) result.push(full);
  }
  return result;
}

function relative(file) {
  return path.relative(projectRoot, file).replaceAll(path.sep, "/");
}

function countArrayItems(source, openIndex) {
  let square = 1;
  let curly = 0;
  let paren = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  let hasItem = false;
  let count = 0;

  for (let index = openIndex + 1; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (lineComment) {
      if (char === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      hasItem = true;
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === "/" && next === "/") {
      lineComment = true;
      index += 1;
      continue;
    }
    if (char === "/" && next === "*") {
      blockComment = true;
      index += 1;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      hasItem = true;
      continue;
    }
    if (char === "[") {
      square += 1;
      hasItem = true;
      continue;
    }
    if (char === "]") {
      square -= 1;
      if (square === 0) return count + (hasItem ? 1 : 0);
      continue;
    }
    if (char === "{") {
      curly += 1;
      hasItem = true;
      continue;
    }
    if (char === "}") {
      curly -= 1;
      continue;
    }
    if (char === "(") {
      paren += 1;
      hasItem = true;
      continue;
    }
    if (char === ")") {
      paren -= 1;
      continue;
    }
    if (char === "," && square === 1 && curly === 0 && paren === 0) {
      if (hasItem) count += 1;
      hasItem = false;
      continue;
    }
    if (!/\s/.test(char)) hasItem = true;
  }
  return null;
}

function parseNarrationCount(source) {
  const declaration = source.search(/export\s+const\s+narrations\b/);
  if (declaration < 0) return null;
  const equals = source.indexOf("=", declaration);
  const open = source.indexOf("[", equals);
  if (equals < 0 || open < 0) return null;
  return countArrayItems(source, open);
}

function pngHasAlpha(file) {
  const bytes = fs.readFileSync(file);
  if (bytes.length < 26 || bytes.toString("ascii", 1, 4) !== "PNG") return null;
  return bytes[25] === 4 || bytes[25] === 6;
}

function validateOutline() {
  if (!outlinePath) {
    error("找不到 outline.md。");
    return;
  }

  const source = fs.readFileSync(outlinePath, "utf8");
  const lines = source.split(/\r?\n/);
  const h1Count = lines.filter((line) => /^# Video Outline\b/.test(line)).length;
  if (h1Count !== 1) error(`outline 必須恰好有一個「# Video Outline」，目前 ${h1Count} 個。`);

  const boardCount = lines.filter((line) => /^## 進度看板\s*$/.test(line)).length;
  if (boardCount !== 1) error(`outline 必須恰好有一個「## 進度看板」，目前 ${boardCount} 個。`);
  for (let cp = 0; cp <= 5; cp += 1) {
    const matches = source.match(new RegExp(`^\\|\\s*CP-${cp}\\s*\\|`, "gm")) ?? [];
    if (matches.length !== 1) error(`進度看板 CP-${cp} 應恰好一列，目前 ${matches.length} 列。`);
  }

  const metadata = [...source.matchAll(/^>\s*\*\*章節數\*\*：封面\s*\+\s*(\d+)\s*章\s*\/\s*(\d+)\s*步/gm)];
  if (metadata.length !== 1) {
    error(`「章節數」metadata 應恰好一列，目前 ${metadata.length} 列。`);
  }

  let current = null;
  const missingVisualType = [];
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    const heading = line.match(/^##\s+(\d+)\.\s+([0-9]{2}-[a-z0-9-]+).*?（(\d+)\s+steps?\s*·/);
    if (heading) {
      current = {
        number: Number(heading[1]),
        id: heading[2],
        declaredSteps: Number(heading[3]),
        steps: [],
        illustrationSteps: new Set(),
      };
      if (outlineChapters.has(current.id)) error(`outline 章節重複：${current.id}。`);
      outlineChapters.set(current.id, current);
      continue;
    }
    if (!current) continue;

    const step = line.match(/^-\s*step\s+(\d+)\s*\([^)]*\)\s*(?:【([^】]+)】)?\s*[—-]/i);
    if (step) {
      const visualType = step[2] ?? null;
      current.steps.push({ number: Number(step[1]), visualType, line: lineIndex + 1 });
      if (!visualType) missingVisualType.push(`L${lineIndex + 1} ${current.id} step ${step[1]}`);
      else if (!["情境插圖", "程式演示", "真實素材", "文字構圖"].includes(visualType)) {
        error(`outline L${lineIndex + 1} 使用未知視覺類型「${visualType}」。`);
      }
    }
    const illustration = line.match(/^-\s*\[step\s+(\d+)\].*?illustrations\/[a-z0-9-]+\/[a-z0-9-]+\.(?:png|webp)/i);
    if (illustration) current.illustrationSteps.add(Number(illustration[1]));
  }

  if (outlineChapters.size === 0) error("outline 找不到合法章節標題。");
  const firstChapter = outlineChapters.values().next().value;
  if (firstChapter?.id !== "00-cover" || firstChapter?.number !== 0) {
    error("第一個章節必須是「## 0. 00-cover」。");
  }

  for (const chapter of outlineChapters.values()) {
    if (chapter.steps.length !== chapter.declaredSteps) {
      error(`${chapter.id} 標題宣告 ${chapter.declaredSteps} steps，但列出 ${chapter.steps.length} 個。`);
    }
    chapter.steps.forEach((step, index) => {
      if (step.number !== index + 1) error(`${chapter.id} step 編號不連續：位置 ${index + 1} 寫成 step ${step.number}。`);
      if (step.visualType === "情境插圖" && !chapter.illustrationSteps.has(step.number)) {
        error(`${chapter.id} step ${step.number} 標為【情境插圖】，但缺少對應插圖建議與路徑。`);
      }
    });
  }

  if (missingVisualType.length > 0) {
    const sample = missingVisualType.slice(0, 8).join("、");
    error(`${missingVisualType.length} 個 step 缺少視覺類型標記（例：${sample}${missingVisualType.length > 8 ? "…" : ""}）。`);
  }

  if (metadata.length === 1) {
    const declaredContentChapters = Number(metadata[0][1]);
    const declaredTotalSteps = Number(metadata[0][2]);
    const actualContentChapters = [...outlineChapters.values()].filter((chapter) => chapter.id !== "00-cover").length;
    const actualTotalSteps = [...outlineChapters.values()].reduce((sum, chapter) => sum + chapter.declaredSteps, 0);
    if (declaredContentChapters !== actualContentChapters) {
      error(`metadata 宣告 ${declaredContentChapters} 個內容章節，實際 ${actualContentChapters} 個。`);
    }
    if (declaredTotalSteps !== actualTotalSteps) {
      error(`metadata 宣告 ${declaredTotalSteps} steps，章節合計 ${actualTotalSteps}。`);
    }
  }

  const assetRefs = new Set(
    [...source.matchAll(/(?:`|\()(?<asset>illustrations\/[a-z0-9-]+\/[a-z0-9-]+\.(?:png|webp))/gi)]
      .map((match) => match.groups.asset),
  );
  if (presentationRoot) {
    for (const asset of assetRefs) {
      if (!fs.existsSync(path.join(presentationRoot, "public", asset))) {
        error(`outline 引用的素材不存在：presentation/public/${asset}。`);
      }
    }
  }
}

function validatePresentation() {
  if (!presentationRoot) {
    warn("尚未找到 presentation/；本次只驗證 outline。");
    return;
  }

  const themeMarker = path.join(presentationRoot, ".theme");
  if (fs.existsSync(themeMarker)) {
    const theme = fs.readFileSync(themeMarker, "utf8").trim();
    if (theme !== "we-bare-bears") error(`.theme 必須是 we-bare-bears，目前是「${theme}」。`);
  } else {
    warn("presentation/.theme 不存在，無法確認固定熊熊視覺系統。");
  }

  const themeJsonPath = path.join(presentationRoot, "public", "theme-assets", "theme.json");
  if (!fs.existsSync(themeJsonPath)) {
    error("缺少 public/theme-assets/theme.json。");
  } else {
    try {
      const theme = JSON.parse(fs.readFileSync(themeJsonPath, "utf8"));
      if (theme.id !== "we-bare-bears") error(`theme.json id 必須是 we-bare-bears，目前是「${theme.id}」。`);
      if (theme.styleReference) error("theme.json 仍使用混合用途 styleReference；必須拆成 layoutReference + illustrationStyle。");
      if (!theme.layoutReference?.path) error("theme.json 缺少 layoutReference.path。");
      if (!theme.illustrationStyle?.goldenReference) error("theme.json 缺少 illustrationStyle.goldenReference。");
      for (const reference of [
        theme.layoutReference?.path,
        theme.illustrationStyle?.goldenReference,
        ...(theme.illustrationStyle?.characterReferences ?? []),
      ].filter(Boolean)) {
        const asset = path.join(presentationRoot, "public", reference.replace(/^\//, ""));
        if (!fs.existsSync(asset)) {
          error(`theme.json 參考圖不存在：${reference}。`);
        } else if (reference === theme.illustrationStyle?.goldenReference && /\.png$/i.test(asset)) {
          const hasAlpha = pngHasAlpha(asset);
          if (hasAlpha === false) error(`插圖 golden reference 沒有透明 alpha：${reference}。`);
        }
      }
    } catch (cause) {
      error(`theme.json 無法解析：${cause.message}`);
    }
  }

  const chapterRoot = path.join(presentationRoot, "src", "chapters");
  for (const dirent of fs.existsSync(chapterRoot)
    ? fs.readdirSync(chapterRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory())
    : []) {
    const chapterDir = path.join(chapterRoot, dirent.name);
    const narrationPath = path.join(chapterDir, "narrations.ts");
    const tsxFiles = walk(chapterDir, (file) => file.endsWith(".tsx"));
    if (!fs.existsSync(narrationPath)) {
      error(`${dirent.name} 缺少 narrations.ts。`);
      continue;
    }
    if (tsxFiles.length === 0) {
      error(`${dirent.name} 缺少章節 TSX。`);
      continue;
    }

    const narrationSource = fs.readFileSync(narrationPath, "utf8");
    const narrationCount = parseNarrationCount(narrationSource);
    if (narrationCount === null) {
      error(`${relative(narrationPath)} 無法解析 narrations 陣列。`);
      continue;
    }

    const tsxSource = tsxFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
    const stepNumbers = [
      ...[...tsxSource.matchAll(/\bstep\s*===\s*(\d+)/g)].map((match) => Number(match[1])),
      ...[...tsxSource.matchAll(/\bcase\s+(\d+)\s*:/g)].map((match) => Number(match[1])),
    ];
    const indexedStepCounts = [];
    for (const declaration of tsxSource.matchAll(/\bconst\s+([A-Za-z_$][\w$]*)\s*(?::[^=]+)?=\s*\[/g)) {
      const arrayName = declaration[1];
      const open = declaration.index + declaration[0].lastIndexOf("[");
      const arrayCount = countArrayItems(tsxSource, open);
      if (arrayCount === null) continue;
      const accessPattern = new RegExp(`\\b${arrayName}\\s*\\[\\s*step\\s*-\\s*(\\d+)\\s*\\]`, "g");
      for (const access of tsxSource.matchAll(accessPattern)) {
        indexedStepCounts.push(Number(access[1]) + arrayCount);
      }
    }
    const detectedStepCount = Math.max(
      stepNumbers.length > 0 ? Math.max(...stepNumbers) + 1 : 0,
      ...indexedStepCounts,
    );
    if (detectedStepCount === 0) {
      warn(`${dirent.name} 找不到明確的 step === N / case N；請人工確認 step coverage。`);
    } else {
      if (narrationCount !== detectedStepCount) {
        error(`${dirent.name} narrations=${narrationCount}，程式 step=${detectedStepCount}。`);
      }
    }

    const outlineChapter = outlineChapters.get(dirent.name);
    if (outlineChapter && narrationCount !== outlineChapter.declaredSteps) {
      error(`${dirent.name} outline=${outlineChapter.declaredSteps} steps，narrations=${narrationCount}。`);
    }

    if (/loading\s*=\s*["']lazy["']/.test(tsxSource)) {
      error(`${dirent.name} 使用 loading="lazy"，會破壞 PrefetchAhead。`);
    }
    if (dirent.name !== "00-cover" && /title-page-style-reference\.png/.test(tsxSource)) {
      error(`${dirent.name} 直接使用封面 layout reference；它不能當內容章節插圖。`);
    }
  }

  for (const cssFile of walk(chapterRoot, (file) => file.endsWith(".css"))) {
    const source = fs.readFileSync(cssFile, "utf8");
    const hardColors = source.match(/#[0-9a-f]{3,8}\b|\brgba?\s*\(|\bhsla?\s*\(/gi) ?? [];
    if (hardColors.length > 0) {
      warn(`${relative(cssFile)} 有 ${hardColors.length} 個硬編碼顏色，應改用熊熊 token。`);
    }
    const hardFonts = [...source.matchAll(/font-family\s*:\s*([^;]+)/gi)]
      .map((match) => match[1].trim())
      .filter((value) => !value.includes("var(--font-"));
    if (hardFonts.length > 0) {
      warn(`${relative(cssFile)} 有 ${hardFonts.length} 個未使用字體 token 的 font-family。`);
    }
  }

  for (const image of walk(path.join(presentationRoot, "public"), (file) => /\.(png|webp|jpe?g)$/i.test(file))) {
    const size = fs.statSync(image).size;
    if (size > 2_000_000) error(`${relative(image)} 為 ${(size / 1_000_000).toFixed(2)} MB，超過 2 MB 上限。`);
    else if (size > 1_000_000) warn(`${relative(image)} 為 ${(size / 1_000_000).toFixed(2)} MB，建議壓到 1 MB 以下。`);
  }
}

validateOutline();
validatePresentation();

console.log(`\n熊熊簡報驗證：${projectRoot}`);
for (const message of errors) console.error(`ERROR: ${message}`);
for (const message of warnings) console.warn(`WARN:  ${message}`);
console.log(`\n結果：${errors.length} error(s), ${warnings.length} warning(s)`);
if (errors.length > 0) process.exitCode = 1;
