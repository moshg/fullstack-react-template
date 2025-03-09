import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	{
		path: "books",
		file: "routes/books/books/index.tsx",
	},
] satisfies RouteConfig;
