import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        console.log('=== AUTHORIZE FUNCTION CALLED ===');
        console.log('Credentials received:', { email: credentials?.email, hasPassword: !!credentials?.password });
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Auth: Missing credentials');
          return null;
        }

        try {
          await connectDB();
          console.log('Auth: DB connected');
          
          const user = await User.findOne({ email: credentials.email });
          console.log('Auth: User lookup complete', { found: !!user, email: user?.email });

          if (!user) {
            console.log('Auth: User not found - returning null');
            return null;
          }

          console.log('Auth: User found, attempting password comparison');
          console.log('Auth: Stored password hash:', (user as any)?.password?.substring(0, 20) + '...');
          console.log('Auth: Input password length:', credentials.password.length);
          
          // Compare password with bcrypt
          let isPasswordValid = false;
          try {
            isPasswordValid = await bcrypt.compare(
              credentials.password, 
              (user as any)?.password
            );
            console.log('Auth: bcrypt.compare result:', isPasswordValid);
          } catch (bcryptError) {
            console.error('Auth: bcrypt comparison error:', bcryptError);
            return null;
          }

          if (!isPasswordValid) {
            console.log('Auth: Password invalid - returning null');
            return null;
          }

          console.log('Auth: Password valid! Updating last login');
          // Update last login
          (user as any).lastLogin = new Date();
          await (user as any).save();

          const returnUser = {
            id: (user as any)._id?.toString() || 'mock-id',
            email: (user as any).email || credentials.email,
            name: (user as any).name || 'Mock User',
            role: (user as any).role || 'designer'
          };
          console.log('Auth: Returning user:', returnUser);
          return returnUser;
        } catch (error) {
          console.error('Auth error (outer catch):', error);
          console.error('Auth error stack:', error instanceof Error ? error.stack : 'No stack');
          return null;
        }
      }
    })
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
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
});
