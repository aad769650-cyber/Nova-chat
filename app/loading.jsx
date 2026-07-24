export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-gradient-primary opacity-20" />
        <span className="absolute inset-2 animate-pulse rounded-full bg-gradient-primary opacity-40" />
        <span className="relative h-3 w-3 rounded-full bg-white" />
      </div>
      <p className="font-data animate-pulse">Loading workspace…</p>
    </div>
  );
}
