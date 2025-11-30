// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

async function verifyUser(email: string, password: string) {
  // تسجيل دخول تجريبي مؤقت (من .env.local)
  if (email === process.env.DEMO_EMAIL && password === process.env.DEMO_PASS) {
    return { id: "demo-1", name: "Demo User", email };
  }
  // لاحقاً نربط مع Supabase/NocoDB/Directus
  return null;
}

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(c) {
        const user = await verifyUser(c!.email as string, c!.password as string);
        return user; // إذا null بيرفض الدخول تلقائياً
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = { id: (user as any).id, name: user.name, email: user.email };
      return token;
    },
    async session({ session, token }) {
      (session as any).user = token.user;
      return session;
    },
  },
});

export { handler as GET, handler as POST };