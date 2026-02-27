import { describe, expect, it } from "vitest";

describe("test baseline", () => {
  it("runs a basic smoke assertion", () => {
    expect(1 + 1).toBe(2);
  });
});
