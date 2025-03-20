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
| **Database**        | [PostgreSQL](https://www.postgresql.org)         |

### Directory Structure

See [Directory Structure Documentation](/docs/directory-structure.md).

### Error Handling

See [Error Handling Documentation](/docs/error-handling.md).

## Specification

See [Specification Documentation](/docs/specification.md).

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

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker compose build

# Run the container
docker compose up
```

## Database Schema Changes

When modifying your database schema, follow these steps:

1. Generate migration scripts based on your schema definitions:

```bash
pnpm db:generate
```

2. Run the generated migration scripts:

```bash
pnpm db:migrate
```

For other migration strategies, please refer to [Drizzle migrations fundamentals](https://orm.drizzle.team/docs/migrations).
