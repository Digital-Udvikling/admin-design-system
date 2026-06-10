import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";

afterEach(() => {
  cleanup();
});

// Hides the admin class prefix from tests so a prefix rename doesn't ripple
// through every assertion; `adminSelector` covers querySelector sites.
const ADMIN_PREFIX = "_ao-";

export const adminSelector = (name: string): string => `.${ADMIN_PREFIX}${name}`;

expect.extend({
  toHaveAdminClass(received: Element, ...names: string[]) {
    if (!(received instanceof Element)) {
      return {
        pass: false,
        message: () => `expected an Element, got ${typeof received}`,
      };
    }
    const expected = names.map((n) => `${ADMIN_PREFIX}${n}`);
    const actual = Array.from(received.classList);
    const missing = expected.filter((c) => !actual.includes(c));
    const pass = missing.length === 0;
    return {
      pass,
      message: () =>
        pass
          ? `expected element not to carry admin classes ${expected.join(" ")}\nactual classList: ${actual.join(" ")}`
          : `expected element to carry admin classes ${expected.join(" ")}; missing: ${missing.join(" ")}\nactual classList: ${actual.join(" ")}`,
    };
  },
});

declare module "vitest" {
  // `T = any` must match jest-dom's `Assertion<T = any>` augmentation, or TS2428.
  interface Assertion<T = any> {
    toHaveAdminClass(...names: string[]): T;
  }
  interface AsymmetricMatchersContaining {
    toHaveAdminClass(...names: string[]): unknown;
  }
}
