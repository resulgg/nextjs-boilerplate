import Link from "next/link";
import ContinueWithEmail from "@/components/features/auth/continue-with-email";
import ContinueWithGoogle from "@/components/features/auth/continue-with-google";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SignIn = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
      role="region"
      aria-labelledby="sign-in-title"
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle id="sign-in-title" className="text-xl">
            Welcome back
          </CardTitle>
          <CardDescription>
            Sign in with your Email or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <ContinueWithGoogle />
            </div>
            <div
              className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"
              role="separator"
              aria-orientation="horizontal"
            >
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
            <div className="grid gap-6">
              <ContinueWithEmail />
            </div>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="underline underline-offset-4"
                aria-label="Go to sign up page"
              >
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our{" "}
        <Link href="/terms-of-service" aria-label="Read terms of service">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy-policy" aria-label="Read privacy policy">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
};

export default SignIn;
