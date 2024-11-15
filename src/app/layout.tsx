// app/layout.tsx
import type { Metadata } from "next";


// import ClientWrapper from "@/components/clientwrapper";
import localFont from "next/font/local";
import "./globals.css";

const transSansPremium = localFont({
  src: [
    {
      path: "./fonts/TransSansPremium-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/TransSansPremium-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/TransSansPremium-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-trans-sans",
});

export const metadata: Metadata = {
  title: "SCROWL - Web3 Gaming Marketplace",
  description: "The Homepage of the Gaming Multiverse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${transSansPremium.variable} font-sans antialiased bg-[#FFFAF4]`}
      >
        {/* <ClientWrapper> */}
          {children}

        {/* </ClientWrapper> */}
      </body>
    </html>
  );
}
