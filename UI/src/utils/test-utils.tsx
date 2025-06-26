import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Create a custom render function that includes providers
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
  withRouter?: boolean;
}

const customRender = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  const {
    queryClient = createQueryClient(),
    withRouter = true,
    ...renderOptions
  } = options;

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const content = (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    if (withRouter) {
      return <BrowserRouter>{content}</BrowserRouter>;
    }

    return content;
  };

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
};

// Mock toast functions
export const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
};

// Mock IntersectionObserver if not already mocked
global.IntersectionObserver ??= vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: "",
  thresholds: [],
  takeRecords: vi.fn(() => []),
}));

// Re-export testing library functions
export {
  screen,
  waitFor,
  fireEvent,
  act,
  renderHook,
  cleanup,
} from "@testing-library/react";
export type { RenderResult } from "@testing-library/react";
export { customRender as render, createQueryClient };
