import { describe, it, expect } from "vitest";
import { UserAgent } from "../src/index";

const cases = [
  [
    "x86_64",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/116.0.0.0 Safari/537.36",
  ],
  [
    "x64",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0.0.0 Safari/537.36",
  ],
  [
    "Win64",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0",
  ],
  [
    "WOW64",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 Chrome/49.0.2623.112 Safari/537.36",
  ],
  [
    "amd64",
    "curl/7.68.0 (x86_64-pc-linux-gnu) libcurl/7.68.0 zlib/1.2.11 OpenSSL/1.1.1f",
  ],
  [
    "arm64",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5; arm64) AppleWebKit/605.1.15 Version/17.5 Safari/605.1.15",
  ],
  [
    "aarch64",
    "Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36",
  ],
] as const;

describe("64-bit detection tokens", () => {
  for (const [label, ua] of cases) {
    it(`flags is64Bit=true for ${label}`, () => {
      const res = UserAgent.parse(ua);
      expect((res.os as any).is64Bit).toBe(true);
    });
  }
});
