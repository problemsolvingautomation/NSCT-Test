import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import RateLimitToast from "@/components/RateLimitToast";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, ALL_KEYWORDS, DEVELOPER_NAME, DEVELOPER_URL } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0D9488" },
    { media: "(prefers-color-scheme: dark)", color: "#2DD4BF" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "NSCT Prep — Free MCQ Practice for NSCT Test Preparation",
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ALL_KEYWORDS,
  authors: [{ name: DEVELOPER_NAME, url: DEVELOPER_URL }],
  creator: DEVELOPER_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "NSCT Prep — Free MCQ Practice for NSCT Test Preparation",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NSCT Prep — Practice MCQs for the NSCT Test",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NSCT Prep — Free MCQ Practice for NSCT Test Preparation",
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Prevent flash: apply theme mode AND palette inline styles before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("nsct-theme")||"light";if(t==="dark")document.documentElement.setAttribute("data-theme","dark");var p=localStorage.getItem("nsct-palette")||"teal";var P={teal:{l:["#0D9488","#0F766E","#CCFBF1","#FFFFFF"],d:["#2DD4BF","#5EEAD4","#134E4A","#042F2E"]},blue:{l:["#2563EB","#1D4ED8","#DBEAFE","#FFFFFF"],d:["#60A5FA","#93C5FD","#1E3A5F","#172554"]},violet:{l:["#7C3AED","#6D28D9","#EDE9FE","#FFFFFF"],d:["#A78BFA","#C4B5FD","#2E1065","#1E0A4B"]},purple:{l:["#9333EA","#7E22CE","#F3E8FF","#FFFFFF"],d:["#C084FC","#D8B4FE","#3B0764","#2E1065"]},rose:{l:["#E11D48","#BE123C","#FFE4E6","#FFFFFF"],d:["#FB7185","#FDA4AF","#4C0519","#881337"]},orange:{l:["#EA580C","#C2410C","#FFEDD5","#FFFFFF"],d:["#FB923C","#FDBA74","#431407","#7C2D12"]},amber:{l:["#D97706","#B45309","#FEF3C7","#FFFFFF"],d:["#FBBF24","#FCD34D","#451A03","#78350F"]},emerald:{l:["#059669","#047857","#D1FAE5","#FFFFFF"],d:["#34D399","#6EE7B7","#064E3B","#022C22"]},cyan:{l:["#0891B2","#0E7490","#CFFAFE","#FFFFFF"],d:["#22D3EE","#67E8F9","#164E63","#083344"]},slate:{l:["#475569","#334155","#F1F5F9","#FFFFFF"],d:["#94A3B8","#CBD5E1","#1E293B","#0F172A"]},red:{l:["#DC2626","#B91C1C","#FEE2E2","#FFFFFF"],d:["#F87171","#FCA5A5","#450A0A","#7F1D1D"]},pink:{l:["#EC4899","#DB2777","#FCE7F3","#FFFFFF"],d:["#F472B6","#F9A8D4","#500724","#831843"]},lime:{l:["#65A30D","#4D7C0F","#ECFCCB","#FFFFFF"],d:["#A3E635","#BEF264","#1A2E05","#365314"]},green:{l:["#16A34A","#15803D","#DCFCE7","#FFFFFF"],d:["#4ADE80","#86EFAC","#052E16","#14532D"]},zinc:{l:["#71717A","#52525B","#F4F4F5","#FFFFFF"],d:["#A1A1AA","#D4D4D8","#27272A","#18181B"]}};var c=P[p]?P[p][t==="dark"?"d":"l"]:P.teal[t==="dark"?"d":"l"];var s=document.documentElement.style;s.setProperty("--clr-primary",c[0]);s.setProperty("--clr-primary-hover",c[1]);s.setProperty("--clr-primary-light",c[2]);s.setProperty("--clr-on-primary",c[3])}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Google AdSense — loaded via next/script to avoid hydration mismatch */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7149028928800898"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <ThemeProvider>
          <Navbar />
          <div className="flex-1 flex flex-col pb-16 md:pb-0">{children}</div>
          <RateLimitToast />
        </ThemeProvider>
      </body>
    </html>
  );
}
