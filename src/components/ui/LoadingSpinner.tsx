interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12" data-testid="loading-spinner" role="status">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" aria-hidden="true" />
      <p className="mt-4 text-sm text-gray-500">{message}</p>
    </div>
  );
}
