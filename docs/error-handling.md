# Error Handling

## Basic Policy

The application handles errors in two categories:

1. Expected Errors
2. Unexpected Errors

### Expected Errors

Expected errors are handled using the [option-t](https://github.com/option-t/option-t) library's Result type in server functions, which return `Result<T, Error>`, and in actions by returning errors to the client using Conform's `submission.reply()`. These include:

- Form validation errors
- Entity constraints (e.g., uniqueness violations)
- Not found errors

option-t example: [create category function](/app/features/categories/shared/server/create-category.ts)

conform example: [create category action](/app/features/categories/new/action.ts)

### Unexpected Errors

Unexpected errors are thrown and caught by ErrorBoundary. These include:

- Database connection errors
- Network errors
- Runtime errors
- Any other unhandled errors

Example:

```ts
export async function loader() {
  try {
    const data = await getData();
    return { data };
  } catch (error) {
    throw new Error("Unexpected error occurred", { cause: error });
  }
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  
  return (
    <div>
      <h1>Error</h1>
      <p>An unexpected error occurred. Please try again later.</p>
    </div>
  );
}
```

## Component Errors

React component errors are caught by the nearest ErrorBoundary
