import { Link as RouterLink, useLocation } from "react-router";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { cn } from "~/lib/utils";

export function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen flex flex-col">
			<header className="bg-white border-b">
				<div className="container mx-auto px-4">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center">
							<RouterLink to="/" className="text-xl font-bold">
								Book Manager
							</RouterLink>
						</div>
					</div>

					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<Link to="/books">Books</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link to="/categories">Categories</Link>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
			</header>

			<main className="flex-1 py-6">
				<div className="container mx-auto px-4 max-w-3xl">{children}</div>
			</main>
		</div>
	);
}

function Link({ to, children }: { to: string; children: React.ReactNode }) {
	const location = useLocation();
	const isActive = location.pathname.startsWith(to);

	return (
		<NavigationMenuLink asChild active={isActive}>
			<RouterLink
				to={to}
				className={cn(
					navigationMenuTriggerStyle(),
					"relative after:absolute after:bottom-0 after:left-0 after:right-0",
					"after:h-[2px] after:bg-primary after:transform after:scale-x-0",
					"after:transition-transform after:duration-200",
					"data-[active]:after:scale-x-100",
				)}
			>
				{children}
			</RouterLink>
		</NavigationMenuLink>
	);
}
