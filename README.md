# GitGlance

**GitHub Profile Stats Summary Card Generator**

> Visualize any GitHub profile's contribution stats in a clean, shareable summary card. Displays pinned repositories, detailed contribution metrics, official developer badges, and top languages, all powered by a robust GraphQL serverless pipeline.

[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Vercel](https://img.shields.io/badge/Vercel-Serverless-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![GraphQL](https://img.shields.io/badge/GraphQL-GitHub_API-E10098?logo=graphql&logoColor=white)](https://docs.github.com/en/graphql)
[![License](https://img.shields.io/badge/License-MIT-007EC6.svg)](LICENSE)

---

## 🚀 Features

- **Dynamic Visual Themes** — Switch instantly between pristine styles (*Geist Dark*, *Aurora*, *Cyberpunk*, *Glass Frost*).
- **Deep GraphQL Insights** — Securely fetches PR reviews, issues, repositories created, and custom developer statuses.
- **Official Developer Badges** — Automatically detects and displays GitHub Star, Campus Expert, Hireable, and Staff badges.
- **Pinned Repositories Spotlight** — High-fidelity rendering of the user's customized pinned repositories grid.
- **Performance Tier Badging** — Automatically calculates and renders gamified S+/S/A/B developer ranks.
- **Instant Profile Cards** — Enter any GitHub username and generate a beautiful stats card with zero client-side configuration.
- **Download as PNG** — Export the card as a high-resolution image using `html2canvas-pro`.
- **Shareable Links** — Copy a direct link or share effortlessly on X (Twitter).
- **Responsive Layout** — Sleek 2-column grid that automatically snaps to a unified vertical layout on smaller screens.

---

## 🛠️ Tech Stack

| Layer       | Technology                                                             |
|-------------|------------------------------------------------------------------------|
| **Frontend**| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) |
| **Backend** | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white) |
| **API**     | ![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=flat-square&logo=graphql&logoColor=white) [GitHub GraphQL API](https://docs.github.com/en/graphql) |
| **Styling** | ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) Vanilla CSS |
| **Export**  | ![NPM](https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&logoColor=white) [html2canvas-pro](https://www.npmjs.com/package/html2canvas-pro) |

---

## 💻 Local Development

Because GitGlance utilizes a secure backend to mask the API token, local development requires the Vercel CLI.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- A GitHub Personal Access Token (PAT)

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/i-viki/gitglance.git
   cd gitglance
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example config and add your GitHub token.
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` and insert your personal access token (`GITHUB_TOKEN=ghp_...`).*

4. **Run the local Vercel server:**
   ```bash
   npx vercel dev
   ```

The app will be seamlessly served locally (typically at `http://localhost:3000`), with the backend API perfectly proxied.

---

## 🌐 Deployment

GitGlance is meticulously configured for zero-config deployment on Vercel.

1. Push your repository to GitHub.
2. Import the project into your [Vercel Dashboard](https://vercel.com/new).
3. Under **Environment Variables**, add `GITHUB_TOKEN` and paste your token.
4. Click **Deploy**. Vercel will automatically build the Vite frontend and provision the Serverless backend.

---

## 🏗️ Project Structure

```
gitglance/
├── api/
│   └── github.js           # Secure Vercel Serverless GraphQL Backend
├── src/
│   ├── api/
│   │   ├── githubGraphQL.js # Frontend API Caller
│   │   ├── github.js        # Data Mapper & Aggregator
│   │   └── cache.js         # Client-side sessionStorage manager
│   ├── components/
│   │   └── statsCard.js     # Core UI Rendering Engine
│   ├── styles/
│   │   ├── card.css         # Grid layouts & Theme tokens
│   │   └── index.css        # Global variables & base styles
│   └── main.js             # Application Controller
├── index.html
├── vite.config.js
└── package.json
```

---

## 🎨 Design Highlights

- **Pure Minimalist Aesthetic** — Absolute pitch-black surfaces anchored with highly structured geometric alignments.
- **High-Contrast Metallic Typography** — Pristine silver gradients paired with deep contrast text styling.
- **Technical Monospace Hierarchies** — Nested isometric counter containers tagged with exact monospace data subheaders.
- **Inverted Core Interactive Actions** — Ultra-modern pure white call-to-action triggers providing perfect focal prominence.
- **Micro-Animations** — Count-up metric counters, staggered bar track filling, and silky-smooth skeleton loading states.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ♥ by <a href="https://jayavignesh.dev"><strong>jv</strong></a>
</p>
