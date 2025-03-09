import { Link, Outlet, useLocation } from "react-router";
import { cn } from "~/lib/utils";

export default function Layout() {
	const location = useLocation();

	// Function to determine if a tab is active
	const isActive = (path: string) => {
		return location.pathname.startsWith(path);
	};

	return (
		<div className="min-h-screen flex flex-col">
			<header className="bg-white border-b">
				<div className="container mx-auto px-4">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center">
							<Link to="/" className="text-xl font-bold">
								Book Manager
							</Link>
						</div>
					</div>

					{/* Tab navigation */}
					<nav className="flex space-x-4">
						<Link
							to="/books"
							className={cn(
								"px-3 py-2 text-sm font-medium rounded-md transition-colors",
								isActive("/books")
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:text-foreground hover:bg-muted",
							)}
						>
							Books
						</Link>
						<Link
							to="/categories"
							className={cn(
								"px-3 py-2 text-sm font-medium rounded-md transition-colors",
								isActive("/categories")
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:text-foreground hover:bg-muted",
							)}
						>
							Categories
						</Link>
					</nav>
				</div>
			</header>

			<main className="flex-1 py-6">
				<div className="container mx-auto px-4 max-w-3xl">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
