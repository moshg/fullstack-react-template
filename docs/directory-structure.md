# Directory Structure

## Root Directory

- `app/`: Main application code (detailed in the [App Directory section](#app-directory) below)
- `docs/`: Project documentation
- `drizzle/`: Database migration files generated by Drizzle ORM
- `e2e/`: End-to-end tests using Playwright
- `public/`: Static assets served directly by the web server

## App Directory

- `components/`: Reusable UI components
- `config/`: Application configuration files. Can only be accessed from routes
- `features/`: Feature-specific code organized by domain (detailed in the [Features Directory section](#features-directory) below)
- `core/`: Core business logic and infrastructure code
  - `shared/`: Domain models and business rules shared across client and server
  - `client/`: Client-side API clients
  - `server/`: Server-side infrastructure implementations
- `routes/`: Application routing logic
- `utils/`: General utility functions
- `root.tsx`: Root component and application entry point
- `routes.ts`: Route definitions. Only specifies file-based routing configuration
- `app.css`: Global styles

### Features Directory

- `<feature>/`: Feature-specific code
  - `<usecase>/`: Usecase-specific code. Cannot be accessed from directories other than the corresponding `routes/` directory
    - `components/`: Usecase-specific components
    - `models/`: Usecase-specific types and functions
    - `action.ts`: Route action
    - `component.tsx`: Route component
    - `loader.ts`: Route loader

## Configuration Files

- `.env.example`: Template for environment variables
- `.dockerignore`: Files to exclude from Docker builds
- `.gitignore`: Files to exclude from Git
- `.node-version`: Node.js version specification
- `biome.json`: Biome configuration for linting and formatting
- `commitlint.config.js`: Commitlint configuration for enforcing commit message conventions
- `components.json`: shadcn/ui components configuration
- `compose.yaml`: Docker Compose configuration
- `drizzle.config.ts`: Drizzle ORM configuration
- `lefthook.yml`: Lefthook configuration for managing Git hooks
- `playwright.config.ts`: Playwright test configuration
- `react-router.config.ts`: React Router configuration
- `tsconfig.json`: TypeScript configuration
- `vite.config.ts`: Vite bundler configuration
- `Dockerfile`: Docker container configuration
- `package.json`: Project dependencies and scripts
- `pnpm-lock.yaml`: Dependency lock file
