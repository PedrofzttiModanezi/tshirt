import type { Metadata } from "next";
import { CartProvider } from "@/context/CartProvider";
import { fontDisplay, fontSans } from "@/lib/fonts";
import { CartDrawer } from "@/components/CartDrawer";
import { Header } from "@/components/Header";
import { Toast } from "@/components/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Street Drop · Camisetas urbanas",
  description: "Camisetas streetwear — oversize, drop limitado, vibe urbana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${fontSans.className} ${fontDisplay.variable} min-h-screen antialiased bg-stripe`}
      >
        <CartProvider>
          <Header />
          <main>{children}</main>
          <CartDrawer />
          <Toast />
        </CartProvider>
      </body>
    </html>
  );
}
