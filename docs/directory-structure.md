# Directory Structure

## Root Directory

- `app/`: Main application code (detailed in the [App Directory section](#app-directory) below)
- `docs/`: Project documentation
- `e2e/`: End-to-end tests using Playwright
- `public/`: Static assets served directly by the web server

## App Directory

- `components/`: Reusable UI components
- `config/`: Application configuration files. Can only be accessed from routes
- `features/`: Feature-specific code organized by domain (detailed in the [Features Directory section](#features-directory) below)
- `lib/`: Utility functions and shared code
- `routes/`: Application routing logic
- `server/`: Server infrastructure code including database and logger implementations
- `root.tsx`: Root component and application entry point
- `routes.ts`: Route definitions. Only specifies file-based routing configuration
- `app.css`: Global styles

### Features Directory

- `<feature>/`: Feature-specific code
  - `shared/`: Business logic that is not specific to a usecase. Can be accessed from other `features/` directories
    - `models/`: Define types and functions representing business logic
    - `server/`: Define server-side logic. Database connections and other resources are received as a `ServerContext` type parameter
  - `<usecase>/`: Usecase-specific code. Cannot be accessed from directories other than the corresponding `routes/` directory
    - `components/`: Usecase-specific components
    - `models/`: Usecase-specific types and functions
    - `action.ts`: Route action
    - `component.tsx`: Route component
    - `loader.ts`: Route loader
## Configuration Files

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

## Development Files

- `.env.sample`: Template for environment variables
- `.dockerignore`: Files to exclude from Docker builds
- `.gitignore`: Files to exclude from Git
- `.node-version`: Node.js version specification
