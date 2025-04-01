import { Outlet } from "react-router";
import { UnauthenticatedLayout } from "~/features/layout";

export default function Auth() {
	return (
		<UnauthenticatedLayout>
			<Outlet />
		</UnauthenticatedLayout>
	);
}
