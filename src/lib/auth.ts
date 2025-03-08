import db from "@/db";
import { account, session, user, verification } from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { VerificationEmail } from "@/components/features/email/verification-email";
import { resendClient } from "@/lib/resend-client";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    schema: {
      user: user,
      session: session,
      account: account,
      verification: verification,
    },
    provider: "pg",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await resendClient.emails.send({
          from: process.env.RESEND_FROM!,
          to: email,
          subject: "Your verification code",
          react: VerificationEmail({ otp }),
        });
      },
    }),
    nextCookies(),
  ],
  advanced: {
    cookiePrefix: "app",
    generateId: false,
  },
});
