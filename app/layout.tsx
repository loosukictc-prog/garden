import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://berakhahgardens.co.ke"),
  title: "Berakhah Gardens Nanyuki | Couples Picnic Date – KES 5,500",
  description:
    "Book the ultimate Couples Picnic Date at Berakhah Gardens Nanyuki for KES 5,500. Includes 3-course meal, romantic setup, flowers, chocolates, games & drinks. Perfect date. Perfect you.",
  keywords: [
    "Couples picnic Nanyuki",
    "Romantic picnic Kenya",
    "Berakhah Gardens Nanyuki",
    "Date ideas Nanyuki",
    "Garden venue Nanyuki",
    "Picnic date KES 5500",
    "Birthday venue Nanyuki",
    "Outdoor event Nanyuki",
  ],
  icons: {
    icon: "/garden/logo.png",
    apple: "/garden/logo.png",
  },
  openGraph: {
    title: "Berakhah Gardens – Couples Picnic Date",
    description: "The perfect romantic picnic date in Nanyuki. KES 5,500 per couple. Book now.",
    url: "https://berakhahgardens.co.ke",
    type: "website",
    locale: "en_KE",
    siteName: "Berakhah Gardens Nanyuki",
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      {/*
        body: NO min-h-screen, NO h-full — those fight the scroll fix.
        Body must size naturally to content. min-height is set in globals.css only.
      */}
      <body className="w-full antialiased overflow-x-hidden bg-[#fdf8f0] text-[#1a1014]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Berakhah Gardens Nanyuki",
              description: "Romantic outdoor garden venue offering Couples Picnic Dates, birthdays, meetings, photoshoots and more in Nanyuki.",
              url: "https://berakhahgardens.co.ke",
              telephone: "+254757692495",
              email: "hello@berakhahgardens.co.ke",
              priceRange: "KES 5,500–KSh 24,000",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Nanyuki",
                addressRegion: "Laikipia County",
                addressCountry: "KE",
              },
              openingHours: "Mo-Su 08:00-20:00",
              areaServed: "Nanyuki",
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
