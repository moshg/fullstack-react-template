# fullstack-react-template

## Application Structure

### Technology Stack

- **Framework**: React Router
- **UI Components**: shadcn/ui
- **Database ORM**: Drizzle ORM
- **Form Management**: conform

### Directory Structure

This project is a full-stack React application using React Router. Below is the structure of the `app` directory and the role of each part:

- **components**: Stores reusable UI components. shadcn/ui-based components are in the `ui` subdirectory.
- **config**: Manages application settings. Includes database connections, environment variables, and context settings. Can only be accessed from the root component.
- **db**: Defines database schemas and queries using Drizzle ORM.
- **lib**: Provides utility functions and helpers.
- **routes**: Defines the application's route structure using React Router.
- **root.tsx**: The root component that serves as the entry point for the application.
- **routes.ts**: Defines the application's routing configuration.

## Getting Started

### Installation

Install the dependencies:

```bash
pnpm install
```

### Development

Start the development server with HMR:

```bash
pnpm dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
pnpm build
```

## Database Schema Changes

When you modify your database schema, you need to push the changes to your database:

```bash
pnpm drizzle-kit push
```

This command will update your database schema according to the changes you've made in your Drizzle ORM schema definitions.

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker compose build

# Run the container
docker compose up
```
