"use client"
import React, { useState } from 'react';
import { ArrowLeft, Search, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

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

  const handleOptionSelect = (gameId: string, option: TopUpOption): void => {
    setSelectedOptions({
      ...selectedOptions,
      [gameId]: option,
    });
  };

  const handlePurchase = async (game: Game): Promise<void> => {
    const selectedOption = selectedOptions[game.id];
    if (!selectedOption) {
      Swal.fire({
        title: 'Please select an amount',
        icon: 'warning',
        confirmButtonColor: '#FF684B',
      });
      return;
    }

    // First popup for game ID
    const { value: gameId, isConfirmed } = await Swal.fire({
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

    if (!isConfirmed) return;

    // Confirmation popup
    const result = await Swal.fire({
      title: 'Confirm Purchase',
      html: `
        <div class="text-left">
          <p><strong>Game:</strong> ${game.name}</p>
          <p><strong>Amount:</strong> ${selectedOption.amount}</p>
          <p><strong>Price:</strong> ${selectedOption.price}</p>
          <p><strong>${game.idLabel}:</strong> ${gameId}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#FF684B',
      cancelButtonColor: '#666666',
      confirmButtonText: 'Confirm Purchase',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      // Success message
      Swal.fire({
        title: 'Purchase Successful!',
        html: `
          <p>Your purchase has been completed.</p>
          <p class="text-sm mt-2">Transaction ID: ${Math.random().toString(36).substr(2, 9)}</p>
        `,
        icon: 'success',
        confirmButtonColor: '#FF684B'
      });

      // Clear selection
      setSelectedOptions({
        ...selectedOptions,
        [game.id]: null,
      });
    }
  };

  return (
    <div className="min-h-screen bg-scroll-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
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
                disabled={!selectedOptions[game.id]}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Topup;