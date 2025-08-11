'use client';

import { useState, useEffect } from 'react';
import { createPublicClient, createWalletClient, custom, formatEther, parseEther, type Hex } from 'viem';
import { gnosis } from './lib/chains';
import { breadAbi } from './lib/breadAbi';
import { BREAD_CONTRACT_ADDRESS } from './config';

export default function Page() {
  const [account, setAccount] = useState<Hex | null>(null);
  const [xdaiBalance, setXdaiBalance] = useState<string>('0');
  const [breadBalance, setBreadBalance] = useState<string>('0');
  const [mintAmount, setMintAmount] = useState<string>('0.01');
  const [burnAmount, setBurnAmount] = useState<string>('1');
  const [receiver, setReceiver] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const [publicClient, setPublicClient] = useState<any>(null);
  const [walletClient, setWalletClient] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      setPublicClient(createPublicClient({
        chain: gnosis,
        transport: custom(window.ethereum),
      }));
      setWalletClient(createWalletClient({
        chain: gnosis,
        transport: custom(window.ethereum),
      }));
    }
  }, []);

  useEffect(() => {
    if (walletClient && publicClient) {
      connectWallet();
    }
  }, [walletClient, publicClient]);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setMessage('Please install MetaMask');
        return;
      }
      
      if (!walletClient || !publicClient) {
        return;
      }

      // Switch to Gnosis chain first
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x64' }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x64',
                chainName: 'Gnosis',
                nativeCurrency: {
                  name: 'xDai',
                  symbol: 'xDAI',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc.gnosischain.com'],
                blockExplorerUrls: ['https://gnosisscan.io'],
              },
            ],
          });
        }
      }

      const accounts = await walletClient.requestAddresses();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setReceiver(accounts[0]);
        await updateBalances(accounts[0]);
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setMessage('Error connecting wallet');
    }
  };

  const updateBalances = async (address: Hex) => {
    if (!publicClient) return;
    
    try {
      console.log('Fetching balances for address:', address);
      
      // Fetch xDAI balance
      const xdai = await publicClient.getBalance({ address });
      console.log('xDAI balance (wei):', xdai.toString());
      setXdaiBalance(formatEther(xdai));

      // Fetch BREAD balance
      const bread = await publicClient.readContract({
        address: BREAD_CONTRACT_ADDRESS as Hex,
        abi: breadAbi,
        functionName: 'balanceOf',
        args: [address],
      }) as bigint;
      console.log('BREAD balance (wei):', bread.toString());
      setBreadBalance(formatEther(bread));
    } catch (error) {
      console.error('Error fetching balances:', error);
      setMessage('Error fetching balances');
    }
  };

  const handleMint = async () => {
    if (!account) {
      setMessage('Please connect your wallet');
      return;
    }
    
    if (!walletClient || !publicClient) {
      setMessage('Wallet not connected');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const { request } = await publicClient.simulateContract({
        account,
        address: BREAD_CONTRACT_ADDRESS as Hex,
        abi: breadAbi,
        functionName: 'mint',
        args: [(receiver || account) as Hex],
        value: parseEther(mintAmount),
      });

      const hash = await walletClient.writeContract(request);
      setMessage(`Transaction sent: ${hash}`);
      
      await publicClient.waitForTransactionReceipt({ hash });
      setMessage('Mint successful! Bake that BREAD!');
      await updateBalances(account);
    } catch (error: any) {
      console.error('Mint error:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBurn = async () => {
    if (!account) {
      setMessage('Please connect your wallet');
      return;
    }
    
    if (!walletClient || !publicClient) {
      setMessage('Wallet not connected');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const { request } = await publicClient.simulateContract({
        account,
        address: BREAD_CONTRACT_ADDRESS as Hex,
        abi: breadAbi,
        functionName: 'burn',
        args: [parseEther(burnAmount), (receiver || account) as Hex],
      });

      const hash = await walletClient.writeContract(request);
      setMessage(`Transaction sent: ${hash}`);
      
      await publicClient.waitForTransactionReceipt({ hash });
      setMessage('Burn successful!');
      await updateBalances(account);
    } catch (error: any) {
      console.error('Burn error:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F0E8' }}>
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <img src="/bread-coop-logo.svg" alt="Bread Cooperative" className="w-20 h-20 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wide" style={{ color: '#E16B38', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Bread Cooperative
            </h1>
          </div>
          <p className="text-xl text-gray-800 mb-2 italic">The future after capital</p>
          <p className="text-lg text-gray-600">Bake Bread • Mint and Burn BREAD on Gnosis Chain</p>
          <p className="text-sm text-gray-500 mt-4 uppercase tracking-wider">All Power To The People</p>
        </header>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-2" style={{ borderColor: '#E16B38' }}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold uppercase mb-4" style={{ color: '#E16B38' }}>Wallet Status</h2>
              {account ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-semibold text-gray-700">Connected:</span>
                    <span className="font-mono text-sm">{account.slice(0, 6)}...{account.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-semibold text-gray-700">xDAI Balance:</span>
                    <span className="font-mono">{parseFloat(xdaiBalance).toFixed(4)} xDAI</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-semibold text-gray-700">BREAD Balance:</span>
                    <span className="font-mono font-bold" style={{ color: '#E16B38' }}>{parseFloat(breadBalance).toFixed(4)} BREAD</span>
                  </div>
                  <button
                    onClick={() => updateBalances(account)}
                    className="w-full mt-4 text-white py-2 px-4 rounded font-semibold uppercase tracking-wider transition duration-200"
                    style={{ backgroundColor: '#4A90E2' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#357ABD'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4A90E2'}
                  >
                    Refresh Balances
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="w-full text-white py-3 px-6 rounded font-bold uppercase tracking-wider transition duration-300"
                  style={{ backgroundColor: '#E16B38' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C55A2B'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E16B38'}
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-2" style={{ borderColor: '#E16B38' }}>
            <h2 className="text-2xl font-bold uppercase mb-6" style={{ color: '#E16B38' }}>Mint BREAD</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 uppercase text-sm tracking-wider">Amount (xDAI to send)</label>
                <input
                  type="number"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded focus:outline-none focus:border-orange-400"
                  style={{ borderColor: '#E16B38' }}
                  placeholder="0.01"
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 uppercase text-sm tracking-wider">Receiver Address</label>
                <input
                  type="text"
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded focus:outline-none focus:border-orange-400 font-mono text-sm"
                  style={{ borderColor: '#E16B38' }}
                  placeholder="0x..."
                />
              </div>
              <button
                onClick={handleMint}
                disabled={isLoading || !account}
                className="w-full text-white py-4 px-6 rounded font-bold uppercase tracking-wider transition duration-300 disabled:opacity-50"
                style={{ 
                  backgroundColor: isLoading || !account ? '#999' : '#E16B38',
                  cursor: isLoading || !account ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => { if (!isLoading && account) e.currentTarget.style.backgroundColor = '#C55A2B'; }}
                onMouseLeave={(e) => { if (!isLoading && account) e.currentTarget.style.backgroundColor = '#E16B38'; }}
              >
                {isLoading ? 'Processing...' : 'BAKE BREAD'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-2" style={{ borderColor: '#4A90E2' }}>
            <h2 className="text-2xl font-bold uppercase mb-6" style={{ color: '#4A90E2' }}>Burn BREAD</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 uppercase text-sm tracking-wider">Amount (BREAD to burn)</label>
                <input
                  type="number"
                  value={burnAmount}
                  onChange={(e) => setBurnAmount(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded focus:outline-none focus:border-blue-400"
                  style={{ borderColor: '#4A90E2' }}
                  placeholder="1"
                  step="0.1"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 uppercase text-sm tracking-wider">Receiver Address</label>
                <input
                  type="text"
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded focus:outline-none focus:border-blue-400 font-mono text-sm"
                  style={{ borderColor: '#4A90E2' }}
                  placeholder="0x..."
                />
              </div>
              <button
                onClick={handleBurn}
                disabled={isLoading || !account}
                className="w-full text-white py-4 px-6 rounded font-bold uppercase tracking-wider transition duration-300 disabled:opacity-50"
                style={{ 
                  backgroundColor: isLoading || !account ? '#999' : '#4A90E2',
                  cursor: isLoading || !account ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => { if (!isLoading && account) e.currentTarget.style.backgroundColor = '#357ABD'; }}
                onMouseLeave={(e) => { if (!isLoading && account) e.currentTarget.style.backgroundColor = '#4A90E2'; }}
              >
                {isLoading ? 'Processing...' : 'BURN BREAD'}
              </button>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg text-center font-semibold ${message.includes('Error') ? 'bg-red-100 text-red-700 border-2 border-red-300' : 'bg-green-100 text-green-700 border-2 border-green-300'}`}>
              {message}
            </div>
          )}

          <div className="text-center mt-12 space-y-4">
            <a
              href={`https://gnosisscan.io/address/${BREAD_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-semibold uppercase tracking-wider underline transition duration-200"
              style={{ color: '#E16B38' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#C55A2B'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#E16B38'}
            >
              View Contract on Gnosisscan
            </a>
            <div className="text-sm text-gray-600">
              <p className="font-semibold">BREAD Solidarity Fund • BREAD Savings • BREAD Insurance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}