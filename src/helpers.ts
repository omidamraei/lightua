export const toInt = (s: string): number => {
  const n = s.length ? Number.parseInt(s, 10) : NaN;
  return Number.isNaN(n) ? 0 : n;
};

export const normVer = (s: string | undefined): string =>
  s ? s.replace(/_/g, ".") : "";

export const has = (ua: string, token: string): boolean =>
  ua.indexOf(token) !== -1;

export const winVersionName = (nt: string): string => {
  switch (nt) {
    case "10.0":
      return "10";
    case "6.3":
      return "8.1";
    case "6.2":
      return "8";
    case "6.1":
      return "7";
    case "6.0":
      return "Vista";
    case "5.1":
      return "XP";
    default:
      return nt;
  }
};
