# fullstack-react-template

## Application Structure

### Technology Stack

| Category            | Technology                                       |
| ------------------- | ------------------------------------------------ |
| **Runtime**         | [Node.js](https://nodejs.org)                    |
| **Package Manager** | [pnpm](https://pnpm.io)                          |
| **Framework**       | [React Router](https://reactrouter.com)          |
| **UI Components**   | [shadcn/ui](https://ui.shadcn.com)               |
| **Database ORM**    | [Drizzle ORM](https://orm.drizzle.team)          |
| **Form Management** | [conform](https://conform.guide)                 |
| **Logging**         | [winston](https://github.com/winstonjs/winston)  |
| **Error Handling**  | [option-t](https://github.com/option-t/option-t) |
| **E2E Test**        | [Playwright](https://playwright.dev)             |

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

Copy the `.env.example` file to `.env` and set the environment variables:

```bash
cp .env.example .env
```

Create a database:

```bash
pnpm db:migrate
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

### Database Migrations

This template adopts a strategy where migration scripts are generated using `drizzle-kit generate` and migrations are executed with `drizzle-kit migrate`.
Other migration strategies are explained on [Drizzle migrations fundamentals](https://orm.drizzle.team/docs/migrations).
