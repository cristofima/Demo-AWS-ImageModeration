import { toTitleCase, truncateString } from "./helpers";

describe("helpers", () => {
  it("converts to title case", () => {
    const result = toTitleCase("hello world");
    expect(result).toBe("Hello World");
  });

  it("truncates long text", () => {
    const result = truncateString("Demo Long Text 12345", 15);
    expect(result).toBe("Demo Long Text ...");
  });
});
