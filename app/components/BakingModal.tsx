'use client';

import { useEffect } from 'react';

interface BakingModalProps {
  isOpen: boolean;
  isProgress: boolean; // true for "baking in progress", false for "baked successfully"
  onClose: () => void;
  breadAmount?: string;
  autoClose?: boolean; // whether to auto-close success modal
}

export default function BakingModal({ 
  isOpen, 
  isProgress, 
  onClose,
  breadAmount = '',
  autoClose = true
}: BakingModalProps) {
  // Auto-close success modal after 5 seconds
  useEffect(() => {
    if (isOpen && !isProgress && breadAmount && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, isProgress, breadAmount, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
        {!isProgress && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            aria-label="Close"
          >
            ×
          </button>
        )}

        <div className="text-center space-y-6">
          {isProgress ? (
            <>
              {/* Progress State */}
              <div className="relative">
                <div 
                  className="w-16 h-16 mx-auto rounded-full border-4 border-orange-200 animate-spin"
                  style={{ 
                    borderTopColor: '#E16B38',
                    animation: 'spin 1s linear infinite'
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">🍞</span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold" style={{ color: '#E16B38' }}>
                Baking in progress...
              </h2>
              
              <p className="text-gray-600">
                Your BREAD is being baked on the blockchain. This may take a few moments.
              </p>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-green-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold" style={{ color: '#E16B38' }}>
                🍞 Bread baked successfully! 🍞
              </h2>
              
              {breadAmount && (
                <p className="text-lg font-semibold" style={{ color: '#E16B38' }}>
                  {breadAmount} BREAD minted!
                </p>
              )}
              
              <p className="text-gray-600">
                Your transaction has been confirmed on the blockchain.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}