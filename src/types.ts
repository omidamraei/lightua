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
  | "ChromeOS"
  | "Ubuntu"
  | "Debian"
  | "Fedora"
  | "Arch"
  | "Manjaro"
  | "openSUSE"
  | "SUSE"
  | "CentOS"
  | "Red Hat"
  | "Linux Mint"
  | "elementary OS"
  | "Pop!_OS"
  | "Kali Linux"
  | "Zorin OS"
  | "Deepin"
  | "Gentoo"
  | "EndeavourOS"
  | "Linux"
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
  is64Bit?: boolean;
}

export interface DeviceInfo {
  type: DeviceType;
  brand?: string;
  model?: string;
}
