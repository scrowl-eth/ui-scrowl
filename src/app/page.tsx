import React from 'react';
import {
  GamepadIcon,
  Wallet,
  Gem,
  Headphones,
} from "lucide-react";
import Link from 'next/link';

const categories = [
  {
    id: "1",
    title: "Game Top Up",
    description: "Fast and secure top up for popular games",
    icon: Wallet,
    items: "2.5k+ items",
    link: "/game-top-up",
  },
  {
    id: "2",
    title: "Game Accounts",
    description: "Verified gaming accounts for sale",
    icon: GamepadIcon,
    items: "1.8k+ items",
    link: "/game-top-up",
  },
  {
    id: "3",
    title: "In-Game Items",
    description: "Rare and valuable gaming items",
    icon: Gem,
    items: "5k+ items",
    link: "/game-top-up",
  },
  {
    id: "4",
    title: "Digital Services",
    description: "Professional gaming services",
    icon: Headphones,
    items: "300+ items",
    link: "/game-top-up",
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFAF4]">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 text-[#333333]">
            The Future of the
            <br />
            Gaming Multiverse
          </h1>
          <p className="text-xl text-[#666666]">
            SCROWL is the leading web3 gaming marketplace.
            <br />
            Scaling gaming for good.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.id}
                  className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow border border-[#FEF0DD] group"
                >
                  <div className="flex flex-col items-start space-y-4">
                    <div className="w-full flex justify-center mb-2">
                      <div className="w-12 h-12 rounded-lg bg-[#FEF0DD] flex items-center justify-center group-hover:bg-[#FFE4C4] transition-colors">
                        <IconComponent className="w-6 h-6 text-[#FF684B]" />
                      </div>
                    </div>
                    <div className="w-full text-center">
                      <h3 className="font-bold text-lg text-[#333333] mb-1">
                        {category.title}
                      </h3>
                      <p className="text-sm text-[#666666] mb-3">
                        {category.description}
                      </p>
                    </div>
                    <div className="w-full flex items-center justify-between">
                      <span className="text-sm text-[#666666]">
                        {category.items}
                      </span>
                      <Link 
                        href={category.link} 
                        className="text-[#FF684B] text-sm font-medium hover:underline"
                      >
                        Browse →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};