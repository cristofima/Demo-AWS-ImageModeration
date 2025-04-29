# GitHub Copilot Custom Instructions - Code Generation for React Projects

These instructions guide GitHub Copilot when generating new React code.

**I. General React Code Generation Preferences:**

- **Component Type Preference:**
  - Prefer functional components with hooks over class components for new code.
  - When generating components, default to using arrow function syntax.
- **State Management:**
  - For local component state, use the `useState` hook.
  - When generating code that might require shared state, consider suggesting Context API or a state management library like Zustand (if applicable to this project).
  - Avoid suggesting Redux unless explicitly asked or if the existing codebase heavily relies on it.
- **Styling Approach:**
  - For component-specific styling, prefer CSS Modules (`.module.css` or `.module.scss`).
  - If Tailwind CSS is used in the project, utilize its utility classes for styling.
  - Avoid inline styles unless for very simple, dynamic styling.
- **TypeScript Usage:**
  - Always generate React code using TypeScript syntax (`.tsx`).
  - When creating components, define prop interfaces explicitly.
  - Ensure that state variables and their update functions are properly typed with `useState<Type>(...)`.
  - When fetching data, define interfaces for the expected API response.
- **JSX Syntax:**
  - Use concise and readable JSX syntax.
  - When mapping over arrays, ensure each element has a unique `key` prop.
  - Prefer using fragments (`<>` and `</>`) when wrapping multiple elements without adding an extra DOM node.
- **Event Handling:**
  - When generating event handlers, use arrow functions to avoid issues with `this` binding.
  - Properly type event handler arguments (e.g., `(event: React.ChangeEvent<HTMLInputElement>) => void`).
- **Imports:**
  - Organize imports alphabetically.
  - Remove unused import statements.
  - Group imports by source (e.g., React, local modules, third-party libraries).

**II. Specific Project Conventions (Adapt as needed):**

- This project uses the following naming conventions:

* Component files: PascalCase (e.g., `UserProfile.tsx`).
* Component names: PascalCase (e.g., `UserProfile`).
* Function names: camelCase (e.g., `handleSubmit`).
* Variable names: camelCase (e.g., `isLoading`).
* Interface names: PascalCase (e.g., `User`).
* CSS Module files: `ComponentName.module.css`.

- When generating API calls, use the `apiClient` from `src/services/apiClient.ts`.
- All interfaces/models should be located in the `src/interfaces` directory.
- Shared UI components should reside in the `src/components` directory.
- Application-specific views (pages) should be placed in the `src/pages` directory.
- Global styles are located in `src/styles/global.css` or `src/styles/variables.scss`.
- Custom React hooks should be in the `src/hooks` directory and follow the `use` prefix (e.g., `useAuth`).
