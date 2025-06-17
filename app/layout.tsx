import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { REM, Righteous } from "next/font/google";
import StoreProvider from "@/components/StoreProvider";
import ToastLayout from "@/components/ToastLayout";

export const metadata: Metadata = {
  title: "Finbest - Financial App",
  description: "Finbest is a financial app that helps you manage your money.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StoreProvider>
        <body>
          {children}
          <ToastLayout />
        </body>
      </StoreProvider>
    </html>
  );
}
