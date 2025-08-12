'use client';

import { useState, useRef, useEffect } from 'react';
import sdk from '@farcaster/frame-sdk';
import type { Hex } from 'viem';

interface ShareableFrameProps {
  isOpen: boolean;
  onClose: () => void;
  mintAmount: string;
  breadAmount: string;
  txHash: string;
  account: Hex;
}

export default function ShareableFrame({ 
  isOpen, 
  onClose, 
  mintAmount, 
  breadAmount, 
  txHash,
  account 
}: ShareableFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  if (!isOpen) return null;

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const shortenTxHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const handleShareToFarcaster = async () => {
    setIsSharing(true);
    setShareMessage('');
    
    try {
      const shareText = `🍞 Just baked ${breadAmount} BREAD on @breadchain! 

Invested ${mintAmount} xDAI to support the cooperative economy.

All Power To The People ✊

Transaction: https://gnosisscan.io/tx/${txHash}

Bake your own BREAD: ${window.location.origin}`;

      // Try to use Farcaster SDK to create a cast
      await sdk.actions.openUrl(
        `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`
      );
      
      setShareMessage('Opening Farcaster to share...');
    } catch (error) {
      console.error('Error sharing to Farcaster:', error);
      // Fallback to opening Warpcast compose URL
      const shareText = `🍞 Just baked ${breadAmount} BREAD on @breadchain! 

Invested ${mintAmount} xDAI to support the cooperative economy.

All Power To The People ✊

Transaction: https://gnosisscan.io/tx/${txHash}

Bake your own BREAD: ${window.location.origin}`;
      
      window.open(
        `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`,
        '_blank'
      );
      setShareMessage('Opening Warpcast...');
    } finally {
      setTimeout(() => {
        setIsSharing(false);
        setShareMessage('');
      }, 3000);
    }
  };

  const handleDownloadFrame = async () => {
    if (!frameRef.current) return;
    
    try {
      // Import html2canvas dynamically to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(frameRef.current, {
        backgroundColor: '#F5F0E8',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `bread-baked-${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          setShareMessage('Frame downloaded!');
          setTimeout(() => setShareMessage(''), 3000);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error downloading frame:', error);
      setShareMessage('Error downloading frame');
      setTimeout(() => setShareMessage(''), 3000);
    }
  };

  const handleCopyFrame = async () => {
    if (!frameRef.current) return;
    
    try {
      // Import html2canvas dynamically
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(frameRef.current, {
        backgroundColor: '#F5F0E8',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      // Convert to blob and copy to clipboard
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setShareMessage('Frame copied to clipboard!');
            setTimeout(() => setShareMessage(''), 3000);
          } catch (error) {
            console.error('Error copying to clipboard:', error);
            setShareMessage('Error copying to clipboard');
            setTimeout(() => setShareMessage(''), 3000);
          }
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error copying frame:', error);
      setShareMessage('Error copying frame');
      setTimeout(() => setShareMessage(''), 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-center mb-4" style={{ color: '#E16B38' }}>
          🍞 BREAD Successfully Baked! 🍞
        </h2>

        {/* Frame Content */}
        <div 
          ref={frameRef}
          className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-6 mb-4 border-4"
          style={{ borderColor: '#E16B38' }}
        >
          <div className="text-center space-y-4">
            <img 
              src="/bread-coop-logo.png" 
              alt="Bread Cooperative" 
              className="h-20 w-auto mx-auto"
            />
            
            <div className="text-3xl font-bold" style={{ color: '#E16B38' }}>
              {breadAmount} BREAD BAKED!
            </div>
            
            <div className="text-lg text-gray-700">
              Invested <span className="font-bold">{mintAmount} xDAI</span>
            </div>
            
            <div className="text-sm text-gray-600">
              Baker: {shortenAddress(account)}
            </div>
            
            <div className="text-xs text-gray-500">
              TX: {shortenTxHash(txHash)}
            </div>
            
            <div className="pt-4 border-t border-orange-200">
              <p className="text-lg font-bold uppercase tracking-wider" style={{ color: '#E16B38' }}>
                All Power To The People
              </p>
              <p className="text-sm text-gray-600 mt-2">
                The future after capital
              </p>
            </div>
            
            <div className="flex justify-center space-x-2 pt-2">
              <span className="text-xs text-gray-500">bread.coop</span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">@breadchain</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleShareToFarcaster}
            disabled={isSharing}
            className="w-full text-white py-3 px-4 rounded font-bold uppercase tracking-wider transition duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
            style={{ 
              backgroundColor: isSharing ? '#999' : '#8B5CF6',
              cursor: isSharing ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => { if (!isSharing) e.currentTarget.style.backgroundColor = '#7C3AED'; }}
            onMouseLeave={(e) => { if (!isSharing) e.currentTarget.style.backgroundColor = '#8B5CF6'; }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>{isSharing ? 'Opening Farcaster...' : 'Share to Farcaster'}</span>
          </button>

          <div className="flex space-x-3">
            <button
              onClick={handleDownloadFrame}
              className="flex-1 text-white py-3 px-4 rounded font-semibold uppercase tracking-wider transition duration-300"
              style={{ backgroundColor: '#4A90E2' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#357ABD'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4A90E2'}
            >
              Download
            </button>
            
            <button
              onClick={handleCopyFrame}
              className="flex-1 text-white py-3 px-4 rounded font-semibold uppercase tracking-wider transition duration-300"
              style={{ backgroundColor: '#10B981' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10B981'}
            >
              Copy
            </button>
          </div>
        </div>

        {/* Share Message */}
        {shareMessage && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded text-center font-semibold">
            {shareMessage}
          </div>
        )}
      </div>
    </div>
  );
}