# GitHub Copilot Custom Instructions - Project Structure for React Projects

These instructions inform GitHub Copilot about the expected file and folder structure in this React project.

- **Root Directory:** All project-related files and folders are within the root directory.
- **`public/`:** Contains static assets served directly by the web server (e.g., `index.html`, images).
- **`src/`:** Contains the main source code of the React application.
  - `App.tsx`: The root component of the application.
  - `index.tsx`: The entry point of the application, rendering the root component.
  - `assets/`: Contains static assets managed within the application.
    - `images/`: Image files.
    - `icons/`: SVG or other icon files.
  - `components/`: Reusable UI components shared across the application. Each component typically has its own folder containing the `.tsx` file and any related style files (`.module.css`, `.scss`), and test files (`.test.tsx`).
  - `config/`: Application-wide configuration files (e.g., `apiConfig.ts`).
  - `hooks/`: Custom React hooks. Filenames should start with `use` (e.g., `useAuth.ts`).
  - `interfaces/`: TypeScript interfaces and types (models) for data structures (e.g., `User.ts`, `Product.ts`).
  - `layouts/`: Layout components that provide a consistent UI structure for different pages.
  - `pages/`: Application views or screens. Each page typically has its own folder containing the `.tsx` file and related styles.
  - `services/`: Contains logic for interacting with APIs and other data sources.
    - `api/`: Contains the Axios instance and interceptor configurations (`apiClient.ts`, `requestInterceptor.ts`, `responseInterceptor.ts`).
    - `authService.ts`: Authentication-related API calls.
    - `productService.ts`: Product-related API calls.
  - `styles/`: Global styles and theming.
    - `global.css`: Global CSS styles.
    - `theme.ts`: JavaScript/TypeScript theme configuration.
    - `variables.scss`: Global style variables (colors, fonts, etc.).
  - `utils/`: Utility functions that are reusable across the application (e.g., `helpers.ts`).
- `.env`: Environment variables for the application.
- `.gitignore`: Specifies intentionally untracked files that Git should ignore.
- `package.json`: Contains metadata about the project and its dependencies.
- `README.md`: Provides a description of the project.
- `tsconfig.json`: TypeScript configuration file.

When generating or reviewing code, please adhere to this project structure.
