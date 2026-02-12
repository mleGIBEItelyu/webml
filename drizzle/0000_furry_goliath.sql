-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `anonymous_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`is_read` integer DEFAULT false,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`recipient` text,
	CONSTRAINT "quizzes_check_1" CHECK(correct_answer IN ('A', 'B', 'C', 'D')
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text NOT NULL,
	`thumbnail_url` text,
	`published` integer DEFAULT false,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`has_quiz` integer DEFAULT 0,
	`has_certificate` integer DEFAULT 1,
	`passing_score` integer DEFAULT 70,
	CONSTRAINT "quizzes_check_1" CHECK(correct_answer IN ('A', 'B', 'C', 'D')
);
--> statement-breakpoint
CREATE UNIQUE INDEX `courses_slug_unique` ON `courses` (`slug`);--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` text PRIMARY KEY NOT NULL,
	`course_id` text NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`content` text,
	`video_url` text,
	`order` integer DEFAULT 0 NOT NULL,
	`is_published` integer DEFAULT false,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`presentation_url` text,
	`has_quiz` integer DEFAULT 0,
	`quiz_time_limit` integer DEFAULT 0,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "quizzes_check_1" CHECK(correct_answer IN ('A', 'B', 'C', 'D')
);
--> statement-breakpoint
CREATE UNIQUE INDEX `lessons_slug_unique` ON `lessons` (`slug`);--> statement-breakpoint
CREATE TABLE `user_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`is_completed` integer DEFAULT false,
	`completed_at` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`reflection` text,
	FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "quizzes_check_1" CHECK(correct_answer IN ('A', 'B', 'C', 'D')
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'student',
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	CONSTRAINT "quizzes_check_1" CHECK(correct_answer IN ('A', 'B', 'C', 'D')
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `certificates` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`course_id` text NOT NULL,
	`issued_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`certificate_code` text NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "quizzes_check_1" CHECK(correct_answer IN ('A', 'B', 'C', 'D')
);
--> statement-breakpoint
CREATE UNIQUE INDEX `certificates_certificate_code_unique` ON `certificates` (`certificate_code`);--> statement-breakpoint
CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`lesson_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "quizzes_check_1" CHECK(correct_answer IN ('A', 'B', 'C', 'D')
);
--> statement-breakpoint
CREATE TABLE `achievements` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`event` text NOT NULL,
	`description` text NOT NULL,
	`year` integer NOT NULL,
	`icon` text DEFAULT 'Award',
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	CONSTRAINT "quizzes_check_1" CHECK(correct_answer IN ('A', 'B', 'C', 'D')
);
--> statement-breakpoint
CREATE TABLE `research_papers` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`author` text NOT NULL,
	`abstract` text,
	`file_url` text,
	`publish_date` text NOT NULL,
	`category` text DEFAULT 'Research Paper' NOT NULL,
	`thumbnail_url` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	CONSTRAINT "quizzes_check_1" CHECK(correct_answer IN ('A', 'B', 'C', 'D')
);
--> statement-breakpoint
CREATE TABLE `organization_members` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`position` text NOT NULL,
	`division` text NOT NULL,
	`description` text,
	`image_url` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	CONSTRAINT "quizzes_check_1" CHECK(correct_answer IN ('A', 'B', 'C', 'D')
);
--> statement-breakpoint
CREATE TABLE `quizzes` (
	`id` text PRIMARY KEY,
	`lesson_id` text NOT NULL,
	`question` text NOT NULL,
	`option_a` text NOT NULL,
	`option_b` text NOT NULL,
	`option_c` text NOT NULL,
	`option_d` text NOT NULL,
	`correct_answer` text NOT NULL,
	`explanation` text,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "quizzes_check_1" CHECK(correct_answer IN ('A', 'B', 'C', 'D')
);
--> statement-breakpoint
CREATE INDEX `idx_quizzes_lesson` ON `quizzes` (`lesson_id`);--> statement-breakpoint
CREATE TABLE `quiz_attempts` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`score` integer NOT NULL,
	`answers` text NOT NULL,
	`passed` integer NOT NULL,
	`attempted_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "quizzes_check_1" CHECK(correct_answer IN ('A', 'B', 'C', 'D')
);
--> statement-breakpoint
CREATE INDEX `idx_quiz_attempts_lesson` ON `quiz_attempts` (`lesson_id`);--> statement-breakpoint
CREATE INDEX `idx_quiz_attempts_user_lesson` ON `quiz_attempts` (`user_id`,`lesson_id`);--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`thumbnail_url` text,
	`category` text DEFAULT 'general',
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`event_date` text,
	`rating` real DEFAULT 0,
	CONSTRAINT "quizzes_check_1" CHECK(correct_answer IN ('A', 'B', 'C', 'D')
);
--> statement-breakpoint
CREATE TABLE `event_ratings` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`user_id` text,
	`rating` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "quizzes_check_1" CHECK(correct_answer IN ('A', 'B', 'C', 'D')
);

*/