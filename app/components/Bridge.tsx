'use client';

import { useState, useEffect } from 'react';
import sdk from '@farcaster/frame-sdk';

interface BridgeProps {
  isOpen: boolean;
  onClose: () => void;
  userAddress?: string;
}

export default function Bridge({ isOpen, onClose, userAddress }: BridgeProps) {
  const [selectedTab, setSelectedTab] = useState<'farcaster' | 'widget' | 'links'>('farcaster');
  const [isInFarcaster, setIsInFarcaster] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapMessage, setSwapMessage] = useState<string>('');
  const [swapAmount, setSwapAmount] = useState<string>('0.01');
  const [selectedFromToken, setSelectedFromToken] = useState<string>('eth-mainnet');

  // Check if we're in Farcaster context
  useEffect(() => {
    const checkFarcasterContext = async () => {
      try {
        const isInMiniApp = await sdk.isInMiniApp();
        setIsInFarcaster(isInMiniApp);
        if (isInMiniApp) {
          setSelectedTab('farcaster');
        } else {
          setSelectedTab('widget');
        }
      } catch (error) {
        console.log('Not in Farcaster context:', error);
        setIsInFarcaster(false);
        setSelectedTab('widget');
      }
    };

    if (isOpen) {
      checkFarcasterContext();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Token options for swapping to xDAI
  const fromTokenOptions = [
    { 
      id: 'eth-mainnet', 
      name: 'ETH (Ethereum)', 
      caip19: 'eip155:1/native',
      symbol: 'ETH'
    },
    { 
      id: 'usdc-mainnet', 
      name: 'USDC (Ethereum)', 
      caip19: 'eip155:1/erc20:0xA0b86a33E6441f8C1f4d1a4B1Dd1ec0e2e52bdf7',
      symbol: 'USDC'
    },
    { 
      id: 'usdc-base', 
      name: 'USDC (Base)', 
      caip19: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      symbol: 'USDC'
    },
    { 
      id: 'eth-base', 
      name: 'ETH (Base)', 
      caip19: 'eip155:8453/native',
      symbol: 'ETH'
    },
    { 
      id: 'eth-arbitrum', 
      name: 'ETH (Arbitrum)', 
      caip19: 'eip155:42161/native',
      symbol: 'ETH'
    },
    { 
      id: 'usdc-arbitrum', 
      name: 'USDC (Arbitrum)', 
      caip19: 'eip155:42161/erc20:0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      symbol: 'USDC'
    }
  ];

  const selectedToken = fromTokenOptions.find(token => token.id === selectedFromToken) || fromTokenOptions[0];

  const handleFarcasterSwap = async () => {
    if (!isInFarcaster) {
      setSwapMessage('Farcaster wallet not available');
      return;
    }

    setIsSwapping(true);
    setSwapMessage('Initiating swap...');

    try {
      // Calculate amount in smallest unit (wei for ETH, base units for tokens)
      const amount = parseFloat(swapAmount);
      let sellAmount: string;
      
      if (selectedToken.symbol === 'ETH') {
        // ETH: convert to wei (18 decimals)
        sellAmount = (amount * Math.pow(10, 18)).toString();
      } else if (selectedToken.symbol === 'USDC') {
        // USDC: convert to base units (6 decimals)
        sellAmount = (amount * Math.pow(10, 6)).toString();
      } else {
        // Default to 18 decimals
        sellAmount = (amount * Math.pow(10, 18)).toString();
      }

      const result = await sdk.actions.swapToken({
        sellToken: selectedToken.caip19,
        buyToken: 'eip155:100/native', // xDAI on Gnosis Chain
        sellAmount: sellAmount
      });

      if (result.success) {
        setSwapMessage(`Swap successful! Transaction${result.swap.transactions.length > 1 ? 's' : ''}: ${result.swap.transactions.join(', ')}`);
        setTimeout(() => {
          setSwapMessage('');
          onClose();
        }, 5000);
      } else {
        let errorMsg = 'Swap failed';
        if (result.reason === 'rejected_by_user') {
          errorMsg = 'Swap cancelled by user';
        } else if (result.error?.message) {
          errorMsg = `Swap failed: ${result.error.message}`;
        }
        setSwapMessage(errorMsg);
      }
    } catch (error: any) {
      console.error('Swap error:', error);
      setSwapMessage(`Error: ${error.message || 'Failed to initiate swap'}`);
    } finally {
      setIsSwapping(false);
      setTimeout(() => setSwapMessage(''), 5000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#E16B38' }}>
              GET xDAI FOR BAKING BREAD
            </h2>
            <p className="text-gray-600 mt-1">
              Bridge tokens to Gnosis Chain to get xDAI for minting BREAD
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {isInFarcaster && (
              <button
                onClick={() => setSelectedTab('farcaster')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  selectedTab === 'farcaster'
                    ? 'border-b-2 text-orange-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                style={{
                  borderBottomColor: selectedTab === 'farcaster' ? '#E16B38' : 'transparent'
                }}
              >
                🚀 Farcaster Swap
              </button>
            )}
            <button
              onClick={() => setSelectedTab('widget')}
              className={`px-6 py-3 font-semibold transition-colors ${
                selectedTab === 'widget'
                  ? 'border-b-2 text-orange-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              style={{
                borderBottomColor: selectedTab === 'widget' ? '#E16B38' : 'transparent'
              }}
            >
              Bridge Widget
            </button>
            <button
              onClick={() => setSelectedTab('links')}
              className={`px-6 py-3 font-semibold transition-colors ${
                selectedTab === 'links'
                  ? 'border-b-2 text-orange-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              style={{
                borderBottomColor: selectedTab === 'links' ? '#E16B38' : 'transparent'
              }}
            >
              External Bridges
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {selectedTab === 'farcaster' && isInFarcaster && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-4">
                <p className="text-purple-800 text-sm">
                  <strong>🚀 Farcaster Native Swap:</strong> Use your Farcaster wallet to swap tokens directly to xDAI on Gnosis Chain. Fast, secure, and seamless!
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 uppercase text-sm tracking-wider">
                    From Token
                  </label>
                  <select
                    value={selectedFromToken}
                    onChange={(e) => setSelectedFromToken(e.target.value)}
                    className="w-full px-4 py-3 border-2 rounded focus:outline-none focus:border-orange-400"
                    style={{ borderColor: '#E16B38' }}
                    disabled={isSwapping}
                  >
                    {fromTokenOptions.map((token) => (
                      <option key={token.id} value={token.id}>
                        {token.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 uppercase text-sm tracking-wider">
                    Amount to Swap
                  </label>
                  <input
                    type="number"
                    value={swapAmount}
                    onChange={(e) => setSwapAmount(e.target.value)}
                    className="w-full px-4 py-3 border-2 rounded focus:outline-none focus:border-orange-400"
                    style={{ borderColor: '#E16B38' }}
                    placeholder="0.01"
                    step="0.001"
                    min="0"
                    disabled={isSwapping}
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    You will receive approximately {swapAmount} xDAI on Gnosis Chain
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Swap Details:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>From:</span>
                      <span>{selectedToken.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>To:</span>
                      <span>xDAI (Gnosis Chain)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span>{swapAmount} {selectedToken.symbol}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleFarcasterSwap}
                  disabled={isSwapping || !swapAmount || parseFloat(swapAmount) <= 0}
                  className="w-full text-white py-4 px-6 rounded font-bold uppercase tracking-wider transition duration-300 disabled:opacity-50"
                  style={{ 
                    backgroundColor: isSwapping ? '#999' : '#8B5CF6',
                    cursor: isSwapping || !swapAmount || parseFloat(swapAmount) <= 0 ? 'not-allowed' : 'pointer'
                  }}
                  onMouseEnter={(e) => { 
                    if (!isSwapping && swapAmount && parseFloat(swapAmount) > 0) {
                      e.currentTarget.style.backgroundColor = '#7C3AED';
                    }
                  }}
                  onMouseLeave={(e) => { 
                    if (!isSwapping && swapAmount && parseFloat(swapAmount) > 0) {
                      e.currentTarget.style.backgroundColor = '#8B5CF6';
                    }
                  }}
                >
                  {isSwapping ? 'Swapping...' : '🚀 Swap with Farcaster'}
                </button>

                {swapMessage && (
                  <div className={`p-3 rounded text-center font-semibold ${
                    swapMessage.includes('successful') 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : swapMessage.includes('Error') || swapMessage.includes('failed')
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : 'bg-blue-100 text-blue-700 border border-blue-300'
                  }`}>
                    {swapMessage}
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'widget' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800 text-sm">
                  <strong>💡 Tip:</strong> Use the bridge widget below to transfer ETH, USDC, or other tokens from Ethereum, Polygon, or other networks to get xDAI on Gnosis Chain.
                </p>
              </div>
              
              {/* Jumper.exchange Widget */}
              <div className="border rounded-lg overflow-hidden" style={{ height: '600px' }}>
                <iframe
                  src={`https://jumper.exchange/?toChain=100&toToken=0x0000000000000000000000000000000000000000${userAddress ? `&toAddress=${userAddress}` : ''}`}
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  title="Jumper Bridge to Gnosis Chain"
                />
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                Powered by Jumper.exchange - Bridge aggregator supporting multiple routes to Gnosis Chain
              </div>
            </div>
          )}

          {selectedTab === 'links' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  <strong>⚠️ Note:</strong> These external bridges will open in new tabs. Make sure to return here after bridging to mint your BREAD!
                </p>
              </div>

              <div className="grid gap-4">
                {/* Official Gnosis Bridge */}
                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">Gnosis Bridge (Official)</h3>
                      <p className="text-sm text-gray-600">
                        Bridge ETH from Ethereum mainnet to xDAI on Gnosis Chain
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended • Low fees • Most secure
                      </p>
                    </div>
                    <a
                      href="https://bridge.gnosischain.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded font-semibold text-white transition-colors"
                      style={{ backgroundColor: '#E16B38' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C55A2B'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E16B38'}
                    >
                      Bridge ETH
                    </a>
                  </div>
                </div>

                {/* Jumper Exchange */}
                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">Jumper.exchange</h3>
                      <p className="text-sm text-gray-600">
                        Bridge from 20+ chains including Ethereum, Polygon, Arbitrum, and more
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Multi-chain • Best rates • Multiple tokens supported
                      </p>
                    </div>
                    <a
                      href="https://jumper.exchange/?toChain=100&toToken=0x0000000000000000000000000000000000000000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded font-semibold text-white transition-colors"
                      style={{ backgroundColor: '#4A90E2' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#357ABD'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4A90E2'}
                    >
                      Bridge Tokens
                    </a>
                  </div>
                </div>

                {/* Socket Bridge */}
                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">Socket Bridge</h3>
                      <p className="text-sm text-gray-600">
                        Cross-chain bridge aggregator with competitive rates
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Fast • Multiple routes • Good for larger amounts
                      </p>
                    </div>
                    <a
                      href="https://socket.tech/bridge?destChainId=100&destToken=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded font-semibold text-white transition-colors"
                      style={{ backgroundColor: '#10B981' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10B981'}
                    >
                      Use Socket
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">How it works:</h4>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Choose a bridge service above</li>
                  <li>Connect your wallet and select source chain/token</li>
                  <li>Set destination to Gnosis Chain (Chain ID: 100)</li>
                  <li>Confirm the bridge transaction</li>
                  <li>Wait for tokens to arrive (usually 5-20 minutes)</li>
                  <li>Return here to mint BREAD with your new xDAI!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Need help? Check the{' '}
              <a
                href="https://docs.gnosischain.com/bridges/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-800"
              >
                Gnosis Chain bridge documentation
              </a>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded font-semibold text-white transition-colors"
              style={{ backgroundColor: '#E16B38' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C55A2B'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E16B38'}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}