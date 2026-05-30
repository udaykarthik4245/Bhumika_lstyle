export function ProductCardSkeleton() {
  return (
    <div className="card">
      <div className="aspect-[3/4] skeleton rounded-none" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-8 w-full mt-2" />
      </div>
    </div>
  );
}
