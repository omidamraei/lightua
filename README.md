# lightua

[![npm version](https://img.shields.io/npm/v/lightua.svg?style=flat)](https://www.npmjs.com/package/lightua)
[![CI](https://github.com/amraei/lightua/actions/workflows/ci.yml/badge.svg)](https://github.com/amraei/lightua/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**lightua** is an ultra-light, zero-dependency user-agent parser written in TypeScript.  
It detects browser, engine, OS, device type, and bots — with performance as the top priority.

---

## ✨ Features
- 🚀 **Fast & lightweight** (tiny bundle size, no dependencies)
- 🖥️ Detects **browser name, version, and engine**
- 📱 Identifies **OS and device type** (desktop, mobile, tablet, bot)
- 🤖 **Bot detection** (Googlebot, Bingbot, etc.)
- 🔒 Fully typed (TypeScript, strict mode)
- 🌍 Works in **Node.js, browsers, and workers**

**1.9 kB (minified + gzipped)** — verified via [Bundlephobia](https://bundlephobia.com/package/lightua@0.0.2).

---

## 📦 Installation

```bash
npm install lightua
```

or with pnpm / yarn:

```bash
pnpm add lightua
yarn add lightua
```

---

## 🛠️ Usage

```ts
import { UserAgent } from "lightua";

// Example: use current browser's UA string
const ua = UserAgent.parse(navigator.userAgent);

console.log(ua.browser);
// → { name: 'Chrome', version: '126.0.6478.62', major: 126, engine: 'Blink', engineVersion: '126.0.0.0' }

console.log(ua.os);
// → { name: 'macOS', version: '14.5' }

console.log(ua.device);
// → { type: 'desktop' }

console.log(ua.isBot);
// → false
```

### With a custom UA string

```ts
const googleBotUA =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

const bot = UserAgent.parse(googleBotUA);

console.log(bot.isBot);     // true
console.log(bot.device);    // { type: "bot" }
console.log(bot.browser);   // { name: "Unknown", ... }
```

---

## 📚 API Reference

### `UserAgent.parse(ua?: string): UserAgent`
Parses a user-agent string. Defaults to empty string if not provided.

#### Properties
- **`.browser`** → `BrowserInfo`
  ```ts
  {
    name: "Chrome" | "Safari" | "Firefox" | "Edge" | "Opera" |
          "Samsung Internet" | "Android Browser" | "iOS WebView" |
          "Chromium" | "Unknown",
    version: string,
    major: number,
    engine: "Blink" | "WebKit" | "Gecko" | "EdgeHTML" | "Unknown",
    engineVersion: string
  }
  ```

- **`.os`** → `OSInfo`
  ```ts
  { name: "Windows" | "macOS" | "iOS" | "Android" | "Linux" | "ChromeOS" | "Unknown",
    version: string }
  ```

- **`.device`** → `DeviceInfo`
  ```ts
  {
    type: "desktop" | "mobile" | "tablet" | "bot" | "unknown",
    brand?: string,
    model?: string
  }
  ```

- **`.isBot`** → `boolean`
- **`.isMobile`**, **`.isTablet`**, **`.isDesktop`** → convenience booleans

---

## 🔍 Detection Examples

| UA String Example | Detected Browser | OS | Device |
|-------------------|------------------|----|--------|
| Chrome on Windows | Chrome 126 (Blink) | Windows 10 | desktop |
| Safari on iPhone  | Safari 17 (WebKit) | iOS 17 | mobile (iPhone) |
| Samsung Galaxy S | Samsung Internet (Blink) | Android | mobile (Samsung) |
| Googlebot | Unknown | Unknown | bot |

---

## ⚙️ Development

Clone and install:

```bash
git clone https://github.com/amraei/lightua.git
cd lightua
npm install
```

Build:

```bash
npm run build
```

Run type-checks:

```bash
npm run typecheck
```

---

## 🚀 Release Workflow

This repo uses GitHub Actions to publish automatically to npm.

1. Bump the version:
   ```bash
   npm version patch    # or minor / major
   git push origin main --tags
   ```
2. GitHub Actions will build and publish to npm under [`lightua`](https://www.npmjs.com/package/lightua).

---

## 📄 License
MIT © [amraei](https://github.com/amraei)

---

## 💡 Inspiration
`lightua` was created as a modern, strict-typed alternative to heavier libraries like `ua-parser-js` and `useragent`, focusing on **speed, small size, and clarity**.
