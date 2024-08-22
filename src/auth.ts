import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const ALLOWED_DOMAINS = [
  "techanvil.co.uk",
  "10up.com",
  "get10up.com",
  "google.com",
];

function isAllowedDomain(email: string): boolean {
  const domain = email.split("@")[1];
  return ALLOWED_DOMAINS.includes(domain);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  // Lock down the sign-in to only allow users from a specific domain.
  callbacks: {
    async signIn({ account, profile }) {
      if (!account || !profile?.email) {
        return false;
      }

      if (account.provider === "google") {
        return !!profile.email_verified && isAllowedDomain(profile.email);
      }

      return false; // Do different verification when there are other providers that don't have `email_verified`. Return `false` while there are no other providers.
    },
  },
});
