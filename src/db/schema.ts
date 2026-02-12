
import { sqliteTable, text, integer, uniqueIndex, index, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Users Table
export const users = sqliteTable("users", {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    role: text("role").default("student"),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
}, (table) => [
    uniqueIndex("users_email_unique").on(table.email),
]);

// API Data Table (New)
export const apiData = sqliteTable("api_data", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    data: text("data").notNull(), // JSON stringified data
    monthKey: text("month_key").notNull(), // Format: "YYYY-MM"
    updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (table) => [
    uniqueIndex("api_data_month_key_unique").on(table.monthKey),
]);

// Other Existing Tables (Cleaned up)
export const courses = sqliteTable("courses", {
    id: text("id").primaryKey().notNull(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    published: integer("published").default(0),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
    hasQuiz: integer("has_quiz").default(0),
    hasCertificate: integer("has_certificate").default(1),
    passingScore: integer("passing_score").default(70),
}, (table) => [
    uniqueIndex("courses_slug_unique").on(table.slug),
]);

export const lessons = sqliteTable("lessons", {
    id: text("id").primaryKey().notNull(),
    courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    content: text("content"),
    videoUrl: text("video_url"),
    order: integer("order").default(0).notNull(),
    isPublished: integer("is_published").default(0),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
    presentationUrl: text("presentation_url"),
    hasQuiz: integer("has_quiz").default(0),
    quizTimeLimit: integer("quiz_time_limit").default(0),
}, (table) => [
    uniqueIndex("lessons_slug_unique").on(table.slug),
]);

export const userProgress = sqliteTable("user_progress", {
    id: text("id").primaryKey().notNull(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
    isCompleted: integer("is_completed").default(0),
    completedAt: text("completed_at"),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
    reflection: text("reflection"),
});

export const certificates = sqliteTable("certificates", {
    id: text("id").primaryKey().notNull(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    issuedAt: text("issued_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
    certificateCode: text("certificate_code").notNull(),
}, (table) => [
    uniqueIndex("certificates_certificate_code_unique").on(table.certificateCode),
]);

export const comments = sqliteTable("comments", {
    id: text("id").primaryKey().notNull(),
    content: text("content").notNull(),
    lessonId: text("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const achievements = sqliteTable("achievements", {
    id: text("id").primaryKey().notNull(),
    title: text("title").notNull(),
    event: text("event").notNull(),
    description: text("description").notNull(),
    year: integer("year").notNull(),
    icon: text("icon").default("Award"),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const researchPapers = sqliteTable("research_papers", {
    id: text("id").primaryKey().notNull(),
    title: text("title").notNull(),
    author: text("author").notNull(),
    abstract: text("abstract"),
    fileUrl: text("file_url"),
    publishDate: text("publish_date").notNull(),
    category: text("category").default("Research Paper").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const organizationMembers = sqliteTable("organization_members", {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    position: text("position").notNull(),
    division: text("division").notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const quizzes = sqliteTable("quizzes", {
    id: text("id").primaryKey(),
    lessonId: text("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
    question: text("question").notNull(),
    optionA: text("option_a").notNull(),
    optionB: text("option_b").notNull(),
    optionC: text("option_c").notNull(),
    optionD: text("option_d").notNull(),
    correctAnswer: text("correct_answer").notNull(),
    explanation: text("explanation"),
    order: integer("order").default(0).notNull(),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
}, (table) => [
    index("idx_quizzes_lesson").on(table.lessonId),
]);

export const quizAttempts = sqliteTable("quiz_attempts", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
    score: integer("score").notNull(),
    answers: text("answers").notNull(),
    passed: integer("passed").notNull(),
    attemptedAt: text("attempted_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
}, (table) => [
    index("idx_quiz_attempts_lesson").on(table.lessonId),
    index("idx_quiz_attempts_user_lesson").on(table.userId, table.lessonId),
]);

export const events = sqliteTable("events", {
    id: text("id").primaryKey().notNull(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    category: text("category").default("general"),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
    eventDate: text("event_date"),
    rating: real("rating"),
});

export const eventRatings = sqliteTable("event_ratings", {
    id: text("id").primaryKey().notNull(),
    eventId: text("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const anonymousMessages = sqliteTable("anonymous_messages", {
    id: text("id").primaryKey().notNull(),
    content: text("content").notNull(),
    isRead: integer("is_read").default(0),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
    recipient: text("recipient"),
});
