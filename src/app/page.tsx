// app/page.tsx
import {
  GamepadIcon,
  KeyRound,
  Wallet,
  ShoppingBag,
  Gem,
  Gift,
  Users,
  Smartphone,
  PlaySquare,
  Headphones,
} from "lucide-react";

const categories = [
  {
    id: "1",
    title: "Game Top Up",
    description: "Fast and secure top up for popular games",
    icon: Wallet,
    items: "2.5k+ items",
  },
  {
    id: "2",
    title: "Game Accounts",
    description: "Verified gaming accounts for sale",
    icon: GamepadIcon,
    items: "1.8k+ items",
  },
  {
    id: "3",
    title: "Game Keys",
    description: "Digital game keys and activations",
    icon: KeyRound,
    items: "900+ items",
    isNew: true,
  },
  {
    id: "4",
    title: "In-Game Items",
    description: "Rare and valuable gaming items",
    icon: Gem,
    items: "5k+ items",
  },
  {
    id: "5",
    title: "Digital Services",
    description: "Professional gaming services",
    icon: Headphones,
    items: "300+ items",
  },
  {
    id: "6",
    title: "Gaming Bundles",
    description: "Special offers and package deals",
    icon: Gift,
    items: "150+ items",
  },
  {
    id: "7",
    title: "Team Boosting",
    description: "Professional rank boosting services",
    icon: Users,
    items: "200+ items",
  },
  {
    id: "8",
    title: "Mobile Gaming",
    description: "Mobile game top-ups and items",
    icon: Smartphone,
    items: "1.2k+ items",
  },
  {
    id: "9",
    title: "Streaming Assets",
    description: "Gaming stream overlays and assets",
    icon: PlaySquare,
    items: "400+ items",
  },
  {
    id: "10",
    title: "Limited Items",
    description: "Rare and exclusive gaming items",
    icon: ShoppingBag,
    items: "800+ items",
    isNew: true,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFAF4]">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 text-[#333333]">
            The Future of the
            <br />
            Gaming Multiverse
          </h1>
          <p className="text-xl mb-12 text-[#666666]">
            SCROWL is the leading web3 gaming marketplace.
            <br />
            Scaling gaming for good.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow border border-[#FEF0DD] group"
              >
                <div className="flex flex-col items-start space-y-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-lg bg-[#FEF0DD] flex items-center justify-center group-hover:bg-[#FFE4C4] transition-colors">
                      <IconComponent className="w-6 h-6 text-[#FF684B]" />
                    </div>
                    {category.isNew && (
                      <span className="absolute -top-2 -right-2 px-2 py-1 bg-[#E6F7F3] text-[#0A8463] text-xs rounded-md">
                        NEW
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#333333] mb-1">
                      {category.title}
                    </h3>
                    <p className="text-sm text-[#666666] mb-3">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#666666]">
                        {category.items}
                      </span>
                      <button className="text-[#FF684B] text-sm font-medium hover:underline">
                        Browse →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}