/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Search, User, Bell, Mail, ShoppingCart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core"; // Import DynamicWidget

const Headers = () => {
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();

  // Updated useBalance with 'address' instead of 'addressOrName'
  const { data: balanceData, refetch: refetchBalance } = useBalance({
    address: address,
  });

  // Destructure only used properties
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();

  // Fetch balance when connected
  useEffect(() => {
    if (isConnected && address) {
      refetchBalance();
    }
  }, [isConnected, address, refetchBalance]);

  // Handle Connect
  const handleConnect = async () => {
    setLoading(true);
    try {
      const dynamicConnector = connectors.find(
        (connector) => connector instanceof DynamicWagmiConnector
      );
      if (dynamicConnector) {
        await connect({ connector: dynamicConnector });
      } else {
        console.error("DynamicWagmiConnector not found");
      }
    } catch (err) {
      console.error("Error connecting:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Disconnect
  const handleLogout = () => {
    disconnect();
  };

  return (
    <nav className="border-b border-[#FEF0DD] bg-[#FFFAF4]">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo with Navigation to Home */}
          <Link href="/">
            <span className="text-2xl font-bold text-[#333333] hover:text-[#FF684B] cursor-pointer">
              SCROWL
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search games, items, and services..."
                className="w-full px-4 py-2.5 pl-11 bg-white border border-[#FEF0DD] rounded-lg 
                       focus:outline-none focus:border-[#FF684B] focus:ring-1 focus:ring-[#FF684B]
                       text-[#333333] placeholder-[#666666]"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666666]" />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                <span className="text-sm text-[#666666] border-l border-[#FEF0DD] pl-3">
                  Press /
                </span>
              </div>
            </div>
          </div>

          {/* Conditional Rendering for Logged-In User Features */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <>
                <Link href="/messages">
                  <Mail className="w-6 h-6 text-[#333333] hover:text-[#FF684B] cursor-pointer" />
                </Link>
                <Link href="/notifications">
                  <Bell className="w-6 h-6 text-[#333333] hover:text-[#FF684B] cursor-pointer" />
                </Link>
                <Link href="/cart">
                  <ShoppingCart className="w-6 h-6 text-[#333333] hover:text-[#FF684B] cursor-pointer" />
                </Link>
                <Link href="/start-sell">
                  <span className="px-4 py-2 bg-[#FF684B] text-white rounded-lg hover:bg-[#FF5722] transition-colors cursor-pointer">
                    Start Selling
                  </span>
                </Link>

                {/* User Dropdown */}
                <div className="relative group flex items-center gap-2 cursor-pointer">
                <DynamicWidget />
                  {/* Hover Dropdown */}
                  <div className="absolute top-full mt-2 right-0 bg-white shadow-lg rounded-lg p-4 w-64 opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out transform translate-y-2 group-hover:translate-y-0">
                    <hr className="my-2" />
                    <div className="flex flex-col gap-2">
                      <Link href="/pending-payments">
                        <span className="w-full text-left hover:bg-[#f7f7f7] p-1 rounded cursor-pointer">
                          Pending Payments
                        </span>
                      </Link>
                      <Link href="/pending-shipments">
                        <span className="w-full text-left hover:bg-[#f7f7f7] p-1 rounded cursor-pointer">
                          Pending Shipments
                        </span>
                      </Link>
                      <Link href="/delivered">
                        <span className="w-full text-left hover:bg-[#f7f7f7] p-1 rounded cursor-pointer">
                          Delivered
                        </span>
                      </Link>
                      <Link href="/completed">
                        <span className="w-full text-left hover:bg-[#f7f7f7] p-1 rounded cursor-pointer">
                          Completed
                        </span>
                      </Link>
                    </div>
                    <hr className="my-2" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={handleConnect}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-[#FEF0DD] rounded-lg hover:bg-[#FFE4C4] transition-colors text-[#333333] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <DynamicWidget />
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search games, items, and services..."
              className="w-full px-4 py-2.5 pl-11 bg-white border border-[#FEF0DD] rounded-lg 
                     focus:outline-none focus:border-[#FF684B] focus:ring-1 focus:ring-[#FF684B]
                     text-[#333333] placeholder-[#666666]"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666666]" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Headers;
