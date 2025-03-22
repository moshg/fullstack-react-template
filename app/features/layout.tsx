import { Moon, Sun } from "lucide-react";
import type React from "react";
import { Link as RouterLink, useLocation } from "react-router";
import { Theme, useTheme } from "remix-themes";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { p } from "~/lib/path";
import { cn } from "~/lib/utils";

export function AppLayout({ children }: { children: React.ReactNode }) {
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
						<ModeToggle />
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

export function ModeToggle() {
	const [, setTheme] = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme(Theme.LIGHT)}>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme(Theme.DARK)}>
					Dark
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
