export const LocationLoading = () => {
  return (
    <div className="rounded border border-blue-200 bg-blue-50 text-blue-900 p-4">
      <div className="flex items-center gap-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        Getting your location...
      </div>
    </div>
  );
};
