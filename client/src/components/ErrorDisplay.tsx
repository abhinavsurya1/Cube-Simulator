import { useCube } from '../lib/stores/useCube';
import { Alert, AlertDescription } from './ui/alert';
import { X } from 'lucide-react';
import { Button } from './ui/button';

export default function ErrorDisplay() {
  const { error, clearError } = useCube();

  if (!error) return null;

  return (
    <Alert className="bg-red-900/80 border-red-600 text-red-100 max-w-md">
      <X className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <strong>Solver Error:</strong> {error}
        </div>
        <Button
          onClick={clearError}
          variant="ghost"
          size="sm"
          className="text-red-100 hover:text-red-200 hover:bg-red-800"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
} 