// CHANGED: polyfill Web Crypto for Node test envs
import { webcrypto } from 'node:crypto';

if (!globalThis.crypto) {
  // minimal, fast polyfill for getRandomValues/subtle
  (globalThis as any).crypto = webcrypto;
}
