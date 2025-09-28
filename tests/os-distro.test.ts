import { describe, it, expect } from "vitest";
import { UserAgent } from "../src/index";

describe("OS distro detection", () => {
  it("detects Ubuntu + 64-bit from Firefox UA", () => {
    const ua =
      "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0";
    const res = UserAgent.parse(ua);

    expect(res.os.name).toBe("Ubuntu");
    // if your struct is res.os.is64Bit
    expect((res.os as any).is64Bit).toBe(true);
  });

  it("falls back to Linux when no known distro token exists", () => {
    const ua =
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36";
    const res = UserAgent.parse(ua);

    expect(res.os.name).toBe("Linux");
    expect((res.os as any).is64Bit).toBe(true);
  });

  it("detects Fedora token", () => {
    const ua =
      "Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:115.0) Gecko/20100101 Firefox/115.0";
    const res = UserAgent.parse(ua);

    expect(res.os.name).toBe("Fedora");
    expect((res.os as any).is64Bit).toBe(true);
  });

  it("detects Debian on Chromium UA", () => {
    const ua =
      "Mozilla/5.0 (X11; Linux x86_64; Debian) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36";
    const res = UserAgent.parse(ua);

    expect(res.os.name).toBe("Debian");
    expect((res.os as any).is64Bit).toBe(true);
  });
});
