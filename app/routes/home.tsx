import { Link } from "react-router";

export function meta() {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	return (
		<>
			<h1>Home</h1>
			<p>
				<Link to="/books">Books</Link>
			</p>
			<p>
				<Link to="/categories">Categories</Link>
			</p>
		</>
	);
}
