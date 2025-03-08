import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, useSession, emailOtp, signOut, getSession } =
  createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL!,
    plugins: [emailOTPClient()],
  });
