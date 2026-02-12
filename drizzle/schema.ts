import { sqliteTable, AnySQLiteColumn, check, text, integer, uniqueIndex, foreignKey, index, real } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export const anonymousMessages = sqliteTable("anonymous_messages", {
	id: text().primaryKey().notNull(),
	content: text().notNull(),
	isRead: integer("is_read").default(0),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	recipient: text(),
},
	(table) => [
		check("quizzes_check_1", sql`correct_answer IN ('A', 'B', 'C', 'D'`),
	]);

export const courses = sqliteTable("courses", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	slug: text().notNull(),
	description: text().notNull(),
	thumbnailUrl: text("thumbnail_url"),
	published: integer().default(0),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	hasQuiz: integer("has_quiz").default(0),
	hasCertificate: integer("has_certificate").default(1),
	passingScore: integer("passing_score").default(70),
},
	(table) => [
		uniqueIndex("courses_slug_unique").on(table.slug),
		check("quizzes_check_1", sql`correct_answer IN ('A', 'B', 'C', 'D'`),
	]);

export const lessons = sqliteTable("lessons", {
	id: text().primaryKey().notNull(),
	courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
	title: text().notNull(),
	slug: text().notNull(),
	content: text(),
	videoUrl: text("video_url"),
	order: integer().default(0).notNull(),
	isPublished: integer("is_published").default(0),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	presentationUrl: text("presentation_url"),
	hasQuiz: integer("has_quiz").default(0),
	quizTimeLimit: integer("quiz_time_limit").default(0),
},
	(table) => [
		uniqueIndex("lessons_slug_unique").on(table.slug),
		check("quizzes_check_1", sql`correct_answer IN ('A', 'B', 'C', 'D'`),
	]);

export const userProgress = sqliteTable("user_progress", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
	lessonId: text("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
	isCompleted: integer("is_completed").default(0),
	completedAt: text("completed_at"),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	reflection: text(),
},
	(table) => [
		check("quizzes_check_1", sql`correct_answer IN ('A', 'B', 'C', 'D'`),
	]);

export const users = sqliteTable("users", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	password: text().notNull(),
	role: text().default("student"),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
},
	(table) => [
		uniqueIndex("users_email_unique").on(table.email),
		check("quizzes_check_1", sql`correct_answer IN ('A', 'B', 'C', 'D'`),
	]);

export const certificates = sqliteTable("certificates", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
	courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
	issuedAt: text("issued_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	certificateCode: text("certificate_code").notNull(),
},
	(table) => [
		uniqueIndex("certificates_certificate_code_unique").on(table.certificateCode),
		check("quizzes_check_1", sql`correct_answer IN ('A', 'B', 'C', 'D'`),
	]);

export const comments = sqliteTable("comments", {
	id: text().primaryKey().notNull(),
	content: text().notNull(),
	lessonId: text("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
	userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
},
	(table) => [
		check("quizzes_check_1", sql`correct_answer IN ('A', 'B', 'C', 'D'`),
	]);

export const achievements = sqliteTable("achievements", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	event: text().notNull(),
	description: text().notNull(),
	year: integer().notNull(),
	icon: text().default("Award"),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
},
	(table) => [
		check("quizzes_check_1", sql`correct_answer IN ('A', 'B', 'C', 'D'`),
	]);

export const researchPapers = sqliteTable("research_papers", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	author: text().notNull(),
	abstract: text(),
	fileUrl: text("file_url"),
	publishDate: text("publish_date").notNull(),
	category: text().default("Research Paper").notNull(),
	thumbnailUrl: text("thumbnail_url"),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
},
	(table) => [
		check("quizzes_check_1", sql`correct_answer IN ('A', 'B', 'C', 'D'`),
	]);

export const organizationMembers = sqliteTable("organization_members", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	position: text().notNull(),
	division: text().notNull(),
	description: text(),
	imageUrl: text("image_url"),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
},
	(table) => [
		check("quizzes_check_1", sql`correct_answer IN ('A', 'B', 'C', 'D'`),
	]);

export const quizzes = sqliteTable("quizzes", {
	id: text().primaryKey(),
	lessonId: text("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
	question: text().notNull(),
	optionA: text("option_a").notNull(),
	optionB: text("option_b").notNull(),
	optionC: text("option_c").notNull(),
	optionD: text("option_d").notNull(),
	correctAnswer: text("correct_answer").notNull(),
	explanation: text(),
	order: integer().default(0).notNull(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
},
	(table) => [
		index("idx_quizzes_lesson").on(table.lessonId),
		check("quizzes_check_1", sql`correct_answer IN ('A', 'B', 'C', 'D'`),
	]);

export const quizAttempts = sqliteTable("quiz_attempts", {
	id: text().primaryKey(),
	userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
	lessonId: text("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
	score: integer().notNull(),
	answers: text().notNull(),
	passed: integer().notNull(),
	attemptedAt: text("attempted_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
},
	(table) => [
		index("idx_quiz_attempts_lesson").on(table.lessonId),
		index("idx_quiz_attempts_user_lesson").on(table.userId, table.lessonId),
		check("quizzes_check_1", sql`correct_answer IN ('A', 'B', 'C', 'D'`),
	]);

export const events = sqliteTable("events", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	content: text().notNull(),
	thumbnailUrl: text("thumbnail_url"),
	category: text().default("general"),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	eventDate: text("event_date"),
	rating: real(),
},
	(table) => [
		check("quizzes_check_1", sql`correct_answer IN ('A', 'B', 'C', 'D'`),
	]);

export const eventRatings = sqliteTable("event_ratings", {
	id: text().primaryKey().notNull(),
	eventId: text("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
	userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
	rating: integer().notNull(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
},
	(table) => [
		check("quizzes_check_1", sql`correct_answer IN ('A', 'B', 'C', 'D'`),
	]);

