import "@testing-library/jest-dom/vitest";
import { vi, afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";
import React from "react";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

beforeEach(() => {
  vi.resetModules();
});

// Mock IntersectionObserver
vi.stubGlobal(
  "IntersectionObserver",
  vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    root: null,
    rootMargin: "",
    thresholds: [],
    takeRecords: vi.fn(() => []),
  }))
);

// Mock react-toastify
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
  ToastContainer: () => null,
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: "div",
    span: "span",
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock react-router-dom
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    BrowserRouter: ({ children }: { children: React.ReactNode }) =>
      React.createElement("div", {}, children),
    useNavigate: () => vi.fn(),
    useLocation: () => ({
      pathname: "/gallery",
      search: "",
      hash: "",
      state: null,
      key: "test",
    }),
  };
});
