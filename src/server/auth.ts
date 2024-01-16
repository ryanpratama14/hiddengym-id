import { env } from "@/env";
import { EMAIL_VISITOR_READONLY } from "@/lib/constants";
import { schema } from "@/schema";
import { db } from "@/server/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type Role, type User } from "@prisma/client";
import { verify } from "argon2";
import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: { id: string; role: Role; exp: number } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    jwt: async ({ token, user }) => ({ ...token, ...user }),
    session: async ({ session, token }) => {
      const user = structuredClone(token) as User & { exp: number };
      return {
        ...session,
        user: { ...session.user, id: user.id, role: user.role, exp: user.exp * 1000, name: user.fullName, image: user.imageId },
      };
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      authorize: async (credentials) => {
        const parsedCredentials = schema.login.safeParse(credentials);
        if (!parsedCredentials.success) return null;
        const { credential, email } = parsedCredentials.data;

        // for visitors
        if (email === EMAIL_VISITOR_READONLY) {
          const user = await db.user.findUnique({ where: { phoneNumber: credential } });
          if (!user) return null;
          return user;
        }

        const user = await db.user.findFirst({ where: { email: email.toLowerCase() } });
        if (!user) return null;
        const matchCredential = await verify(user.credential, credential);
        if (!matchCredential) return null;
        return user;
      },
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
