import NextAuth, { NextAuthOptions } from "next-auth";
import prisma from "@/libs/prismaClient";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";

interface Credentials {
  email: string;
  username: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "deepansu" },
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        try {
          if (!credentials || !credentials.email || !credentials.password) {
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
        } catch (error: any) {
          console.error("Authorization error:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
  async jwt({
    token,
    user,
  }: {
    token: JWT;
    user?: User;
  }): Promise<JWT> {
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
