import { describe, it, expect } from "vitest";
import { UserAgent } from "../src/index";

describe("browser/device sanity", () => {
  it("parses Chrome desktop basics", () => {
    const ua =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36";
    const res = UserAgent.parse(ua);
    expect(res.browser.name).not.toBe("Unknown");
    expect(res.device.type).toBe("desktop");
    expect(res.isBot).toBe(false);
  });

  it("parses Googlebot as bot", () => {
    const ua =
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
    const res = UserAgent.parse(ua);
    expect(res.isBot).toBe(true);
    expect(res.device.type).toBe("bot");
  });
});
