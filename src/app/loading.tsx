export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 animate-pulse" />
        <h2 className="font-display text-xl font-semibold text-neutral-900">
          Loading Lowther...
        </h2>
        <p className="text-neutral-600 mt-2">
          Preparing your audio experience
        </p>
      </div>
    </div>
  );
}
