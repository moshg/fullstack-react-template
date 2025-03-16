import { isRouteErrorResponse } from "react-router";

export function RootErrorBoundary({ error }: { error: unknown }) {
	let message: string;
	let details: string;
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		if (error.status === 404) {
			message = "404";
			details = "The requested page could not be found.";
		} else {
			message = "Error";
			details = error.statusText || "An unexpected error occurred.";
		}
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		message = "Oops!";
		details = error.message;
		stack = error.stack;
	} else {
		message = "Oops!";
		details = "An unexpected error occurred.";
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
