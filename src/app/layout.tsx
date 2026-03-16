import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: '--font-montserrat',
  weight: ['400', '700', '900'],
});

export const metadata: Metadata = {
  title: "RotaLucro - Inteligência Logística para Entregadores",
  description: "A plataforma definitiva para entregadores Shopee, Mercado Livre e Autônomos. Saiba exatamente quanto você lucra por entrega.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
