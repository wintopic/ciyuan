# 词元专题页

一个纯静态的中文网页，详细介绍 AI 里的 Token（词元）是什么、为什么重要，以及它如何影响上下文窗口、成本与工程设计。

## 文件结构

- `index.html`：页面结构
- `styles.css`：样式与动画
- `script.js`：交互式词元示例

## 本地预览

```powershell
python -m http.server 8000
```

然后访问 `http://127.0.0.1:8000`。

## 部署到 Cloudflare Pages

这个项目是纯静态站点，可以直接部署到 Cloudflare Pages。

### 方式一：连接 GitHub 仓库

参考 Cloudflare Pages 的 Static HTML 指南：
<https://developers.cloudflare.com/pages/framework-guides/deploy-anything/>

推荐配置如下：

- Production branch：`main`
- Framework preset：`None`
- Build command：`exit 0`
- Build output directory：`.`

页面根目录下已经包含顶层 `index.html`，符合 Pages 的静态站点要求。

### 方式二：直接上传

参考 Direct Upload 文档：
<https://developers.cloudflare.com/pages/get-started/direct-upload/>

将当前仓库根目录作为静态资源目录上传即可。

## 内容来源

页面中的事实性内容主要基于以下资料整理：

- OpenAI Help Center: <https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count>
- OpenAI Tokenizer: <https://platform.openai.com/tokenizer/>
- Hugging Face Tokenizers: <https://huggingface.co/docs/tokenizers/en/components>
