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
      console.error("Google sign-in failed:", error);
      toast.error("Failed to sign in with Google. Please try again.");
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
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          Connecting...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <GoogleIcon />
          Continue with Google
        </span>
      )}
    </Button>
  );
};

export default ContinueWithGoogle;
