CREATE TABLE `books` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`author` text,
	`total_pages` integer,
	`status` text DEFAULT 'reading' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `challenges` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`start_date` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text NOT NULL,
	`failed_at` text
);
--> statement-breakpoint
CREATE TABLE `day_photos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`day_id` integer NOT NULL,
	`angle` text NOT NULL,
	`url` text NOT NULL,
	`key` text NOT NULL,
	`uploaded_at` text NOT NULL,
	FOREIGN KEY (`day_id`) REFERENCES `days`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `days` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`challenge_id` integer NOT NULL,
	`day_number` integer NOT NULL,
	`date` text NOT NULL,
	`diet_done` integer DEFAULT false NOT NULL,
	`workout1_done` integer DEFAULT false NOT NULL,
	`workout1_outdoor` integer DEFAULT false NOT NULL,
	`workout2_done` integer DEFAULT false NOT NULL,
	`workout2_outdoor` integer DEFAULT false NOT NULL,
	`water_ml` integer DEFAULT 0 NOT NULL,
	`reading_done` integer DEFAULT false NOT NULL,
	`photo_done` integer DEFAULT false NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`completed_at` text,
	FOREIGN KEY (`challenge_id`) REFERENCES `challenges`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reading_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`day_id` integer NOT NULL,
	`book_id` integer NOT NULL,
	`pages_read` integer NOT NULL,
	`logged_at` text NOT NULL,
	FOREIGN KEY (`day_id`) REFERENCES `days`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `water_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`day_id` integer NOT NULL,
	`amount_ml` integer NOT NULL,
	`logged_at` text NOT NULL,
	FOREIGN KEY (`day_id`) REFERENCES `days`(`id`) ON UPDATE no action ON DELETE no action
);
