import Link from "next/link";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="glass-panel flex max-w-md flex-col items-center gap-4 px-10 py-12 text-center animate-fade-in">
        <span className="text-gradient text-6xl font-bold tracking-tight">404</span>
        <h1 className="text-xl font-semibold text-foreground">
          This page drifted out of orbit
        </h1>
        <p className="text-sm text-muted-foreground">
          Nothing lives at this address. Check the link, or head back to a page that does.
        </p>
        <Link
          href="/"
          className="mt-2 inline-flex items-center justify-center rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
