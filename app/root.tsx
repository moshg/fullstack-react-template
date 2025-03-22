import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useRouteLoaderData,
} from "react-router";

import clsx from "clsx";
import {
	PreventFlashOnWrongTheme,
	ThemeProvider,
	useTheme,
} from "remix-themes";
import type { Route } from "./+types/root";
import "./app.css";
import { RootErrorBoundary } from "./features/error/root-error-boundary";
import { AppLayout } from "./features/layout";
import { themeSessionResolver } from "./server/session";

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

// Return the theme from the session storage using the loader
export async function loader({ request }: Route.LoaderArgs) {
	const { getTheme } = await themeSessionResolver(request);

	return {
		theme: getTheme(),
	};
}

// Wrap the app with ThemeProvider.
// `specifiedTheme` is the stored theme in the session storage.
// `themeAction` is the action name that's used to change the theme in the session storage.
export function Layout({ children }: { children: React.ReactNode }) {
	const loaderData = useRouteLoaderData<typeof loader>("root");

	return (
		<ThemeProvider
			specifiedTheme={loaderData?.theme ?? null}
			themeAction="/set-theme"
		>
			<LayoutWithoutProvider ssrTheme={loaderData?.theme !== null}>
				{children}
			</LayoutWithoutProvider>
		</ThemeProvider>
	);
}

function LayoutWithoutProvider({
	ssrTheme,
	children,
}: {
	ssrTheme: boolean;
	children: React.ReactNode;
}) {
	const theme = useTheme();

	return (
		<html lang="en" className={clsx(theme)}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<PreventFlashOnWrongTheme ssrTheme={ssrTheme} />
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
