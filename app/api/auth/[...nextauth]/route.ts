import NextAuth, { type Adapter } from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
const prisma = new PrismaClient();

// Create custom adapter with userType support
const customAdapter = {
  ...PrismaAdapter(prisma),
  createUser: async (data) => {
    // Get userType from custom provider data if available
    const userType = data.userType || "Creator"; // Default to Creator if not specified

    return prisma.user.create({
      data: {
        ...data,
        userType,
      },
    });
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: customAdapter as Adapter,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          userType: profile.userType, // This will come from state params
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Save userType from state params if present
      if (account?.provider === "google" && profile) {
        profile.userType = (account.userType as string) || "Creator";
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.userType = user.userType;
      }

      if (account?.provider === "google" && account.userType) {
        token.userType = account.userType;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.userType = token.userType;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
});

export const GET = handlers.GET;
export const POST = handlers.POST;
