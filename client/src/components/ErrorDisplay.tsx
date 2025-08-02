import { useCube } from '../lib/stores/useCube';
import { Card, CardContent } from './ui/card';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function ErrorDisplay() {
  const { error, notification, clearError, clearNotification } = useCube();

  if (!error && !notification) return null;

  return (
    <Card className={`bg-black/90 border-gray-600 min-w-[300px] ${
      error ? 'border-red-500' : 'border-green-500'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {error ? (
            <>
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div className="flex-1">
                <div className="text-red-400 font-medium">Error</div>
                <div className="text-red-300 text-sm">{error}</div>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-300"
              >
                ×
              </button>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <div className="text-green-400 font-medium">Success</div>
                <div className="text-green-300 text-sm">{notification}</div>
              </div>
              <button
                onClick={clearNotification}
                className="text-green-400 hover:text-green-300"
              >
                ×
              </button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 