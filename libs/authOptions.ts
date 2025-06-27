// libs/authOptions.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/libs/prismaClient";
import bcrypt from "bcrypt";
import { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

interface Credentials {
  email: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "deepansu" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid account or missing password");
        }

        const isMatched = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isMatched) {
          throw new Error("Incorrect password");
        }

        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }): Promise<JWT> {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      session.user = token.user as Session["user"];
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
