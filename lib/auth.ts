import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from './db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();
          const user = await User.findOne({ 
            email: (credentials.email as string).toLowerCase() 
          });

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password as string
          );

          if (!isPasswordValid) {
            return null;
          }

          // Update last login
          user.lastLogin = new Date();
          await user.save();

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      // During login, user object is present
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = (user as any).role;
      } else if (token.id) {
        // On subsequent calls (session refresh), fetch fresh data from database
        try {
          await connectDB();
          const dbUser = await User.findById(token.id);
          if (dbUser) {
            token.name = dbUser.name;
            token.role = dbUser.role;
          }
        } catch (error) {
          console.error('Error fetching user in JWT callback:', error);
        }
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        (session.user as any).id = token.id;
        session.user.name = token.name;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  } as const,
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
};

// Create auth instance for NextAuth v5
export const { auth, handlers } = NextAuth(authOptions);

