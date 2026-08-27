import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  // O adapter grava usuários, sessões e tokens direto no Postgres via Prisma.
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],

  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      // Link de login expira em 15 minutos (padrão do NextAuth: 24h — reduzido
      // aqui porque não faz sentido um link de "prova que é você" durar 1 dia).
      maxAge: 15 * 60,
    }),
  ],

  // Sessão guardada no banco (não em cookie assinado), pra dar pra revogar
  // sessões e consultar "quem está logado" direto pelo Prisma se precisar.
  session: { strategy: "database" },

  pages: {
    signIn: "/login",
    verifyRequest: "/login/verifique-seu-email",
  },

  callbacks: {
    // Expõe o id do usuário na sessão do lado do cliente/servidor,
    // porque é esse id que usamos pra checar "esse usuário já votou aqui?".
    async session({ session, user }) {
      if (session.user) {
        (session.user as typeof session.user & { id: string }).id = user.id;
      }
      return session;
    },
  },
};
