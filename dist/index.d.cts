type BrowserName = "Chrome" | "Safari" | "Firefox" | "Edge" | "Opera" | "Samsung Internet" | "Android Browser" | "iOS WebView" | "Chromium" | "Unknown";
type EngineName = "Blink" | "WebKit" | "Gecko" | "EdgeHTML" | "Unknown";
type OSName = "Windows" | "macOS" | "iOS" | "Android" | "Linux" | "ChromeOS" | "Unknown";
type DeviceType = "desktop" | "mobile" | "tablet" | "bot" | "unknown";
interface BrowserInfo {
    name: BrowserName;
    version: string;
    major: number;
    engine: EngineName;
    engineVersion: string;
}
interface OSInfo {
    name: OSName;
    version: string;
}
interface DeviceInfo {
    type: DeviceType;
    brand?: string;
    model?: string;
}

declare class UserAgent {
    source: string;
    private _os?;
    private _device?;
    private _browser?;
    private _isBot?;
    private constructor();
    get os(): OSInfo;
    get isBot(): boolean;
    get device(): DeviceInfo;
    get browser(): BrowserInfo;
    get isMobile(): boolean;
    get isTablet(): boolean;
    get isDesktop(): boolean;
    static parse(ua?: string): UserAgent;
}

export { type BrowserInfo, type BrowserName, type DeviceInfo, type DeviceType, type EngineName, type OSInfo, type OSName, UserAgent };
