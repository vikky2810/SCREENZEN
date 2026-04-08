# 📋 ScreenZen Development Plan

This document tracks the current status, upcoming features, and long-term goals for **ScreenZen**.

---

## ✅ Phase 1: Core Foundation (COMPLETED)
- [x] **Project Scaffolding**: Electron + React + TailwindCSS setup.
- [x] **Folder Watcher**: Chokidar integration for real-time monitoring.
- [x] **OCR Engine**: Tesseract.js local worker integration.
- [x] **Storage**: IndexedDB (localForage) for metadata and search indices.
- [x] **Background Mode**: System tray integration for hands-off operation.

---

## 🚀 Phase 2: User Experience & Polish (IN PROGRESS)
- [ ] **Dynamic Theming**: Support for System Dark/Light modes.
- [ ] **Auto-Start on Boot**: Settings option to launch ScreenZen at login.
- [ ] **Smart Thumbnails**: Optimize image preview sizes for the gallery.
- [ ] **Native Notifications**: Better system alerts when a screenshot is successfully indexed.
- [ ] **In-App Cropping**: Quick tool to crop sensitive info from indexed screenshots.

---

## 🤖 Phase 3: Advanced Intelligence
- [ ] **Local AI Tagging**: Integrate a lightweight local model (like Transformers.js) for image classification (e.g., "Code," "Nature," "Documents").
- [ ] **Actionable Snippets**: "One-click Copy" for code blocks or URLs found within screenshots.
- [ ] **Semantic Search**: Move beyond keyword matching to search by *meaning* of the image.
- [ ] **Custom Watch Folders**: UI to add/remove specific directories for monitoring.

---

## 📦 Phase 4: Distribution & Deployment
- [ ] **Platform Builds**:
  - [ ] Windows (.exe / MSI)
  - [ ] macOS (.dmg / Apple Silicon support)
  - [ ] Linux (.AppImage)
- [ ] **Auto-Updates**: Integration with Electron-Updater for seamless patches.
- [ ] **Landing Page**: GitHub Pages site highlighting the "Privacy-First" approach.

---

## 💡 Future Ideas (Backlog)
- [ ] **Encrypted Cloud Sync**: Optional E2E encrypted sync across devices.
- [ ] **Mobile Companion**: View your desktop screenshot library on your phone.
- [ ] **Browser Extension**: Capture full-page screenshots directly into ScreenZen.

---

## 🔧 Maintenance
- [ ] Update dependencies (monthly).
- [ ] Profile memory usage for the file-watcher service.
- [ ] Refine OCR accuracy for low-resolution screenshots.
