"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { emailOtp } from "@/lib/auth-client";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

const ContinueWithEmail = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: EmailFormValues) => {
    try {
      setIsLoading(true);
      const res = await emailOtp.sendVerificationOtp({
        email: data.email,
        type: "sign-in",
      });

      if (res.error) {
        throw new Error(res.error.message);
      }

      if (res.data.success) {
        // Use sessionStorage instead of localStorage for better security
        sessionStorage.setItem("verificationEmail", data.email);
        // Redirect to verify-email page with email as query parameter
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send verification code, please try signing up with Google.";

      toast.error(errorMessage);
      console.error("Failed to send verification code", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        aria-label="Email sign in form"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email-input">Email</FormLabel>
              <FormControl>
                <Input
                  id="email-input"
                  placeholder="you@example.com"
                  type="email"
                  disabled={isLoading}
                  aria-describedby="email-error"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage id="email-error" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isLoading}
          size="lg"
          className="w-full"
          aria-live="polite"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              <span>Sending verification code...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Mail className="h-5 w-5" aria-hidden="true" />
              <span>Continue with Email</span>
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ContinueWithEmail;
