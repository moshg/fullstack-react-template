import { Outlet, redirect } from "react-router";
import { auth } from "~/config/context";
import { AppLayout } from "~/features/layout";
import { p } from "~/lib/path";
import type { Route } from "./+types/_app";

export async function loader({ request }: Route.LoaderArgs) {
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session?.user) {
		return redirect(p("/signin"), { status: 303 });
	}

	return { user: { name: session.user.name } };
}

export default function Component({ loaderData }: Route.ComponentProps) {
	return (
		<AppLayout userName={loaderData.user.name}>
			<Outlet />
		</AppLayout>
	);
}
