import {
	type RouteConfig,
	index,
	layout,
	prefix,
} from "@react-router/dev/routes";

export default [
	layout("routes/layout.tsx", [
		index("routes/index.tsx"),
		...prefix("books", [
			index("routes/books/index/index.tsx"),
			{ path: "new", file: "routes/books/new.tsx" },
		]),
		...prefix("categories", [
			index("routes/categories/index/index.tsx"),
			{ path: "new", file: "routes/categories/new.tsx" },
		]),
	]),
] satisfies RouteConfig;
