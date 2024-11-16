// src/app/game-top-up/page.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

// Import your contract ABI
import GameTopUpABI from "../../data/SCROWL_ABI.json"

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_GAME_TOPUP_CONTRACT_ADDRESS as `0x${string}`;

interface TopUpOption {
  amount: string;
  price: string;
}

interface Game {
  id: string;
  name: string;
  publisher: string;
  rating: number;
  reviewCount: string;
  idLabel: string;
  topUpOptions: TopUpOption[];
  trending: boolean;
}

interface SelectedOptions {
  [key: string]: TopUpOption | null;
}

const games: Game[] = [
  {
    id: 'valorant',
    name: 'Valorant',
    publisher: 'Riot Games',
    rating: 4.8,
    reviewCount: '50K+',
    idLabel: 'Riot ID',
    topUpOptions: [
      { amount: '300 VP', price: '$2.99' },
      { amount: '625 VP', price: '$5.99' },
      { amount: '1125 VP', price: '$9.99' },
      { amount: '2400 VP', price: '$19.99' },
    ],
    trending: true,
  },
  {
    id: 'pubg',
    name: 'PUBG Mobile',
    publisher: 'Tencent Games',
    rating: 4.6,
    reviewCount: '100K+',
    idLabel: 'PUBG Mobile ID',
    topUpOptions: [
      { amount: '60 UC', price: '$0.99' },
      { amount: '300 UC', price: '$4.99' },
      { amount: '600 UC', price: '$9.99' },
      { amount: '1500 UC', price: '$24.99' },
    ],
    trending: true,
  },
  {
    id: 'mlbb',
    name: 'Mobile Legends',
    publisher: 'Moonton',
    rating: 4.7,
    reviewCount: '75K+',
    idLabel: 'Mobile Legends ID',
    topUpOptions: [
      { amount: '100 Diamonds', price: '$1.99' },
      { amount: '250 Diamonds', price: '$4.99' },
      { amount: '500 Diamonds', price: '$9.99' },
      { amount: '1000 Diamonds', price: '$19.99' },
    ],
    trending: false,
  },
];

