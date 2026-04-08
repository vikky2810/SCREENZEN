# 🎯 SCREENZEN
### Your screenshots, organized automatically. No manual work, no clutter, 100% private.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Privacy: 100% Offline](https://img.shields.io/badge/Privacy-Offline%20First-blueviolet)](https://github.com/vikram-kamble)
[![Platform: Desktop](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS-blue)](https://github.com/vikram-kamble)

**ScreenZen** is a high-performance desktop productivity tool that eliminates the "unorganized screenshot" mess. By running silently in the background, it auto-detects new captures, performs instant OCR (Optical Character Recognition), and builds a searchable library—all without you lifting a finger.

---

## ✨ Key Features

- **🚀 Auto-Capture Magic**: Automatically watches your system's screenshot folders. No manual drag-and-drop required.
- **🔍 Instant Search**: Finding a receipt, a snippet of code, or a meeting note? Type any word that was *inside* the screenshot to find it instantly.
- **📂 Background Service**: Sits quietly in the system tray. Stays out of your way until you need to find something.
- **🛡️ 100% Offline & Private**: Your data never leaves your machine. OCR and processing happen locally using Tesseract.js—zero API calls, zero tracking.
- **⚡ Lightning Fast**: Capture-to-index happens in under 2 seconds, ensuring your library is always up-to-date.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Electron](https://www.electronjs.org/) (Desktop) |
| **Frontend** | [React](https://reactjs.org/) + [TailwindCSS](https://tailwindcss.com/) |
| **OCR Engine** | [Tesseract.js](https://tesseract.projectnaptha.com/) (Local Processing) |
| **File Watching** | [Chokidar](https://github.com/paulmillr/chokidar) (Real-time detection) |
| **Storage** | [localForage](https://localforage.github.io/localForage/) (IndexedDB) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0.0 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/vikram-kamble/SCREENZEN.git
   ```
2. Navigate to the project directory:
   ```bash
   cd SCREENZEN
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running in Development
To launch the app in development mode:
```bash
npm start
```

---

## 🕹️ How It Works

1. **Wait**: ScreenZen initializes a background watcher (Chokidar) on your system's default screenshot paths.
2. **Capture**: You take a screenshot using your usual system shortcuts (PrtSc, Cmd+Shift+4, etc.).
3. **Index**: The app detects the new file, runs it through the local OCR engine, and extracts all text content.
4. **Search**: Open the ScreenZen gallery and type any keyword to find the exact image you're looking for.

---

## 🏆 Challenges & Learnings
### Optimizing OCR Speed
One of the primary challenges was ensuring that the background processing didn't slow down the user's system. Initially, running Tesseract.js on every capture was resource-intensive. I optimized this by:
- Implementing a **worker-pool** to handle OCR tasks off the main thread.
- **Prioritizing resources**: Leveraging local storage to cache results and only processing the necessary image segments for keyword extraction.
- **Async Processing**: Ensuring the UI remains responsive even during heavy indexing of old screenshots.

---

## 🗺️ Roadmap
- [ ] **AI Tagging**: Use local LLMs to categorize images (e.g., "Code," "Meme," "Document").
- [ ] **Custom Folders**: Allow users to watch specific project directories.
- [ ] **Cloud Sync (Optional)**: Optional encrypted sync for multi-device workflows.
- [ ] **Actionable Snippets**: "Copy Code" button that extracts code blocks directly into your clipboard.

---

## 👤 Author
**Vikram Kamble**
- GitHub: [@vikram-kamble](https://github.com/vikram-kamble)
- *Feel free to reach out for collaborations or feedback!*

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.