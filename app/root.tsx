import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { getServerContext } from "./config/context";
import { RootErrorBoundary } from "./features/error/root-error-boundary";
import { AppLayout } from "./features/layout";
import { serverContext } from "./server/context";

const contextMiddleware: Route.unstable_MiddlewareFunction = async (
	{ context },
	next,
) => {
	const ctx = getServerContext();
	context.set(serverContext, ctx);

	const res = await next();

	return res;
};

export const unstable_middleware = [contextMiddleware];

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return (
		<AppLayout>
			<Outlet />
		</AppLayout>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	return <RootErrorBoundary error={error} />;
}
