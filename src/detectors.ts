import { has, normVer, toInt, winVersionName } from "./helpers";
import {
  BrowserInfo,
  BrowserName,
  DeviceInfo,
  EngineName,
  OSInfo,
  OSName,
} from "./types";

// ---------- regex ----------
const rx = {
  chrome: /\bChrome\/(\d[\d.]+)/,
  edgeChromium: /\bEdg\/(\d[\d.]+)/,
  firefox: /\bFirefox\/(\d[\d.]+)/,
  safari: /\bVersion\/(\d[\d.]+)\s+Safari\//,
  iosSafari: /\bCPU.*OS\s(\d[_\d]*)\s.*AppleWebKit\/.*Safari\//,
  opera: /\bOPR\/(\d[\d.]+)/,
  samsung: /\bSamsungBrowser\/(\d[\d.]+)/,
  androidBrowser:
    /\bVersion\/(\d[\d.]+)\s+Chrome\/\d.*\bwv\b|\bVersion\/(\d[\d.]+)\s+Mobile Safari\/\d/,
  iosWebView: /\bAppleWebKit\/(\d[\d.]+)\b(?!.*Safari\/)/,
  chromium: /\bChromium\/(\d[\d.]+)/,

  appleWebKit: /\bAppleWebKit\/(\d[\d.]+)/,
  gecko: /\bGecko\/\d{8,}\b.*\bFirefox\/(\d[\d.]+)/,
  blinkHint: /\bChrome\/|Chromium\/|Edg\/|OPR\/|SamsungBrowser\//,

  windows: /\bWindows NT (\d[\d.]*)/,
  macos: /\bMac OS X (\d[_\d]*)/,
  ios: /\b(?:iPhone|iPad|iPod).*OS (\d[_\d]*)/,
  android: /\bAndroid (\d[\d.]*)/,
  chromeOS: /\bCrOS [a-zA-Z0-9_]+ (\d[\d.]*)/,

  ipad: /\biPad\b/,
  iphone: /\biPhone\b/,
  androidTablet: /\bAndroid\b(?!.*Mobile)/,
  androidMobile: /\bAndroid.*\bMobile\b/,
  samsungBrand: /\bSM-([A-Z0-9-]+)/,
  huaweiBrand: /\b(HUAWEI|HONOR)[ -]?([A-Z0-9-]+)/,
  xiaomiBrand: /\b(MI |Redmi |POCO )([A-Z0-9-]+)/,

  botHint: /\b(bot|spider|crawler|fetch|slurp|scrape|httpclient|monitoring)\b/i,
  botVendors:
    /\b(googlebot|bingbot|duckduckbot|baiduspider|yandexbot|applebot|facebookexternalhit|twitterbot|linkedinbot|discordbot|slackbot|ahrefsbot|semrushbot|mj12bot|datadog|newrelic|uptime|gtmetrix)\b/i,
} as const;

// ---------- core detectors ----------
export function detectBrowser(ua: string, osName: OSName): BrowserInfo {
  let m: RegExpExecArray | null;

  if ((m = rx.edgeChromium.exec(ua)))
    return withEngine("Edge", m?.[1] ?? "", detectEngine(ua));
  if ((m = rx.opera.exec(ua)))
    return withEngine("Opera", m?.[1] ?? "", detectEngine(ua));
  if ((m = rx.samsung.exec(ua)))
    return withEngine("Samsung Internet", m?.[1] ?? "", detectEngine(ua));
  if ((m = rx.firefox.exec(ua)))
    return withEngine("Firefox", m?.[1] ?? "", detectEngine(ua));

  if (osName === "iOS") {
    if (rx.iosWebView.test(ua) && !has(ua, "Safari/")) {
      const ev = rx.appleWebKit.exec(ua);
      const ver = ev?.[1] ?? "";
      return withEngine("iOS WebView", ver, {
        engine: "WebKit",
        engineVersion: ver,
      });
    }
    const s = rx.safari.exec(ua) || rx.iosSafari.exec(ua);
    if (s)
      return withEngine("Safari", s[1] ? normVer(s[1]) : "", detectEngine(ua));
  }

  if ((m = rx.chrome.exec(ua))) {
    if (osName === "Android" && /; wv\)/.test(ua)) {
      const v = rx.androidBrowser.exec(ua);
      return withEngine(
        "Android Browser",
        v?.[1] ?? v?.[2] ?? "",
        detectEngine(ua)
      );
    }
    return withEngine("Chrome", m?.[1] ?? "", detectEngine(ua));
  }

  if ((m = rx.chromium.exec(ua)))
    return withEngine("Chromium", m?.[1] ?? "", detectEngine(ua));
  if ((m = rx.safari.exec(ua)))
    return withEngine("Safari", m?.[1] ?? "", detectEngine(ua));

  return withEngine("Unknown", "", detectEngine(ua));
}