const Topup: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const { address, isConnected } = useAccount();

  const {
    writeContract,
    data: hash,
    isError: isWriteError,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
    data: transactionReceipt,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const handleOptionSelect = (gameId: string, option: TopUpOption) => {
    setSelectedOptions(prev => ({
      ...prev,
      [gameId]: option
    }));
  };


  const handlePurchase = async (game: Game): Promise<void> => {
    try {
      if (!isConnected) {
        const { isConfirmed } = await Swal.fire({
          title: 'Wallet Not Connected',
          text: 'Please connect your wallet to make a purchase',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#FF684B',
          confirmButtonText: 'Connect Wallet',
        });

        if (isConfirmed) {
        }
        return;
      }

      const selectedOption = selectedOptions[game.id];
      if (!selectedOption) {
        await Swal.fire({
          title: 'Select Amount',
          text: 'Please select a top-up amount',
          icon: 'warning',
          confirmButtonColor: '#FF684B',
        });
        return;
      }

      // Get game ID
      const { value: gameId, isConfirmed: idConfirmed } = await Swal.fire({
        title: `Enter your ${game.idLabel}`,
        input: 'text',
        inputLabel: 'Please enter your in-game ID',
        inputPlaceholder: 'Enter ID here...',
        showCancelButton: true,
        confirmButtonColor: '#FF684B',
        cancelButtonColor: '#666666',
        inputValidator: (value) => {
          if (!value) {
            return 'Please enter your game ID!';
          }
          return null;
        }
      });

      if (!idConfirmed || !gameId) return;

      // Parse amount and calculate price
      const amount = parseInt(selectedOption.amount.split(' ')[0]);
      const priceInUSD = parseFloat(selectedOption.price.replace('$', ''));
      const priceInEth = (priceInUSD * 0.0005).toFixed(18);

      // Confirm purchase details
      const { isConfirmed: purchaseConfirmed } = await Swal.fire({
        title: 'Confirm Purchase',
        html: `
          <div class="text-left">
            <p><strong>Game:</strong> ${game.name}</p>
            <p><strong>Amount:</strong> ${selectedOption.amount}</p>
            <p><strong>Price:</strong> ${priceInEth} ETH</p>
            <p><strong>${game.idLabel}:</strong> ${gameId}</p>
            <p><strong>Wallet:</strong> ${address}</p>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#FF684B',
        cancelButtonColor: '#666666',
        confirmButtonText: 'Confirm Purchase',
        cancelButtonText: 'Cancel'
      });

      if (!purchaseConfirmed) return;


      const newPrice = parseInt(priceInEth)

      console.log(game.id, gameId, amount, priceInEth, BigInt(newPrice))
      console.log(CONTRACT_ADDRESS)
      // Call contract
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: GameTopUpABI,
        functionName: "purchaseTopUp",
        args: [game.id, gameId, amount],
        value: BigInt(newPrice)
      });
      // Show processing message
      await Swal.fire({
        title: 'Processing Transaction',
        html: 'Please confirm the transaction in your wallet...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

    } catch (error) {
      console.error("Purchase failed:", error);
      await Swal.fire({
        title: 'Transaction Failed',
        text: error instanceof Error ? error.message : 'Unknown error occurred',
        icon: 'error',
        confirmButtonColor: '#FF684B',
      });
    }
  };

  // Handle write errors
  useEffect(() => {
    if (isWriteError && writeError) {
      Swal.fire({
        title: 'Transaction Failed',
        text: writeError.message,
        icon: 'error',
        confirmButtonColor: '#FF684B',
      });
    }
  }, [isWriteError, writeError]);

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && transactionReceipt) {
      Swal.fire({
        title: 'Purchase Successful!',
        html: `
          <p>Your purchase has been completed.</p>
          <p class="text-sm mt-2">Transaction Hash: ${hash}</p>
        `,
        icon: 'success',
        confirmButtonColor: '#FF684B',
      });

      // Clear selection
      setSelectedOptions({});
    } else if (confirmError) {
      Swal.fire({
        title: 'Transaction Failed',
        text: confirmError.message,
        icon: 'error',
        confirmButtonColor: '#FF684B',
      });
    }
  }, [isConfirmed, confirmError, transactionReceipt, hash]);

  return (
    <div className="min-h-screen bg-scroll-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="inline-flex items-center text-charcoal hover:text-primary">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-xl">Back to Categories</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12">
          <div className="absolute inset-y-0 left-6 flex items-center">
            <Search className="w-5 h-5 text-charcoal-30" />
          </div>
          <input
            type="text"
            placeholder="Search games..."
            className="w-full pl-14 pr-6 py-4 rounded-2xl border-0 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-lg"
          />
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Game Header */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-2xl font-bold text-charcoal mb-1">{game.name}</h3>
                  <p className="text-base text-charcoal-50">{game.publisher}</p>
                </div>
                {game.trending && (
                  <div className="flex items-center bg-success-bg px-3 py-1 rounded-full">
                    <TrendingUp className="w-3.5 h-3.5 text-success mr-1" />
                    <span className="text-xs text-success">Trend</span>
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center mb-8">
                <div className="flex items-center">
                  <span className="text-2xl font-semibold text-charcoal mr-2">{game.rating}</span>
                  <span className="text-sm text-charcoal-50">({game.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Top Up Options */}
              <div className="grid grid-cols-2 gap-3">
                {game.topUpOptions.map((option, index) => (
                  <button
                    key={index}
                    className={`p-4 rounded-2xl bg-white border transition-colors duration-200
                      ${selectedOptions[game.id] === option 
                        ? 'border-primary bg-secondary/20' 
                        : 'border-secondary hover:border-primary hover:bg-secondary/10'}`}
                    onClick={() => handleOptionSelect(game.id, option)}
                  >
                    <div className="text-sm font-medium text-charcoal mb-1">{option.amount}</div>
                    <div className="text-primary font-semibold">{option.price}</div>
                  </button>
                ))}
              </div>

              {/* Purchase Button */}
              <button
                className="w-full mt-6 py-3 px-4 bg-primary text-white rounded-xl font-medium 
                  hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 
                  disabled:cursor-not-allowed"
                onClick={() => handlePurchase(game)}
                disabled={!selectedOptions[game.id] || isConfirming}
              >
                {isConfirming ? 'Processing...' : 'Buy Now'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Topup;