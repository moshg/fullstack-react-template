export interface BookModel {
	id: number;
	title: string;
	author: string;
	publishYear: number | null;
	categories: { id: number; name: string }[];
}
