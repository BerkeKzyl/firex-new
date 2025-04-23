import "../app/globals.css";
import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Wallpoet } from 'next/font/google';

const wallpoet = Wallpoet({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-wallpoet",
});

export const metadata: Metadata = {
  title: "FireX",
  description: "Wildfire detection and reporting system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`antialiased font-sans ${wallpoet.variable}`}>
        <Header />
        <main className="flex-grow">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
