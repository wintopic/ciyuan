const examples = [
  {
    id: "question",
    label: "中文问句",
    text: "什么是词元？",
    pieces: ["什么", "是", "词", "元", "？"],
    note:
      "这个例子能直观看出一件事：词元不等于中文分词结果。'什么'被合成了一个词元，但'词元'仍然拆成了两个词元。",
  },
  {
    id: "headline",
    label: "中英混排",
    text: "Token有了中文名——词元！",
    pieces: ["Token", "有", "了", "中文", "名", "——", "词", "元", "！"],
    note:
      "英文单词、中文字符与全角标点会分别参与编码，而像'中文'这样的高频组合也可能直接合并成单个词元。",
  },
  {
    id: "sentence",
    label: "说明长句",
    text: "在AI的世界里，Token（词元）是模型处理信息的最小计量单位。",
    pieces: ["在", "AI", "的", "世界", "里", "，", "Token", "（", "词", "元", "）", "是", "模型", "处理", "信息", "的", "最", "小", "计", "量", "单位", "。"],
    note:
      "中英文、括号和句号都会单独消耗词元。对人看起来只是“一句话”，对模型来说却是一串长度明确的离散单元。",
  },
  {
    id: "code",
    label: "代码行",
    text: "const total = inputTokens + outputTokens;",
    pieces: ["const", " total", " =", " input", "Tokens", " +", " output", "Tokens", ";"],
    note:
      "在代码里，前导空格、运算符和标识符后缀都可能拆成独立词元。这也是代码上下文为什么通常非常耗 token 的原因。",
  },
  {
    id: "json",
    label: "JSON",
    text: "{\"model\":\"gpt-5\",\"input_tokens\":128,\"output_tokens\":256}",
    pieces: ["{\"", "model", "\":\"", "g", "pt", "-", "5", "\",\"", "input", "_tokens", "\":", "128", ",\"", "output", "_tokens", "\":", "256", "}"],
    note:
      "结构化文本会把引号、逗号、冒号和下划线都带进词元序列，所以日志、schema、JSON 经常比同长度的自然语言更“贵”。",
  },
];

const nav = document.querySelector("#example-nav");
const sampleText = document.querySelector("#sample-text");
const tokenPieces = document.querySelector("#token-pieces");
const sampleNote = document.querySelector("#sample-note");
const characterCount = document.querySelector("#character-count");
const tokenCount = document.querySelector("#token-count");
const densityCount = document.querySelector("#density-count");
const characterBar = document.querySelector("#character-bar");
const tokenBar = document.querySelector("#token-bar");
const progressBar = document.querySelector("#scroll-progress-bar");

let activeExampleId = examples[0].id;
let previousMetrics = { characters: 0, tokens: 0, density: 0 };

function classifyPiece(piece) {
  const hasHan = /\p{Script=Han}/u.test(piece);
  const hasAsciiWord = /[A-Za-z]/.test(piece);
  const hasNumber = /\d/.test(piece);
  const onlySymbols = /^[\s\p{P}\p{S}]+$/u.test(piece);

  if (onlySymbols) {
    return "piece-symbol";
  }

  if (hasHan && (hasAsciiWord || hasNumber)) {
    return "piece-mixed";
  }

  if (hasHan) {
    return "piece-han";
  }

  if (hasAsciiWord || hasNumber) {
    return "piece-ascii";
  }

  return "piece-mixed";
}

function animateNumber(element, from, to, decimals = 0) {
  const start = performance.now();
  const duration = 420;

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = from + (to - from) * eased;
    element.textContent = value.toFixed(decimals);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function renderExampleButtons() {
  nav.innerHTML = "";

  examples.forEach((example) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "example-button";
    button.textContent = example.label;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(example.id === activeExampleId));
    button.classList.toggle("is-active", example.id === activeExampleId);
    button.addEventListener("click", () => {
      if (example.id !== activeExampleId) {
        activeExampleId = example.id;
        renderExampleButtons();
        renderActiveExample();
      }
    });
    nav.appendChild(button);
  });
}

function renderActiveExample() {
  const example = examples.find((item) => item.id === activeExampleId);
  if (!example) {
    return;
  }

  const characters = Array.from(example.text).length;
  const tokens = example.pieces.length;
  const density = characters / tokens;
  const maxMetric = Math.max(characters, tokens);

  sampleText.textContent = example.text;
  sampleNote.textContent = example.note;
  tokenPieces.innerHTML = "";

  example.pieces.forEach((piece, index) => {
    const pill = document.createElement("div");
    pill.className = `piece ${classifyPiece(piece)}`;
    pill.style.animationDelay = `${index * 0.03}s`;

    const pillIndex = document.createElement("span");
    pillIndex.className = "piece-index";
    pillIndex.textContent = String(index + 1).padStart(2, "0");

    const pillText = document.createElement("span");
    pillText.className = "piece-text";
    pillText.textContent = piece;

    pill.append(pillIndex, pillText);
    tokenPieces.appendChild(pill);
  });

  animateNumber(characterCount, previousMetrics.characters, characters, 0);
  animateNumber(tokenCount, previousMetrics.tokens, tokens, 0);
  animateNumber(densityCount, previousMetrics.density, density, 1);

  characterBar.style.width = `${(characters / maxMetric) * 100}%`;
  tokenBar.style.width = `${(tokens / maxMetric) * 100}%`;

  previousMetrics = { characters, tokens, density };
}

function updateProgressBar() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

function setupRevealObserver() {
  const sections = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

renderExampleButtons();
renderActiveExample();
setupRevealObserver();
updateProgressBar();

window.addEventListener("scroll", updateProgressBar, { passive: true });
