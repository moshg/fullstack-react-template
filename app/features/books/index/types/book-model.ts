export interface BookModel {
	id: number;
	title: string;
	author: string;
	publishYear: number | null;
	categories: CategoryModel[];
}

export interface CategoryModel {
	id: number;
	name: string;
}
