import { relations } from "drizzle-orm/relations";
import { courses, lessons, userProgress, users, certificates, comments, quizzes, quizAttempts, eventRatings, events } from "./schema";

export const lessonsRelations = relations(lessons, ({one, many}) => ({
	course: one(courses, {
		fields: [lessons.courseId],
		references: [courses.id]
	}),
	userProgresses: many(userProgress),
	comments: many(comments),
	quizzes: many(quizzes),
	quizAttempts: many(quizAttempts),
}));

export const coursesRelations = relations(courses, ({many}) => ({
	lessons: many(lessons),
	certificates: many(certificates),
}));

export const userProgressRelations = relations(userProgress, ({one}) => ({
	lesson: one(lessons, {
		fields: [userProgress.lessonId],
		references: [lessons.id]
	}),
	user: one(users, {
		fields: [userProgress.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	userProgresses: many(userProgress),
	certificates: many(certificates),
	comments: many(comments),
	quizAttempts: many(quizAttempts),
	eventRatings: many(eventRatings),
}));

export const certificatesRelations = relations(certificates, ({one}) => ({
	course: one(courses, {
		fields: [certificates.courseId],
		references: [courses.id]
	}),
	user: one(users, {
		fields: [certificates.userId],
		references: [users.id]
	}),
}));

export const commentsRelations = relations(comments, ({one}) => ({
	user: one(users, {
		fields: [comments.userId],
		references: [users.id]
	}),
	lesson: one(lessons, {
		fields: [comments.lessonId],
		references: [lessons.id]
	}),
}));

export const quizzesRelations = relations(quizzes, ({one}) => ({
	lesson: one(lessons, {
		fields: [quizzes.lessonId],
		references: [lessons.id]
	}),
}));

export const quizAttemptsRelations = relations(quizAttempts, ({one}) => ({
	lesson: one(lessons, {
		fields: [quizAttempts.lessonId],
		references: [lessons.id]
	}),
	user: one(users, {
		fields: [quizAttempts.userId],
		references: [users.id]
	}),
}));

export const eventRatingsRelations = relations(eventRatings, ({one}) => ({
	user: one(users, {
		fields: [eventRatings.userId],
		references: [users.id]
	}),
	event: one(events, {
		fields: [eventRatings.eventId],
		references: [events.id]
	}),
}));

export const eventsRelations = relations(events, ({many}) => ({
	eventRatings: many(eventRatings),
}));