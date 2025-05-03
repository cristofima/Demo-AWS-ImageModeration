# GitHub Copilot Custom Instructions - Test Generation for React Projects (Unit Tests)

These instructions guide GitHub Copilot when generating unit tests for React components and functions.

**I. General Testing Preferences:**

- **Testing Library:**
  - "Prefer using React Testing Library for testing React components."
  - "Avoid suggesting Enzyme unless explicitly asked or if the existing codebase heavily relies on it."
- **Test Runner:**
  - "Assume the project uses Vitest as the test runner."
- **Test File Location:**
  - "Place test files (`.test.tsx` or `.spec.tsx`) in the same directory as the component or function being tested."
- **Test Structure:**
  - "Organize tests using `describe` blocks to group related test cases."
  - "Use `it` or `test` blocks to define individual test cases."
- **Test Coverage:**
  - "Aim for high test coverage, focusing on testing component behavior, not implementation details."
  - "Prioritize testing user interactions, state updates, and rendering logic."
- **Test Principles:**
  - "Write tests that are readable, maintainable, and focused on a single concern."
  - "Follow the Arrange-Act-Assert (AAA) pattern."
- **Component Testing:**
  - "When testing components, use `render` from React Testing Library to render the component."
  - "Use `screen.getByRole`, `screen.getByLabelText`, `screen.getByText`, `screen.getByTestId`, and other queries to find elements in the rendered output."
  - "Use `fireEvent` to simulate user interactions (e.g., clicks, input changes)."
  - "Assert that the component renders the correct output, updates state as expected, and handles events correctly."
- **Hook Testing:**
  - "When testing custom hooks, use a helper component to render the hook within a component tree."
  - "Test the hook's behavior in different scenarios and with different inputs."
- **Service/Utility Function Testing:**
  - "When testing service functions (e.g., API calls) or utility functions, mock any external dependencies (e.g., `axios`)."
  - "Test the function's return value, side effects, and error handling."
- **Mocking:**
  - "Use `vi.fn()` to create mock functions."
  - "Use `vi.mock()` to mock modules."
  - "Avoid over-mocking. Only mock dependencies that are external to the unit being tested."

**II. Test Generation Guidelines:**

- "For a new component, generate a basic test file with a `describe` block and a few initial test cases (e.g., 'renders without crashing', 'renders the main content')."
- "When modifying an existing component, suggest adding or updating tests to cover the changes."
- "When generating tests, use clear and descriptive names for `describe` and `it` blocks."
- "Include comments in the test code to explain the purpose of each test case."
- "Generate tests that handle different scenarios, including success cases, error cases, and edge cases."

**III. Example Test Structure:**

```typescript
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MyComponent from "./MyComponent"; // Adjust the path

describe("MyComponent", () => {
  it("renders without crashing", () => {
    render(<MyComponent />);
    expect(screen.getByText("My Component")).toBeInTheDocument();
  });

  it("displays the initial count", () => {
    render(<MyComponent initialCount={5} />);
    expect(screen.getByText("Count: 5")).toBeInTheDocument();
  });

  it("increments the count when the button is clicked", () => {
    render(<MyComponent />);
    const incrementButton = screen.getByRole("button", { name: "Increment" });
    fireEvent.click(incrementButton);
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
  });

  // Add more test cases as needed
});
```
