import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const adminUser = {
          email: "admin@desa.id",
          password: "password123"
        };
        
        if (credentials?.email === adminUser.email && credentials?.password === adminUser.password) {
          return { id: "1", name: "Admin Desa", email: adminUser.email };
        }
        
        return null;
      }
    })
  ],
  pages: {
    signIn: '/admin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};