# GitHub Copilot Custom Instructions - Code Review for React Projects

These instructions guide GitHub Copilot when reviewing existing React code.

**I. General React Code Review Preferences:**

- **Component Structure:**
  - Check for clear separation of concerns within components.
  - Ensure components are reusable and follow a consistent structure.
  - Verify that props are passed down correctly and are well-defined with TypeScript interfaces.
- **State Management Review:**
  - Review how state is managed and updated. Ensure immutability when working with state.
  - Check for unnecessary state or overly complex state structures.
  - If Context API or a state management library is used, ensure it's implemented correctly and efficiently.
- **Styling Review:**
  - Verify that styling is consistent with the project's chosen approach (CSS Modules, Tailwind, etc.).
  - Check for unused CSS rules or potential style conflicts.
  - Ensure responsive design considerations are addressed where necessary.
- **TypeScript Review:**
  - Thoroughly review TypeScript code for type correctness and adherence to best practices.
  - Ensure all variables, props, and state are properly typed.
  - Look for opportunities to improve type safety and reduce potential runtime errors.
- **Performance Considerations:**
  - Consider potential performance bottlenecks (e.g., unnecessary re-renders).
  - Suggest using `React.memo` for functional components that receive the same props.
  - Look for opportunities to optimize event handlers or data processing.
- **Error Handling:**
  - Review how errors are handled within components and API calls.
  - Suggest displaying user-friendly error messages.
  - Consider suggesting error boundary components for catching errors in child components.
- **Accessibility (A11y):**
  - Check for basic accessibility best practices (e.g., proper use of semantic HTML, `alt` text for images, keyboard navigation).
- **Testing:**
  - Remind to include or update unit tests for new or modified components and logic.
  - Encourage testing of component behavior and state updates.

**II. Specific Project Conventions (Adapt as needed):**

- Verify that the code adheres to the following naming conventions:

* Component files: PascalCase (e.g., `UserProfile.tsx`).
* Component names: PascalCase (e.g., `UserProfile`).
* Function names: camelCase (e.g., `handleSubmit`).
* Variable names: camelCase (e.g., `isLoading`).
* Interface names: PascalCase (e.g., `User`).
* CSS Module files: `ComponentName.module.css`.

- Ensure API calls utilize the `apiClient` from `src/services/apiClient.ts`.
- Confirm that interfaces/models are located in the `src/interfaces` directory.
- Check if shared UI components are placed in the `src/components` directory.
- Verify that application-specific views (pages) are in the `src/pages` directory.
- Ensure global styles are managed in `src/styles/global.css` or `src/styles/variables.scss`.
- Confirm that custom React hooks in the `src/hooks` directory follow the `use` prefix (e.g., `useAuth`).
