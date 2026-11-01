import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Google sign in only. DriftClash is a registration site for now, so signing in does NOT create a
 * Penthouse Drift member or touch any member data. The Google account id is the person's id,
 * which is also what a Penthouse Drift member id is, so a registration can be matched up later.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) token.sub = account.providerAccountId;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
