'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  const getStyles = () => {
    switch (type) {
      case 'danger':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-orange-200 bg-orange-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getButtonStyle = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning':
        return 'bg-orange-600 hover:bg-orange-700 text-white';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] p-4">
      <Card className={`w-full max-w-md border-2 ${getStyles()}`}>
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">{title}</h2>
              <p className="text-sm text-gray-700 mt-2">{message}</p>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="secondary"
              onClick={onCancel}
              disabled={isLoading}
              className="px-6"
            >
              {cancelText}
            </Button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${getButtonStyle()}`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {confirmText}ing...
                </span>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
