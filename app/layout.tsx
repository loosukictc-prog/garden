import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://berakhahgardens.co.ke"),
  title: "Berakhah Gardens Nanyuki | A Hidden Gem for Every Celebration",
  description:
    "Premium garden venue in Nanyuki for birthdays, meetings, picnics, camping, photoshoots, and private outdoor events.",
  keywords: [
    "Berakhah Gardens Nanyuki",
    "Garden venue in Nanyuki",
    "Birthday venue Nanyuki",
    "Meeting venue Nanyuki",
    "Picnic venue Nanyuki",
    "Camping venue Nanyuki",
    "Photoshoot venue Nanyuki",
  ],
  icons: {
    icon: "/garden/logo.png",
    apple: "/garden/logo.png",
  },
  openGraph: {
    title: "Berakhah Gardens Nanyuki",
    description: "A Hidden Gem for Every Celebration.",
    url: "https://berakhahgardens.co.ke",
    type: "website",
    locale: "en_KE",
    siteName: "Berakhah Gardens Nanyuki",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full w-full scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="w-full min-h-screen bg-[#FAF8F3] text-[#1F2937] antialiased overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Berakhah Gardens Nanyuki",
              description:
                "Outdoor garden venue in Nanyuki for birthdays, meetings, picnics, camping, photoshoots, and private celebrations.",
              url: "https://berakhahgardens.co.ke",
              telephone: "+254757692495",
              email: "hello@berakhahgardens.co.ke",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Nanyuki",
                addressRegion: "Laikipia County",
                addressCountry: "KE",
              },
              openingHours: "Mo-Su 08:00-20:00",
              priceRange: "KSh 10,000-KSh 30,000",
              areaServed: "Nanyuki",
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
