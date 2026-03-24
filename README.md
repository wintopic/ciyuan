# Token有了中文名——词元！

> 在 AI 的世界里，真正被计算、被计费、被限制上下文长度的，不是“字数”，也不是“篇幅”，而是词元。

![GitHub Repo stars](https://img.shields.io/github/stars/wintopic/ciyuan?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/wintopic/ciyuan?style=flat-square)

这是一个面向中文用户的词元科普页。

如果你也觉得 `Token` 值得有一个更直观的中文入口，欢迎点个 Star。

## 什么是词元？

词元（Token）是大模型处理信息时使用的最小计量单位。

无论是你输入的一句提问，还是模型输出的一段回答，甚至一行代码、一段 JSON、一个标点符号，都会先被切分成词元，再进入模型计算。

这也是为什么：

- 模型的上下文窗口通常按词元计算
- API 的输入和输出通常按词元计费
- 长对话、长代码、长日志会明显增加成本和延迟
- 同一段文本换一个模型，词元数量可能就变了

## 词元不是“词”

“词元”最容易误解的一点，就是很多人会把它直接等同于“一个词”。

其实并不是。

- 一个词，可能会被拆成多个词元
- 一个高频短语，可能会被合并成一个词元
- 空格、括号、逗号、引号，也可能各自占用词元
- 中文里的“字”“词”“短语”和“词元”并不是同一套边界

例如：

| 文本 | 人类直觉 | 模型视角 |
| --- | --- | --- |
| `hello world` | 2 个英文单词 | 常见情况下是 2 个词元 |
| `什么是词元？` | 4 个汉字 + 1 个问号 | 可能是 5 个词元 |
| `Tokenization` | 1 个单词 | 可能拆成 `Token` 和 `ization` |
| `{"input_tokens":128}` | 1 段 JSON | 引号、下划线、冒号、数字都可能单独计入 |

## 为什么词元这么重要？

因为词元几乎决定了你和 AI 交互的“物理成本”。

### 1. 它决定模型能“装下”多少内容

系统提示词、历史对话、检索结果、工具返回值、用户新输入、模型输出，都会一起占用上下文窗口。

窗口不是按“页”算，也不是按“段”算，而是按词元算。

### 2. 它决定你要花多少钱

很多模型服务会分别统计：

- 输入词元
- 输出词元
- 缓存词元
- 部分模型的推理相关词元

你看到的一次调用账单，本质上就是一次词元账单。

### 3. 它决定为什么有些内容“看起来不长，却特别贵”

尤其是这些内容，词元消耗常常会超出直觉：

- 中英混排文本
- 代码
- 表格
- 长日志
- JSON
- 重复提示词
- 冗长的历史对话

## 为什么中文用户更应该理解词元？

因为中文用户特别容易被“字数直觉”误导。

很多人会下意识觉得：

- 中文字少，所以词元应该也少
- 一句话不长，所以成本应该不高
- 只有长文章才会吃掉上下文窗口

但真实情况往往更复杂。

- 中文高频词组有时会合并成一个词元
- 单个汉字也可能独立成为词元
- 全角标点、括号、引号照样会占位
- 一段结构化内容往往比自然语言更耗 token

也就是说，看起来“短”，不一定真的“省”。

## 这页会讲清楚什么？

这个仓库里的网页，重点讲的是：

- 词元到底是什么
- 词元为什么不是“词”
- 为什么上下文窗口和计费都离不开词元
- 中文、英文、代码、JSON 在词元层面有什么差异
- tokenizer 大致是怎么把文本切成模型可计算单位的

它不是面向研究论文的深度教材，而是一份给中文用户建立直觉的清晰入口。

## 适合谁看？

- 刚开始接触大模型的中文用户
- 写提示词的人
- 做 AI 产品的人
- 关心 API 成本的人
- 想搞懂上下文窗口为什么总是不够用的人

## 在线内容形式

仓库当前是一个可直接部署到 Cloudflare Pages 的纯静态页面，包含：

- 长页式中文科普内容
- 词元切分示例
- 词元数量对比
- 面向 GitHub 和网页预览的视觉化呈现

## 本地预览

```powershell
python -m http.server 8000
```

然后访问 `http://127.0.0.1:8000`

## 部署到 Cloudflare Pages

这是一个纯静态站点，直接部署即可。

- Framework preset：`None`
- Build command：`exit 0`
- Build output directory：`.`

## 参考资料

- [OpenAI Help Center: What are tokens and how to count them?](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count)
- [OpenAI Tokenizer](https://platform.openai.com/tokenizer/)
- [Hugging Face Tokenizers](https://huggingface.co/docs/tokenizers/en/components)
- [Anthropic: Token counting](https://docs.anthropic.com/en/docs/build-with-claude/token-counting)
- [Anthropic: Context windows](https://docs.anthropic.com/en/docs/build-with-claude/context-windows)

## 最后一句

如果你觉得“词元”这个中文名值得被更多人看见，或者你也希望有更多面向国人的 AI 基础概念解释页，欢迎 Star 这个仓库。
