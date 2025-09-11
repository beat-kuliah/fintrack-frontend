import type { Metadata, Viewport } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import StoreProvider from "@/components/StoreProvider";
import ToastLayout from "@/components/ToastLayout";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: {
    default: "Finbest - Financial Management App",
    template: "%s | Finbest"
  },
  description: "Finbest is a comprehensive financial management app that helps you track expenses, manage budgets, and achieve your financial goals with ease.",
  keywords: ["finance", "budget", "expense tracker", "money management", "financial planning"],
  authors: [{ name: "Finbest Team" }],
  creator: "Finbest",
  publisher: "Finbest",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://finbest.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Finbest - Financial Management App",
    description: "Track expenses, manage budgets, and achieve your financial goals with Finbest.",
    url: 'https://finbest.app',
    siteName: 'Finbest',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Finbest - Financial Management App",
    description: "Track expenses, manage budgets, and achieve your financial goals with Finbest.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/placeholder-logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Finbest" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <StoreProvider>
        <body className="antialiased" suppressHydrationWarning>
          <div id="__next">
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50">
              Skip to main content
            </a>
            <main id="main-content" role="main" aria-label="Main content">
               {children}
             </main>
             <ToastLayout />
             <ServiceWorkerRegistration />
           </div>
           <div id="modal-root" aria-live="polite" aria-atomic="true"></div>
        </body>
      </StoreProvider>
    </html>
  );
}
