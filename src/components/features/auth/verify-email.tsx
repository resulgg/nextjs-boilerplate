"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { emailOtp, signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const verifyEmailSchema = z.object({
  otp: z
    .string()
    .min(6, "Verification code must be 6 digits")
    .max(6, "Verification code must be 6 digits")
    .regex(/^\d+$/, "Verification code must contain only numbers"),
});

type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

const VerifyEmail = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [countdown, setCountdown] = useState(60); // Reduced from 300 to 60 seconds
  const [canResend, setCanResend] = useState(false);

  const form = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    // Get email from URL query parameters
    const emailFromUrl = searchParams.get("email");

    if (emailFromUrl) {
      setEmail(emailFromUrl);
    } else {
      // Fallback to sessionStorage if not in URL
      const storedEmail = sessionStorage.getItem("verificationEmail") || "";
      setEmail(storedEmail);

      // If no email is found, redirect to sign-in
      if (!storedEmail) {
        toast.error("Email not found. Please try signing in again.");
        router.push("/sign-in");
      }
    }

    // Set up countdown for resend button
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend, searchParams, router]);

  const onSubmit = async (data: VerifyEmailFormValues) => {
    try {
      setIsLoading(true);

      if (!email) {
        toast.error("Email not found. Please try signing in again.");
        router.push("/sign-in");
        return;
      }

      const response = await signIn.emailOtp({
        email: email,
        otp: data.otp,
      });

      if (response.error) {
        throw new Error(response.error.message || "Verification failed");
      }

      // Clear the stored email from sessionStorage after successful verification
      sessionStorage.removeItem("verificationEmail");

      toast.success("Email verified successfully!");

      // Redirect to dashboard or home page after successful verification
      router.push("/dashboard");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to verify email. Please check your code and try again.";

      console.error("Verification failed:", error);
      toast.error(errorMessage);

      // Reset the form if verification fails
      form.reset({ otp: "" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);

      if (!email) {
        toast.error("Email not found. Please try signing in again.");
        router.push("/sign-in");
        return;
      }

      const res = await emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
      });

      if (res.error) {
        throw new Error(res.error.message);
      }

      toast.success("Verification code resent successfully!");
      setCountdown(60);
      setCanResend(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to resend verification code. Please try again.";

      console.error("Failed to resend verification code:", error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
      role="main"
      aria-labelledby="verify-email-title"
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle id="verify-email-title" className="text-xl">
            Verify your email
          </CardTitle>
          <CardDescription>
            We&apos;ve sent a verification code to{" "}
            <span className="font-medium">{email || "your email"}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                aria-label="Email verification form"
              >
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="otp-input" className="sr-only">
                        Verification Code
                      </FormLabel>
                      <FormControl>
                        <InputOTP
                          id="otp-input"
                          pattern="[1-9][0-9]*|0"
                          maxLength={6}
                          disabled={isLoading}
                          containerClassName="justify-center gap-2"
                          aria-describedby="otp-error"
                          {...field}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage id="otp-error" />
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
                      <Loader2
                        className="h-5 w-5 animate-spin"
                        aria-hidden="true"
                      />
                      <span>Verifying...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-5 w-5" aria-hidden="true" />
                      <span>Verify Email</span>
                    </span>
                  )}
                </Button>
              </form>
            </Form>
            <div className="text-center text-sm">
              Didn&apos;t receive a code?{" "}
              {canResend ? (
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal underline underline-offset-4"
                  onClick={handleResendCode}
                  disabled={isLoading}
                  aria-live="polite"
                >
                  Resend code
                </Button>
              ) : (
                <span className="text-muted-foreground" aria-live="polite">
                  Resend code in {countdown}s
                </span>
              )}
            </div>
            <div className="text-center text-sm">
              <Button
                variant="link"
                className="p-0 h-auto font-normal underline underline-offset-4"
                onClick={() => router.push("/sign-in")}
              >
                Back to sign in
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
