
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';
import { compare } from 'bcryptjs';
import { signInSchema } from './lib/zod';
import { ZodError } from 'zod';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                try {
                    const { email, password } = await signInSchema.parseAsync(credentials);

                    const user = await db
                        .select()
                        .from(users)
                        .where(eq(users.email, email))
                        .get();

                    if (!user) {
                        throw new Error('User not found.');
                    }

                    const userRole = user.role || 'student';

                    if (userRole === 'student') {
                        throw new Error('Access Denied: Students are not allowed.');
                    }

                    const passwordsMatch = await compare(password, user.password);
                    if (!passwordsMatch) {
                        throw new Error('Invalid password.');
                    }

                    return {
                        ...user,
                        role: userRole,
                    };
                } catch (error) {
                    if (error instanceof ZodError) {
                        return null;
                    }
                    throw error; // Rethrow to be caught by NextAuth
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string;
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
});
