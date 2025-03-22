import { AppErrorBoundary } from "~/features/error/app-error-boundary";
import type { Route } from "./+types/_app.books";

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	return <AppErrorBoundary error={error} />;
}
