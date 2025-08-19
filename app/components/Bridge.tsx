'use client';

import { useState } from 'react';

interface BridgeProps {
  isOpen: boolean;
  onClose: () => void;
  userAddress?: string;
}

export default function Bridge({ isOpen, onClose, userAddress }: BridgeProps) {
  const [selectedTab, setSelectedTab] = useState<'widget' | 'links'>('widget');

  if (!isOpen) return null;

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