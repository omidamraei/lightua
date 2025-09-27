import { detectBot, detectBrowser, detectDevice, detectOS } from "./detectors";
import { BrowserInfo, DeviceInfo, OSInfo } from "./types";

export default class UserAgent {
  private _os?: OSInfo;
  private _device?: DeviceInfo;
  private _browser?: BrowserInfo;
  private _isBot?: boolean;

  private constructor(public source: string) {}

  get os(): OSInfo {
    if (!this._os) this._os = detectOS(this.source);
    return this._os;
  }

  get isBot(): boolean {
    if (this._isBot === undefined) this._isBot = detectBot(this.source);
    return this._isBot;
  }

  get device(): DeviceInfo {
    if (this._device) return this._device;
    if (this.isBot) return (this._device = { type: "bot" });
    return (this._device = detectDevice(this.source, this.os.name));
  }

  get browser(): BrowserInfo {
    if (!this._browser)
      this._browser = detectBrowser(this.source, this.os.name);
    return this._browser;
  }

  get isMobile() {
    return this.device.type === "mobile";
  }
  get isTablet() {
    return this.device.type === "tablet";
  }
  get isDesktop() {
    return this.device.type === "desktop";
  }

  static parse(ua: string = ""): UserAgent {
    return new UserAgent(ua);
  }
}
