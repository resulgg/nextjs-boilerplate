import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <main className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
          aria-label="Go to homepage"
        >
          <div
            className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground"
            aria-hidden="true"
          >
            <GalleryVerticalEnd className="size-4" />
          </div>
          <span>Acme Inc.</span>
        </Link>
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
