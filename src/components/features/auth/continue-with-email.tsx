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

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const ContinueWithEmail = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
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
        // Store email in localStorage for backup
        localStorage.setItem("verificationEmail", data.email);
        // Redirect to verify-email page with email as query parameter
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      }
    } catch (error) {
      toast.error(
        "Failed to send verification code, please try signing up with Google."
      );
      console.error("Failed to send verification code", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="you@example.com"
                  type="email"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} size="lg" className="w-full">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" />
              Loading...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Mail className="h-5 w-full" />
              Continue with Email
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ContinueWithEmail;
