import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	{
		path: "books",
		file: "routes/books/index/index.tsx",
	},
	{
		path: "books/new",
		file: "routes/books/new.tsx",
	},
	{
		path: "categories",
		file: "routes/categories/index/index.tsx",
	},
	{
		path: "categories/new",
		file: "routes/categories/new.tsx",
	},
] satisfies RouteConfig;
