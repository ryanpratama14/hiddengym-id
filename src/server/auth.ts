import { env } from "@/env";
import { EMAIL_VISITOR_READONLY } from "@/lib/constants";
import { db } from "@/server/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type Role, type User } from "@prisma/client";
import { schema } from "@schema";
import { verify } from "argon2";
import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: { id: string; role: Role; exp: number; tz: string } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends User {
    exp: number;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    jwt: async ({ token, user }) => ({ ...token, ...user }),
    session: async ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id,
        role: token.role,
        exp: token.exp * 1000,
        name: token.fullName,
        image: token.imageId,
        tz: token.tz,
      },
    }),
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
