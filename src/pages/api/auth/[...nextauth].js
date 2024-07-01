import NextAuth from "next-auth"
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {

  providers: [
    GoogleProvider({
        clientId: process.env.NEXT_PUBLIC_GOOOGLE_CLIENT_ID,
        clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;

      setCookie(null, 'accessToken', token.accessToken, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });

      return session;
    },
  },
}

export default NextAuth(authOptions)