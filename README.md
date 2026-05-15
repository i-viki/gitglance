# ⚡ GitGlance

> **The Ultimate GitHub Profile Visualizer.** 
> Generate high-fidelity, shareable summary cards of your GitHub contribution history, repositories, and achievements. Powered by a secure Vercel serverless GraphQL architecture.
>
> **Live Demo:** [igitglance.vercel.app](https://igitglance.vercel.app)

[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Vercel](https://img.shields.io/badge/Vercel-Serverless-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![GraphQL](https://img.shields.io/badge/GraphQL-v4-E10098?logo=graphql&logoColor=white)](https://graphql.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## ✨ Features

- **📊 Contribution Heatmap** — A real-time visual grid showing your last 70 days of activity.
- **🪄 Interactive Language Visualization** — A unified, hover-interactive bar showing your exact language distribution.
- **🏢 Organization Spotlight** — Automatic detection and rendering of organization affiliations with high-res logos.
- **🔗 Social Identity Bar** — Seamless integration for Twitter, LinkedIn, and personal website links.
- **🏆 S-Tier Performance Badging** — Gamified ranking system (S+, S, A, B) based on advanced data analytics.
- **official Developer Badges** — Displays GitHub Star, Campus Expert, and Staff statuses.
- **Pinned Repositories Spotlight** — High-fidelity rendering of your customized pinned repositories grid.
- **🖼️ Dynamic SEO & OpenGraph** — Automatic page title and meta updates for perfect social sharing.
- **🚀 Serverless GraphQL Engine** — Secure backend architecture protects API tokens while providing deep data insights.
- **💾 PNG Export & Share** — High-resolution card exports and one-click sharing to X (Twitter).

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | [Vite](https://vitejs.dev/) + [Vanilla JS](https://developer.mozilla.org/en-US/docs/Web/JavaScript) |
| **Styling** | [Geist Design System](https://vercel.com/design) (Vanilla CSS) |
| **Backend** | [Vercel Serverless Functions](https://vercel.com/docs/functions) |
| **Data Engine** | [GitHub GraphQL API v4](https://docs.github.com/en/graphql) |
| **Icons** | Custom Minimalist SVG Library |
| **Export** | [html2canvas-pro](https://github.com/niklasvh/html2canvas) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- A [GitHub Personal Access Token](https://github.com/settings/tokens) (Classic or Fine-grained)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/gitglance.git
   cd gitglance
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   GITHUB_TOKEN=your_token_here
   ```

4. **Run the full-stack environment:**
   ```bash
   npm run vercel
   ```
   *Note: This command runs `vercel dev`, which emulates the serverless backend locally at `http://localhost:3000`.*

---

## 📦 Deployment

Deploying to Vercel is seamless:

1. Connect your repository to [Vercel](https://vercel.com/).
2. Add your `GITHUB_TOKEN` in the **Project Settings > Environment Variables** section.
3. Deploy! The serverless functions in `api/` will handle all API proxying automatically.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️ by <a href="https://jayavignesh.dev">jv</a></p>
</div>
