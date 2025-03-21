import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { p } from "~/lib/path";
import type { BookModel } from "../index/models/book-model";

interface BookDetailProps {
	book: BookModel | null;
}

export function BookDetail({ book }: BookDetailProps) {
	return (
		<div className="container mx-auto py-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Book Details</h1>
				<Button asChild variant="outline">
					<Link to={p("/books")}>Back to List</Link>
				</Button>
			</div>

			{book ? (
				<Card>
					<CardHeader>
						<CardTitle>{book.title}</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<h3 className="font-semibold mb-1">Author</h3>
							<p className="text-muted-foreground">{book.author}</p>
						</div>
						<div>
							<h3 className="font-semibold mb-1">Publication Year</h3>
							<p className="text-muted-foreground">{book.publishYear}</p>
						</div>

						<div>
							<h3 className="font-semibold mb-2">Categories</h3>
							<div className="flex gap-2 flex-wrap">
								{book.categories.length > 0 ? (
									book.categories.map((category) => (
										<Badge key={category.id} variant="secondary">
											{category.name}
										</Badge>
									))
								) : (
									<p className="text-muted-foreground">
										No categories assigned
									</p>
								)}
							</div>
						</div>
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardContent>
						<p className="text-muted-foreground text-center py-8">
							Book not found.
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
