const examples = [
  {
    id: "question",
    label: "短问句",
    text: "什么是词元？",
    pieces: ["什么", "是", "词", "元", "？"],
    note: "看起来只有一句很短的问句，但“词元”在这里依然拆成了两个片段。",
  },
  {
    id: "headline",
    label: "中英混排",
    text: "Token有了中文名——词元！",
    pieces: ["Token", "有", "了", "中文", "名", "——", "词", "元", "！"],
    note: "英文单词、中文、高频短语和标点，都可能用不同方式进入词元序列。",
  },
  {
    id: "sentence",
    label: "说明句",
    text: "在AI的世界里，词元会影响上下文窗口和费用。",
    pieces: ["在", "AI", "的", "世界", "里", "，", "词", "元", "会", "影响", "上下文", "窗口", "和", "费用", "。"],
    note: "人看起来是一句话，模型看到的是一串离散片段。窗口和费用就是按这串片段来算的。",
  },
  {
    id: "json",
    label: "JSON",
    text: '{"query":"词元是什么","top_k":5,"cache":true}',
    pieces: ['{"', "query", '":"', "词", "元", "是什么", '","', "top", "_k", '":', "5", ',"', "cache", '":', "true", "}"],
    note: "结构化内容里有很多引号、下划线、冒号和字段名，所以通常比看起来更耗词元。",
  },
];

const quizItems = [
  {
    text: "1 个词元通常就等于 1 个汉字。",
    answer: false,
    explain: "不对。汉字可能单独成词元，但高频双字词也可能合并成一个词元。",
  },
  {
    text: "代码和 JSON 往往比同长度自然语言更耗词元。",
    answer: true,
    explain: "对。因为里面有大量符号、字段名和重复结构，切分后常常更碎。",
  },
  {
    text: "上下文窗口通常是按词元，不是按段落来计算的。",
    answer: true,
    explain: "对。系统提示词、历史对话和输出内容，都会一起占用词元窗口。",
  },
];

const nav = document.querySelector("#example-nav");
const sampleText = document.querySelector("#sample-text");
const tokenPieces = document.querySelector("#token-pieces");
const sampleNote = document.querySelector("#sample-note");
const characterCount = document.querySelector("#character-count");
const tokenCount = document.querySelector("#token-count");
const densityCount = document.querySelector("#density-count");
const quizList = document.querySelector("#quiz-list");
const progressBar = document.querySelector("#progress-bar");
const budgetInput = document.querySelector("#budget-input");
const presetButtons = document.querySelectorAll(".preset-button");
const budgetCharacters = document.querySelector("#budget-characters");
const budgetHan = document.querySelector("#budget-han");
const budgetAscii = document.querySelector("#budget-ascii");
const budgetEstimate = document.querySelector("#budget-estimate");
const budgetLevel = document.querySelector("#budget-level");
const budgetNote = document.querySelector("#budget-note");

let activeExampleId = examples[0].id;
let previousMetrics = { characters: 0, tokens: 0, density: 0 };

function animateNumber(element, from, to, decimals = 0) {
  const start = performance.now();
  const duration = 360;

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

function classifyPiece(piece) {
  const hasHan = /\p{Script=Han}/u.test(piece);
  const hasAscii = /[A-Za-z0-9]/.test(piece);
  const onlySymbols = /^[\s\p{P}\p{S}]+$/u.test(piece);

  if (onlySymbols) return "piece-symbol";
  if (hasHan && hasAscii) return "piece-mixed";
  if (hasHan) return "piece-han";
  if (hasAscii) return "piece-ascii";
  return "piece-mixed";
}

function renderExampleButtons() {
  nav.innerHTML = "";

  examples.forEach((example) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "example-button";
    button.textContent = example.label;
    button.classList.toggle("is-active", example.id === activeExampleId);
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(example.id === activeExampleId));
    button.addEventListener("click", () => {
      activeExampleId = example.id;
      renderExampleButtons();
      renderActiveExample();
    });
    nav.appendChild(button);
  });
}

function renderActiveExample() {
  const example = examples.find((item) => item.id === activeExampleId);
  if (!example) return;

  const characters = Array.from(example.text).length;
  const tokens = example.pieces.length;
  const density = characters / tokens;

  sampleText.textContent = example.text;
  sampleNote.textContent = example.note;
  tokenPieces.innerHTML = "";

  example.pieces.forEach((piece, index) => {
    const chip = document.createElement("div");
    chip.className = `piece ${classifyPiece(piece)}`;
    chip.style.animationDelay = `${index * 0.03}s`;

    const order = document.createElement("span");
    order.className = "piece-index";
    order.textContent = String(index + 1);

    const text = document.createElement("span");
    text.textContent = piece;

    chip.append(order, text);
    tokenPieces.appendChild(chip);
  });

  animateNumber(characterCount, previousMetrics.characters, characters, 0);
  animateNumber(tokenCount, previousMetrics.tokens, tokens, 0);
  animateNumber(densityCount, previousMetrics.density, density, 1);

  previousMetrics = { characters, tokens, density };
}

