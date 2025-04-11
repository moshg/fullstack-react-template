import { LogOut, User } from "lucide-react";
import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { authClient } from "~/lib/auth-client";
import { p } from "~/lib/path";
import { cn } from "~/lib/utils";

/**
 * Layout for authenticated users
 */
export function AppLayout({
	children,
	userName,
}: {
	children: React.ReactNode;
	userName: string;
}) {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const handleSignOut = async () => {
		setIsLoading(true);
		const { error } = await authClient.signOut();
		if (error) {
			// TODO: use toast
			alert(error.message ?? "Unknown error");
		}

		await navigate(p("/signin"));
	};

	return (
		<div className="min-h-screen flex flex-col">
			<header className="bg-background border-b">
				<div className="container mx-auto px-4">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center">
							<RouterLink to={p("/")} className="text-xl font-bold">
								Book Manager
							</RouterLink>
						</div>
						<div className="flex items-center space-x-4">
							<div className="text-sm mr-2">
								<span className="text-muted-foreground">Signed in as </span>
								<span className="font-medium">{userName}</span>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={handleSignOut}
								disabled={isLoading}
								className="flex items-center gap-1"
							>
								<LogOut className="h-4 w-4 mr-1" />
								{isLoading ? "Signing out..." : "Sign Out"}
							</Button>
						</div>
					</div>

					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<Link to={p("/books")}>Books</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link to={p("/categories")}>Categories</Link>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
			</header>

			<main className="flex-1 py-6 bg-background">
				<div className="container mx-auto px-4 max-w-3xl">{children}</div>
			</main>
		</div>
	);
}

/**
 * Layout for unauthenticated users
 */
export function UnauthenticatedLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen flex flex-col">
			<header className="bg-background border-b">
				<div className="container mx-auto px-4">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center">
							<RouterLink to={p("/")} className="text-xl font-bold">
								Book Manager
							</RouterLink>
						</div>
						<div className="flex items-center space-x-4">
							<RouterLink
								to={p("/signin")}
								className="flex items-center gap-1 text-sm px-3 py-2 rounded-md hover:bg-gray-100"
							>
								<User className="h-4 w-4 mr-1" />
								Sign In
							</RouterLink>
						</div>
					</div>
				</div>
			</header>

			<main className="flex-1 py-6 bg-background">
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
