import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import axios from "axios";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post("http://localhost:5001/auth/login", {
            email: credentials?.email,
            password: credentials?.password,
          });

          const user = res.data?.user;
          const token = res.data?.access_token;

          if (user && token) {
            return { ...user, accessToken: token };
          }

          throw new Error("Login failed. No user/token returned.");
        } catch (err: any) {
          const message =
            err.response?.data?.message || "Invalid email or password";
          throw new Error(message);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("Setting JWT token from user:", user);
        token.id = user.id || "";
        token.name = user.name || "";
        token.email = user.email || "";
        token.role = user.role || "";
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        role: token.role as string,
      };
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },

  debug: process.env.NODE_ENV === "development",
};
