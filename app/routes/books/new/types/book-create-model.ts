export interface BookCreateModel {
	title: string;
	author: string;
	publishYear?: number;
	categoryIds: number[];
}
