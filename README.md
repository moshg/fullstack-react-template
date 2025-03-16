# fullstack-react-template

## Application Structure

### Technology Stack

- **Framework**: React Router
- **UI Components**: shadcn/ui
- **Database ORM**: Drizzle ORM
- **Form Management**: conform

### Directory Structure

See [Directory Structure Documentation](/docs/directory-structure.md).

### Error Handling

See [Error Handling Documentation](/docs/error-handling.md).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org)
- [pnpm](https://pnpm.io)
- [Lefthook](https://lefthook.dev/)

### Installation

Install the dependencies and set up lefthook:

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
