import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./ChakraProvider";
import StoreProvider from "./StoreProvider";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PayContinental",
  description: "A blockchain-based ledger vault built on the MPC protocol.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StoreProvider>
          <Providers>{children}</Providers>
        </StoreProvider>
        <Script
          src="//code.jivosite.com/widget/23ocD7mmUl"
          strategy="lazyOnload"
          async
        />
      </body>
    </html>
  );
}
