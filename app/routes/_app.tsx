import { Outlet } from "react-router";
import { AppLayout } from "~/features/layout";

export default function Component() {
	return (
		<AppLayout>
			<Outlet />
		</AppLayout>
	);
}
