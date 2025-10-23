import connectDB from '@/lib/db';
import User from '@/models/User';
// import bcrypt from 'bcryptjs'; // Temporarily disabled for CodeSandbox

export const authOptions = {
  providers: [
    {
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();
          const user = await User.findOne();

          if (!user) {
            return null;
          }

          // Temporarily disabled for CodeSandbox - replace with actual bcrypt in production
          const isPasswordValid = credentials.password === (user as any)?.password;

          if (!isPasswordValid) {
            return null;
          }

          // Update last login
          (user as any).lastLogin = new Date();
          await (user as any).save();

          return {
            id: (user as any)._id?.toString() || 'mock-id',
            email: (user as any).email || credentials.email,
            name: (user as any).name || 'Mock User',
            role: (user as any).role || 'designer'
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    }
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
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
  },
  secret: 'fallback-secret-for-development',
};
