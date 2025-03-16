"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import GoogleIcon from "@/components/icons/google-icon";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

const ContinueWithGoogle = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn.social({
        provider: "google",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to sign in with Google. Please try again.";

      console.error("Google sign-in failed:", error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      size="lg"
      variant="outline"
      aria-label="Continue with Google"
      aria-live="polite"
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          <span>Connecting to Google...</span>
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <GoogleIcon aria-hidden="true" />
          <span>Continue with Google</span>
        </span>
      )}
    </Button>
  );
};

export default ContinueWithGoogle;