function renderQuiz() {
  quizList.innerHTML = "";

  quizItems.forEach((item) => {
    const wrapper = document.createElement("article");
    wrapper.className = "quiz-item";

    const title = document.createElement("p");
    title.textContent = item.text;

    const actions = document.createElement("div");
    actions.className = "quiz-actions";

    const result = document.createElement("div");
    result.className = "quiz-result";
    result.hidden = true;

    ["对", "错"].forEach((label) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-button";
      button.textContent = label;
      button.addEventListener("click", () => {
        const guess = label === "对";
        actions.querySelectorAll("button").forEach((node) => node.classList.remove("is-selected"));
        button.classList.add("is-selected");

        const isCorrect = guess === item.answer;
        result.hidden = false;
        result.className = `quiz-result ${isCorrect ? "is-correct" : "is-wrong"}`;
        result.textContent = `${isCorrect ? "答对了。" : "这题答错了。"}${item.explain}`;
      });
      actions.appendChild(button);
    });

    wrapper.append(title, actions, result);
    quizList.appendChild(wrapper);
  });
}

function analyzeText(text) {
  const chars = Array.from(text);
  if (!chars.length) {
    return {
      characters: 0,
      han: 0,
      asciiParts: 0,
      estimate: 0,
      hasStructuredText: false,
      hasCode: false,
      hasMixedText: false,
    };
  }

  const hanMatches = text.match(/\p{Script=Han}/gu) || [];
  const asciiMatches = text.match(/[A-Za-z0-9_]+/g) || [];
  const symbolMatches = text.match(/[^\p{Script=Han}A-Za-z0-9_\s]/gu) || [];
  const whitespaceMatches = text.match(/\s+/g) || [];

  const asciiCost = asciiMatches.reduce((sum, part) => sum + Math.max(1, Math.ceil(part.length / 4)), 0);
  const symbolCost = symbolMatches.length;
  const whitespaceCost = Math.ceil(whitespaceMatches.join("").length * 0.25);
  const hanCost = hanMatches.length ? Math.max(1, Math.round(hanMatches.length * 0.9)) : 0;
  const estimate = hanCost + asciiCost + symbolCost + whitespaceCost;

  return {
    characters: chars.length,
    han: hanMatches.length,
    asciiParts: asciiMatches.length,
    estimate,
    hasStructuredText: /[{}[\]:"_]/.test(text),
    hasCode: /[=;+()<>]/.test(text),
    hasMixedText: /[A-Za-z]/.test(text) && /\p{Script=Han}/u.test(text),
  };
}

function getBudgetMessage(analysis) {
  if (!analysis.characters) {
    return "先输入一点内容，页面会给你一个建立直觉用的粗略估算。";
  }

  const hints = [];

  if (analysis.hasStructuredText) {
    hints.push("结构化内容通常比看起来更耗词元。");
  }
  if (analysis.hasCode) {
    hints.push("代码里的符号、空格和标识符后缀会推高开销。");
  }
  if (analysis.hasMixedText) {
    hints.push("中英混排往往比纯中文更难凭直觉估计。");
  }
  if (!hints.length) {
    hints.push("精确计数仍要看具体模型和分词器，这里主要帮你建立预算感。");
  }

  return hints.join(" ");
}

function getBudgetLevel(estimate) {
  if (estimate === 0) return "未输入";
  if (estimate <= 12) return "轻";
  if (estimate <= 36) return "中";
  return "重";
}

function updateBudget() {
  const analysis = analyzeText(budgetInput.value);

  budgetCharacters.textContent = String(analysis.characters);
  budgetHan.textContent = String(analysis.han);
  budgetAscii.textContent = String(analysis.asciiParts);
  budgetEstimate.textContent = String(analysis.estimate);
  budgetLevel.textContent = getBudgetLevel(analysis.estimate);
  budgetNote.textContent = getBudgetMessage(analysis);
}

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

function setupReveal() {
  const nodes = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  nodes.forEach((node) => observer.observe(node));
}

presetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    budgetInput.value = button.dataset.text || "";
    updateBudget();
    budgetInput.focus();
  });
});

budgetInput.addEventListener("input", updateBudget);
window.addEventListener("scroll", updateProgress, { passive: true });

renderExampleButtons();
renderActiveExample();
renderQuiz();
updateBudget();
updateProgress();
setupReveal();
