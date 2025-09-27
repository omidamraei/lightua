export type BrowserName =
  | "Chrome"
  | "Safari"
  | "Firefox"
  | "Edge"
  | "Opera"
  | "Samsung Internet"
  | "Android Browser"
  | "iOS WebView"
  | "Chromium"
  | "Unknown";

export type EngineName = "Blink" | "WebKit" | "Gecko" | "EdgeHTML" | "Unknown";

export type OSName =
  | "Windows"
  | "macOS"
  | "iOS"
  | "Android"
  | "Linux"
  | "ChromeOS"
  | "Unknown";

export type DeviceType = "desktop" | "mobile" | "tablet" | "bot" | "unknown";

export interface BrowserInfo {
  name: BrowserName;
  version: string;
  major: number;
  engine: EngineName;
  engineVersion: string;
}

export interface OSInfo {
  name: OSName;
  version: string;
}

export interface DeviceInfo {
  type: DeviceType;
  brand?: string;
  model?: string;
}
