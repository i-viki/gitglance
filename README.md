# GitGlance

**GitHub Profile Stats Summary Card Generator**

> Visualize any GitHub profile's contribution stats in a clean, shareable summary card. Displays repos, stars, followers, languages, and contribution streaks — all at a glance.

[![Vite](https://img.shields.io/badge/Vite-8.0-000000?logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-000000?logo=javascript&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS](https://img.shields.io/badge/CSS-Minimal_Design-000000?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![GitHub API](https://img.shields.io/badge/GitHub_API-v3-000000?logo=github&logoColor=white)](https://docs.github.com/en/rest)
[![License](https://img.shields.io/badge/License-MIT-000000.svg)](LICENSE)

---

## Features

- **Instant Profile Cards** — Enter any GitHub username and generate a beautiful stats card
- **Live Data** — Pulls real-time data from the GitHub REST API
- **Stats at a Glance** — Repos, total stars, followers, and following counts
- **Top Languages** — Aggregated language breakdown with colored progress bars
- **Contribution Activity** — Current streak, longest streak, and recent event counts
- **Animated UI** — Count-up counters, growing bars, skeleton loading, and micro-animations
- **Download as PNG** — Export the card as a high-resolution image
- **Shareable Links** — Copy a direct link or share on X (Twitter)
- **Responsive Design** — Looks great on desktop, tablet, and mobile
- **Smart Caching** — Session-based caching to minimize API calls

---

## Tech Stack

| Layer       | Technology                                                             |
|-------------|------------------------------------------------------------------------|
| **Bundler** | [Vite](https://vitejs.dev/)                                            |
| **Language**| Vanilla JavaScript (ES Modules)                                        |
| **Styling** | Vanilla CSS (Minimalist Monochrome Design System, Grid, Monospace)     |
| **API**     | [GitHub REST API v3](https://docs.github.com/en/rest)                  |
| **Export**  | [html2canvas-pro](https://www.npmjs.com/package/html2canvas-pro)       |
| **Font**    | [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts)        |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm (comes with Node.js)

### Installation

```bash
git clone https://github.com/i-viki/gitglance.git
cd gitglance

npm install

npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Usage

1. Open the app in your browser
2. Enter a GitHub username in the search bar (or click one of the example buttons)
3. View the generated stats card with animated counters and language bars
4. Use the action buttons to:
   - **Download PNG** — Save the card as a high-resolution image
   - **Copy Link** — Copy a shareable URL with `?user=username`
   - **Share on X** — Post the card link on Twitter/X

### URL Parameters

You can link directly to a profile card:

```
https://your-domain.com/?user=torvalds
```

---

## Project Structure

```
gitglance/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.js
    ├── api/
    │   ├── github.js
    │   └── cache.js
    ├── components/
    │   └── statsCard.js
    ├── utils/
    │   ├── formatters.js
    │   └── export.js
    └── styles/
        ├── index.css
        ├── search.css
        └── card.css
```

---

## API Rate Limits

GitGlance uses the **GitHub REST API** with optional authentication:

| Mode              | Rate Limit       |
|-------------------|------------------|
| Unauthenticated   | 60 requests/hr   |
| With GitHub Token | 5,000 requests/hr|

- Results are cached in `sessionStorage` for 10 minutes to minimize API calls
- Click "Add GitHub Token" on the homepage to paste a [Personal Access Token](https://github.com/settings/tokens/new?scopes=&description=GitGlance) (no scopes needed)
- If rate-limited, a friendly error message guides you to add a token

---

## Design Highlights

- **Pure Minimalist Aesthetic** — Absolute pitch black surfaces anchored with highly structured geometric alignments
- **High-Contrast Metallic Typography** — Pristine silver gradients paired with deep contrast text styling
- **Technical Monospace Hierarchies** — Nested isometric counter containers tagged with exact monospace data subheaders
- **Inverted Core Interactive Actions** — Ultra-modern pure white call-to-action triggers providing perfect focal prominence
- **Count-up Counters** — Numbers animate from 0 to their values
- **Growing Bars** — Language bars animate to their target widths with custom progress tips
- **Skeleton Loading** — Shimmer placeholders while data loads
- **Toast Notifications** — Non-intrusive feedback for user actions

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Credits

- Data powered by [GitHub REST API](https://docs.github.com/en/rest)
- Typography by [Inter](https://fonts.google.com/specimen/Inter)
- PNG export by [html2canvas-pro](https://github.com/nicolo-ribaudo/html2canvas-pro)

---

<p align="center">
  Built with ♥ by <a href="https://jayavignesh.dev"><strong>jv</strong></a>
</p>
