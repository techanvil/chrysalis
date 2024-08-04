import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  /*
  // Lock down the sign-in to only allow users from a specific domain.
  callbacks: {
    async signIn({ account, profile }) {
      if (!account || !profile?.email) {
        return false;
      }

      if (account.provider === "google") {
        return (
          !!profile.email_verified && profile.email.endsWith("@techanvil.co.uk")
        );
      }

      return false; // Do different verification when there are other providers that don't have `email_verified`. Return `false` while there are no other providers.
    },
  },
  */
});
