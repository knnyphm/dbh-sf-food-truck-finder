export const MapSkeleton = () => {
  return (
    <div className="h-[50vh] w-full rounded border bg-gray-100 animate-pulse flex flex-col gap-3 p-4">
      <div className="h-6 w-1/3 bg-gray-200 rounded" />
      <div className="h-full w-full bg-gray-200 rounded" />
    </div>
  );
};