export function detectEngine(ua: string): {
  engine: EngineName;
  engineVersion: string;
} {
  let m: RegExpExecArray | null;
  if ((m = rx.gecko.exec(ua)))
    return { engine: "Gecko", engineVersion: m?.[1] ?? "" };

  if ((m = rx.appleWebKit.exec(ua))) {
    const ver = m?.[1] ?? "";
    if (rx.blinkHint.test(ua)) return { engine: "Blink", engineVersion: ver };
    return { engine: "WebKit", engineVersion: ver };
  }

  if (has(ua, "Edge/") || has(ua, "Trident/") || has(ua, "MSIE "))
    return { engine: "EdgeHTML", engineVersion: "" };

  return { engine: "Unknown", engineVersion: "" };
}

export function detectOS(ua: string): OSInfo {
  let m: RegExpExecArray | null;
  const is64 = /\b(?:x86_64|x64|Win64|WOW64|amd64|arm64|aarch64)\b/i.test(ua);

  if ((m = rx.windows.exec(ua)))
    return {
      name: "Windows",
      version: winVersionName(normVer(m[1])),
      is64Bit: is64,
    };

  if ((m = rx.ios.exec(ua)))
    return { name: "iOS", version: normVer(m[1]), is64Bit: is64 };

  if ((m = rx.macos.exec(ua)))
    return { name: "macOS", version: normVer(m[1]), is64Bit: is64 };

  if ((m = rx.android.exec(ua)))
    return { name: "Android", version: normVer(m[1]), is64Bit: is64 };

  if ((m = rx.chromeOS.exec(ua)))
    return { name: "ChromeOS", version: normVer(m[1]), is64Bit: is64 };

  // ---- Linux & distros ----
  const l = ua.toLowerCase();

  // Order matters: check more specific / common vendor tokens first
  // Uses substring checks only for performance.
  const distro: OSName | null =
    (l.includes("ubuntu") && "Ubuntu") ||
    (l.includes("pop!_os") || l.includes("popos") ? "Pop!_OS" : null) ||
    (l.includes("linux mint") && "Linux Mint") ||
    (l.includes("fedora") && "Fedora") ||
    (l.includes("debian") && "Debian") ||
    (l.includes("arch") && "Arch") ||
    (l.includes("manjaro") && "Manjaro") ||
    ((l.includes("opensuse") || l.includes("open suse")) && "openSUSE") ||
    (l.includes("suse") && "SUSE") ||
    (l.includes("centos") && "CentOS") ||
    (l.includes("red hat") || l.includes("redhat") || l.includes("rhel")
      ? "Red Hat"
      : null) ||
    (l.includes("elementary") && "elementary OS") ||
    (l.includes("kali") && "Kali Linux") ||
    (l.includes("zorin") && "Zorin OS") ||
    (l.includes("deepin") && "Deepin") ||
    (l.includes("gentoo") && "Gentoo") ||
    (l.includes("endeavouros") && "EndeavourOS") ||
    null;

  if (l.includes("linux") || distro) {
    return {
      name: distro ?? "Linux",
      version: "",
      is64Bit: is64,
    };
  }

  return { name: "Unknown", version: "", is64Bit: is64 };
}

export function detectDevice(ua: string, osName: OSName): DeviceInfo {
  if (
    rx.botHint.test(ua) ||
    rx.botVendors.test(ua) ||
    has(ua, "HeadlessChrome")
  )
    return { type: "bot" };
  if (rx.ipad.test(ua))
    return { type: "tablet", brand: "Apple", model: "iPad" };
  if (rx.iphone.test(ua))
    return { type: "mobile", brand: "Apple", model: "iPhone" };
  if (osName === "Android") {
    if (rx.androidTablet.test(ua)) return brandModel({ type: "tablet" }, ua);
    if (rx.androidMobile.test(ua)) return brandModel({ type: "mobile" }, ua);
    return brandModel({ type: "mobile" }, ua);
  }
  if (osName === "ChromeOS")
    return { type: "desktop", brand: "Google", model: "Chromebook" };
  return { type: "desktop" };
}

export function detectBot(ua: string): boolean {
  return (
    rx.botHint.test(ua) ||
    rx.botVendors.test(ua) ||
    has(ua, "HeadlessChrome") ||
    has(ua, "Google-HTTP-Java-Client")
  );
}

export function brandModel(base: DeviceInfo, ua: string): DeviceInfo {
  let m: RegExpExecArray | null;

  if ((m = rx.samsungBrand.exec(ua))) {
    const model = m?.[1];
    return model
      ? { ...base, brand: "Samsung", model }
      : { ...base, brand: "Samsung" };
  }

  if ((m = rx.huaweiBrand.exec(ua))) {
    const brand = m?.[1] === "HUAWEI" ? "Huawei" : "Honor";
    const model = m?.[2];
    return model ? { ...base, brand, model } : { ...base, brand };
  }

  if ((m = rx.xiaomiBrand.exec(ua))) {
    const raw = m?.[1];
    const brand = raw ? raw.trim().replace(/\s+/, "") : undefined;
    const model = m?.[2];
    if (brand && model) return { ...base, brand, model };
    if (brand) return { ...base, brand };
    return base;
  }

  return base;
}

export function withEngine(
  name: BrowserName,
  version: string,
  eng: { engine: EngineName; engineVersion: string }
): BrowserInfo {
  const v = normVer(version);
  const major = v ? toInt(v.split(".")[0]!) : 0;
  return {
    name,
    version: v,
    major,
    engine: eng.engine,
    engineVersion: eng.engineVersion,
  };
}
