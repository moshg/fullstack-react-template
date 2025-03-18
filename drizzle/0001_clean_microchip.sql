ALTER TABLE `book_categories` RENAME TO `books_to_categories`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_books_to_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bookId` integer NOT NULL,
	`categoryId` integer NOT NULL,
	FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_books_to_categories`("id", "bookId", "categoryId") SELECT "id", "bookId", "categoryId" FROM `books_to_categories`;--> statement-breakpoint
DROP TABLE `books_to_categories`;--> statement-breakpoint
ALTER TABLE `__new_books_to_categories` RENAME TO `books_to_categories`;--> statement-breakpoint
PRAGMA foreign_keys=ON;