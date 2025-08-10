import type { LocationErrorProps } from "./LocationError.types";

export const LocationError = ({ error, onRetry }: LocationErrorProps) => {
  return (
    <div className="rounded border border-red-200 bg-red-50 text-red-900 p-4">
      <div className="mb-3">
        <h3 className="font-semibold text-red-800 mb-2">Location Error</h3>
        <p className="text-sm">{error}</p>
      </div>
      
      <button
        type="button"
        onClick={onRetry}
        className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};
