"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight, CalendarDays, Camera, Car, Check, ChevronRight,
  Clock, Heart, Leaf, Mail, MapPin, Menu, MessageCircle,
  Phone, Plus, ShieldCheck, Sparkles, Star, Tent, TreePine, Users, X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

/* ─── Animation variants ────────────────────────────────────────────────────── */
const E = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp   = { hidden: { opacity: 0, y: 30 },       visible: { opacity: 1, y: 0,    transition: { duration: 0.7,  ease: E as any } } };
const fadeIn   = { hidden: { opacity: 0 },               visible: { opacity: 1,          transition: { duration: 0.55, ease: "easeOut" as const } } };
const slideL   = { hidden: { opacity: 0, x: -38 },       visible: { opacity: 1, x: 0,   transition: { duration: 0.75, ease: E as any } } };
const slideR   = { hidden: { opacity: 0, x: 38 },        visible: { opacity: 1, x: 0,   transition: { duration: 0.75, ease: E as any } } };
const stagger  = { hidden: {},                            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } };
const cardUp   = { hidden: { opacity: 0, y: 24, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: E as any } } };

const VP = { once: true, amount: 0.1 } as const;

/* ─── Nav items ─────────────────────────────────────────────────────────────── */
const navItems = [
  { label: "Home",       href: "#home" },
  { label: "Experience", href: "#experience" },
  { label: "Included",   href: "#included" },
  { label: "Gallery",    href: "#gallery" },
  { label: "Packages",   href: "#packages" },
  { label: "Book Now",   href: "#booking" },
  { label: "Contact",    href: "#contact" },
];

/* ─── What's Included ───────────────────────────────────────────────────────── */
const included = [
  { emoji: "🍽️", title: "Full Course Meal",    desc: "Delicious 3-course meal crafted with love for two." },
  { emoji: "⛺",  title: "Beautiful Setup",     desc: "Romantic picnic setup designed exclusively for you." },
  { emoji: "🎟️", title: "Entry Fee",           desc: "Full venue access included in your package." },
  { emoji: "🎮",  title: "Fun Games",           desc: "Exciting games to bond and create lasting memories." },
  { emoji: "💐",  title: "Fresh Flowers",       desc: "A lovely bouquet to make the moment truly special." },
  { emoji: "🍫",  title: "Chocolates",          desc: "Sweet treats for the sweetest hearts." },
  { emoji: "🥂",  title: "Drinks",              desc: "Refreshing drinks to toast your love together." },
];

/* ─── Experience journey ────────────────────────────────────────────────────── */
const journey = [
  { step: "01", title: "Arrive at Berakhah Gardens", desc: "Pull up to lush greenery, soft lighting, and a warm welcome that sets the tone for the perfect date.", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80" },
  { step: "02", title: "Discover Your Romantic Setup", desc: "Your private picnic space is laid out beautifully — flowers, candles, soft blankets, and a table just for two.", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80" },
  { step: "03", title: "Share a Delicious Meal",      desc: "Enjoy a lovingly prepared 3-course meal together. Great food, better company, and a setting that feels like magic.", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80" },
  { step: "04", title: "Play, Bond & Laugh",          desc: "Fun couple games fill the afternoon with laughter, friendly competition, and memories that will last forever.", image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80" },
  { step: "05", title: "Capture Your Memories",       desc: "The garden offers stunning natural backdrops for photos. Every corner is a frame-worthy moment waiting to be captured.", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80" },
  { step: "06", title: "Celebrate Your Connection",   desc: "As the sun sets over Nanyuki, toast to your relationship in one of Kenya's most beautiful outdoor settings.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80" },
];

/* ─── Why choose us ─────────────────────────────────────────────────────────── */
const features = [
  { icon: Leaf,        title: "Naturally Serene",    desc: "Shaded lawns, fresh air, and lush greenery create a calming, romantic backdrop." },
  { icon: ShieldCheck, title: "Trusted Hosting",     desc: "Thoughtful support from setup to closeout ensures your experience is seamless." },
  { icon: Car,         title: "Easy Access",         desc: "Convenient arrival with comfortable parking and a smooth flow from gate to garden." },
  { icon: MapPin,      title: "Nanyuki Location",    desc: "Set in the beauty of Nanyuki — private, peaceful, and perfectly romantic." },
  { icon: Tent,        title: "Flexible Setups",     desc: "From intimate picnics to full events, our spaces adapt to your celebration." },
  { icon: Sparkles,    title: "Thoughtful Details",  desc: "Curated décor, warm hospitality, and an ambience designed to feel personal and premium." },
];

/* ─── Gallery ───────────────────────────────────────────────────────────────── */
const galleryItems = [
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",  alt: "Romantic garden picnic setup",           category: "Picnics",       aspect: "portrait"  },
  { src: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80", alt: "Open lawn garden view at Berakhah",      category: "Garden",        aspect: "landscape" },
  { src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",  alt: "Couple enjoying outdoor activities",     category: "Couples",       aspect: "portrait"  },
  { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",  alt: "Picnic area bathed in golden sunlight",  category: "Picnics",       aspect: "landscape" },
  { src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80",  alt: "Garden lawn with romantic event setup",  category: "Setups",        aspect: "landscape" },
  { src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",  alt: "Twilight ambience in the garden",        category: "Garden",        aspect: "portrait"  },
  { src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",  alt: "Portrait photoshoot in the garden",      category: "Couples",       aspect: "landscape" },
  { src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",  alt: "Decorated gazebo in soft afternoon light",category: "Setups",       aspect: "portrait"  },
];

/* ─── Packages ──────────────────────────────────────────────────────────────── */
const pricing = [
  { name: "Couples Picnic Date", price: "KES 5,500",  duration: "Half day",    guests: "Per couple",       features: ["3-course meal", "Romantic setup", "Entry fee", "Fun games", "Fresh flowers", "Chocolates", "Drinks"], featured: true,  highlight: "Most Popular" },
  { name: "Birthday Package",    price: "KSh 24,000", duration: "4 hours",     guests: "Up to 80 guests",  features: ["Garden lawn access", "Décor assistance", "Sound setup", "Guest seating"],                              featured: false, highlight: "" },
  { name: "Meeting Package",     price: "KSh 18,500", duration: "3 hours",     guests: "Up to 50 guests",  features: ["Pavilion access", "Projector support", "Tea station", "Flexible seating"],                             featured: false, highlight: "" },
  { name: "Camping Package",     price: "KSh 15,500", duration: "Overnight",   guests: "Up to 16 guests",  features: ["Camp setup", "Outdoor lighting", "Fire pit zone", "Nature experience"],                                featured: false, highlight: "" },
  { name: "Photoshoot Package",  price: "KSh 10,800", duration: "90 minutes",  guests: "Up to 10 people",  features: ["Scenic spots", "Natural light", "Styling guidance", "Multiple corners"],                               featured: false, highlight: "" },
];

/* ─── Testimonials ──────────────────────────────────────────────────────────── */
const testimonials = [
  { name: "Cynthia & James", event: "Couples Picnic Date", quote: "It was absolutely magical. The setup was breathtaking, the food was incredible, and we felt like the only two people in the world. We'll be back for every anniversary.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80" },
  { name: "Michael K.",      event: "Team building day",   quote: "We wanted a venue that felt productive but still relaxed. Berakhah delivered exactly that, and our team loved every minute.",                                              image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80" },
  { name: "Amina S.",        event: "Photoshoot session",  quote: "The light, the greenery, and the natural flow of the venue made our shoot feel effortless and premium without being staged.",                                              image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=80" },
];

/* ─── Stat cards ────────────────────────────────────────────────────────────── */
const statCards = [
  { value: "500+",  label: "Happy Couples",     icon: Heart },
  { value: "12+",   label: "Garden Spaces",     icon: TreePine },
  { value: "365",   label: "Days Open/Year",    icon: CalendarDays },
  { value: "2,500+",label: "Guests Hosted",     icon: Users },
];

/* ─── FAQ ───────────────────────────────────────────────────────────────────── */
const faqItems = [
  { question: "How do I book the Couples Picnic Date?",      answer: "Simply fill out the booking form on this page or WhatsApp us at +254 757 692 495. We confirm availability within 24 hours and send your reservation details." },
  { question: "What is included in the KES 5,500 package?",  answer: "The package includes a 3-course meal, romantic picnic setup, venue entry fee, fun couple games, fresh flowers, chocolates, and refreshing drinks. Everything is set up for you." },
  { question: "Can we choose a custom date and time?",       answer: "Yes! Use the booking form to select your preferred date and time. We recommend booking at least 3 days in advance to guarantee availability." },
  { question: "Is parking available?",                       answer: "Yes, guest parking is available on site and arranged for your convenience during your visit." },
  { question: "Can we bring a photographer?",                answer: "Absolutely. You are welcome to bring your own photographer or we can recommend trusted photography partners who know the garden well." },
  { question: "What happens if it rains?",                   answer: "We have sheltered areas within the garden to ensure your experience is not interrupted. We will communicate any adjustments in advance if needed." },
];

/* ─── Booking form types ─────────────────────────────────────────────────────── */
type BookingForm = {
  fullName: string; phone: string; email: string;
  package: string; guests: number; date: string; time: string;
  specialRequests?: string;
};

const bookingSchema: z.ZodType<BookingForm> = z.object({
  fullName:        z.string().min(2, "Please enter your full name."),
  phone:           z.string().min(8, "Please enter a valid phone number."),
  email:           z.string().email("Please enter a valid email address."),
  package:         z.string().min(1, "Please select a package."),
  guests:          z.coerce.number().min(1, "Please enter number of guests."),
  date:            z.string().min(1, "Please choose a date."),
  time:            z.string().min(1, "Please choose a time."),
  specialRequests: z.string().optional(),
});

const Field = ({ label, htmlFor, error, children }: { label: string; htmlFor: string; error?: string; children: React.ReactNode }) => (
  <div>
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-[#3d2530]">{label}</label>
    {children}
    {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
  </div>
);

const iCls = "w-full rounded-2xl border border-[#e8d8dc] bg-[#fdf8f0] px-4 py-3 text-[#1a1014] outline-none transition-all duration-200 focus:border-[#c4607a] focus:ring-2 focus:ring-[#c4607a]/10 placeholder:text-[#b09098] text-sm";

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function Home() {
  const skipAnims = useReducedMotion() ?? false;

  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [scrolled,       setScrolled]       = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage,  setSelectedImage]  = useState<number | null>(null);
  const [expandedFaq,    setExpandedFaq]    = useState<number | null>(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [bookingRef,     setBookingRef]     = useState("");
  const [isSubmitted,    setIsSubmitted]    = useState(false);

  /* Calendar */
  const [calendarOffset, setCalendarOffset] = useState(0);
  const today = useMemo(() => new Date(), []);
  const calDate   = useMemo(() => new Date(today.getFullYear(), today.getMonth() + calendarOffset, 1), [today, calendarOffset]);
  const calYear   = calDate.getFullYear();
  const calMonth  = calDate.getMonth();
  const calDays   = useMemo(() => new Date(calYear, calMonth + 1, 0).getDate(), [calYear, calMonth]);
  const calOffset = useMemo(() => { const d = new Date(calYear, calMonth, 1).getDay(); return d === 0 ? 6 : d - 1; }, [calYear, calMonth]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(galleryItems.map(i => i.category)))], []);
  const filteredGallery = useMemo(() => activeCategory === "All" ? galleryItems : galleryItems.filter(i => i.category === activeCategory), [activeCategory]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema as any) as any,
    defaultValues: { fullName: "", phone: "", email: "", package: "", guests: 2, date: "", time: "", specialRequests: "" },
  });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    fn(); window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTestimonialIdx(c => (c + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (selectedImage === null) return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSelectedImage(null); return; }
      if (e.key === "ArrowRight") setSelectedImage(c => c === null ? 0 : Math.min(c + 1, filteredGallery.length - 1));
      if (e.key === "ArrowLeft")  setSelectedImage(c => c === null ? filteredGallery.length - 1 : Math.max(c - 1, 0));
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [filteredGallery.length, selectedImage]);

  useEffect(() => {
    document.body.style.overflow = (selectedImage !== null || mobileOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedImage, mobileOpen]);

  const onSubmit = async (values: BookingForm) => {
    const ref = `BG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setBookingRef(ref); setIsSubmitted(true); reset();
    try {
      const res = await fetch("/api/send-booking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, bookingReference: ref }) });
      const result = await res.json();
      if (!result.success) console.log("⚠️ WhatsApp delivery:", result.message);
    } catch (err) { console.error("Error:", err); }
  };

  return (
    /* Scroll fix: no min-h-screen, no flex-col here — body sizes to content naturally */
    <div className="overflow-x-hidden bg-[#fdf8f0] text-[#1a1014]">

      {/* ══════════════════════════════════════════════════════════════════════
          NAVBAR
          ══════════════════════════════════════════════════════════════════════ */}
      <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#fdf8f0]/96 shadow-[0_4px_24px_rgba(107,26,42,0.1)] backdrop-blur-md" : "bg-transparent"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="#home" className="flex items-center gap-3 transition-opacity hover:opacity-80" aria-label="Berakhah Gardens home">
            <motion.div initial={skipAnims ? false : { opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: E }}>
              <Image src="/logo.png" alt="Berakhah Gardens" width={40} height={40} className="h-10 w-10 object-contain" />
            </motion.div>
            <motion.div initial={skipAnims ? false : { opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: E, delay: 0.06 }}>
              <p className="font-display text-lg leading-none text-[#1a1014]">Berakhah</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#7a5c65]">Gardens Nanyuki</p>
            </motion.div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
            {navItems.map((item, i) => (
              <motion.div key={item.label} initial={skipAnims ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.07 + i * 0.05, ease: "easeOut" }}>
                {item.label === "Book Now"
                  ? <Link href={item.href} className="btn-burgundy px-5 py-2.5 text-sm">Book Now <ArrowRight size={14} /></Link>
                  : <Link href={item.href} className="nav-link">{item.label}</Link>}
              </motion.div>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button type="button" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e8d8dc] bg-white/80 text-[#1a1014] shadow-sm transition-all hover:border-[#c4607a] active:scale-90 lg:hidden"
            onClick={() => setMobileOpen(o => !o)}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={mobileOpen ? "x" : "m"} initial={{ opacity: 0, rotate: -90, scale: 0.7 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 90, scale: 0.7 }} transition={{ duration: 0.17 }}>
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: E }}
              className="overflow-hidden border-t border-[#e8d8dc] bg-[#fdf8f0]/98 backdrop-blur-md lg:hidden">
              <nav aria-label="Mobile navigation" className="flex flex-col gap-1 px-4 py-5">
                {navItems.map((item, i) => (
                  <motion.div key={item.label} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: i * 0.04, ease: "easeOut" }}>
                    <Link href={item.href} onClick={() => setMobileOpen(false)}
                      className={`block rounded-xl px-3 py-2.5 text-base font-medium transition-colors ${item.label === "Book Now" ? "mt-2 bg-[#6b1a2a] text-center text-white rounded-full py-3" : "text-[#1a1014] hover:bg-[#fde8ed] hover:text-[#6b1a2a]"}`}>
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main id="home">
        {/* ══════════════════════════════════════════════════════════════════════
            HERO — Couples Picnic Date
            ══════════════════════════════════════════════════════════════════════ */}
        <section className="relative isolate overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1600&q=80"
              alt="Romantic garden picnic at Berakhah Gardens Nanyuki" fill priority className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a0810]/85 via-[#1a0810]/60 to-[#1a0810]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0810]/60 via-transparent to-transparent" />
          </div>

          <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 pb-16 pt-16 sm:px-6 sm:pt-20 sm:pb-20 lg:grid-cols-2 lg:px-8 lg:pt-16 lg:pb-24" style={{ minHeight: "min(90vh, 820px)" }}>

            {/* Left — text */}
            <motion.div initial={skipAnims ? false : { opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: E }} className="max-w-xl text-white">
              <motion.div initial={skipAnims ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.28em] text-white/90 backdrop-blur-sm">
                <Heart size={12} className="fill-[#f0c4cd] text-[#f0c4cd]" />
                Berakhah Gardens Nanyuki
                <Heart size={12} className="fill-[#f0c4cd] text-[#f0c4cd]" />
              </motion.div>

              <motion.p initial={skipAnims ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.6 }}
                className="font-serif text-lg italic text-[#f0c4cd] sm:text-xl">
                Quality Time. Good Food. Unforgettable Memories.
              </motion.p>

              <motion.h1 initial={skipAnims ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7, ease: E }}
                className="mt-3 font-display text-5xl leading-none tracking-[-0.03em] sm:text-6xl lg:text-7xl">
                Couples<br />
                <span className="italic text-[#d4af5a]">Picnic Date</span>
              </motion.h1>

              <motion.p initial={skipAnims ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.33, duration: 0.65 }}
                className="mt-4 font-serif text-xl italic text-white/80 sm:text-2xl">
                Perfect Date. Perfect You.
              </motion.p>

              <motion.p initial={skipAnims ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-4 max-w-md text-sm leading-7 text-white/70 sm:text-base">
                An intimate outdoor picnic experience designed for couples — romantic setup, delicious food, flowers, games, and a garden setting that feels like pure magic.
              </motion.p>

              {/* Price badge */}
              <motion.div initial={skipAnims ? false : { opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.48, duration: 0.55, ease: E }}
                className="mt-7 inline-flex flex-col items-start">
                <div className="price-badge rounded-2xl px-6 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1a0810]/70">Starting from</p>
                  <p className="mt-0.5 font-display text-4xl font-bold leading-none text-[#1a0810] sm:text-5xl">KES 5,500</p>
                  <p className="mt-1 text-sm font-medium text-[#1a0810]/70">Per Couple</p>
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div initial={skipAnims ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.56, duration: 0.6 }}
                className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="#booking" className="btn-burgundy justify-center text-sm sm:text-base">
                  Book Your Date <Heart size={16} className="fill-white" />
                </Link>
                <Link href="#experience" className="btn-outline justify-center text-sm sm:text-base">
                  Explore the Experience <ArrowRight size={15} />
                </Link>
              </motion.div>

              {/* Phone */}
              <motion.a href="tel:+254757692495" initial={skipAnims ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.68, duration: 0.5 }}
                className="mt-6 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white">
                <Phone size={14} />
                <span>+254 757 692 495</span>
              </motion.a>
            </motion.div>

            {/* Right — floating card */}
            <motion.div initial={skipAnims ? false : { opacity: 0, x: 32, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.9, ease: E, delay: 0.22 }}
              className="hidden justify-end lg:flex">
              <div className="relative w-full max-w-sm overflow-visible">
                <div className="overflow-hidden rounded-[28px] border border-white/20 bg-white/8 p-2.5 shadow-[0_32px_80px_rgba(0,0,0,0.32)] backdrop-blur-sm">
                  <div className="overflow-hidden rounded-[22px]">
                    <Image src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=80"
                      alt="Romantic outdoor picnic setup" width={900} height={1200} className="h-[520px] w-full object-cover transition-transform duration-700 hover:scale-105" />
                  </div>
                </div>
                {/* Floating label */}
                <div className="absolute -bottom-5 -left-4 rounded-2xl bg-[#fdf8f0] p-4 shadow-[0_16px_40px_rgba(107,26,42,0.18)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fde8ed] text-[#6b1a2a]"><Heart size={18} className="fill-[#6b1a2a]" /></div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#7a5c65]">Limited Slots Daily</p>
                      <p className="text-base font-semibold text-[#1a1014]">Book Early ✨</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll hint */}
          <motion.div initial={skipAnims ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.5 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/8 text-white backdrop-blur-sm">
              <ChevronRight size={14} className="rotate-90" />
            </motion.div>
          </motion.div>
        </section>


        {/* ══════════════════════════════════════════════════════════════════════
            WHAT'S INCLUDED
            ══════════════════════════════════════════════════════════════════════ */}
        <section id="included" className="relative overflow-hidden bg-[#fdf8f0] py-20 sm:py-24 lg:py-28">
          {/* Decorative background — contained so it never extends document height */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#fde8ed] opacity-40 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#f9f0d8] opacity-50 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP} className="mb-14 text-center">
              <p className="kicker justify-center">The Full Experience</p>
              <h2 className="mt-5 font-display text-4xl text-[#1a1014] sm:text-5xl lg:text-6xl">
                What&apos;s <span className="italic text-[#6b1a2a]">Included</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#7a5c65] sm:text-lg">
                Everything you need for a perfect date — thoughtfully curated and beautifully presented. No stress. Just love.
              </p>
              {/* Big price callout */}
              <div className="mt-8 inline-flex items-center gap-4 rounded-2xl border border-[#e2d4a8] bg-[#f9f0d8] px-7 py-4 shadow-[0_4px_20px_rgba(184,151,42,0.15)]">
                <div className="text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a5c65]">All of this for only</p>
                  <p className="font-display text-4xl font-bold text-[#6b1a2a] sm:text-5xl">KES 5,500</p>
                </div>
                <div className="h-10 w-px bg-[#e2d4a8]" />
                <div className="text-left">
                  <p className="text-xs font-medium text-[#7a5c65]">Per Couple</p>
                  <p className="text-sm font-semibold text-[#6b1a2a]">Limited slots daily ✨</p>
                </div>
              </div>
            </motion.div>

            {/* Cards grid — 1 col mobile, 2 tablet, 3-4 desktop */}
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={VP}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {included.map(({ emoji, title, desc }) => (
                <motion.div key={title} variants={cardUp} className="included-card">
                  <span className="included-icon">{emoji}</span>
                  <h3 className="font-display text-xl font-semibold text-[#1a1014] sm:text-2xl">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#7a5c65] sm:text-base">{desc}</p>
                </motion.div>
              ))}
              {/* CTA card */}
              <motion.div variants={cardUp}
                className="included-card items-center justify-center bg-gradient-to-br from-[#6b1a2a] to-[#8b2d3e] text-center !border-transparent">
                <Heart size={36} className="mb-4 fill-white text-white opacity-90" />
                <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">Ready to Book?</h3>
                <p className="mt-2 text-sm leading-6 text-white/75">Secure your date before slots fill up.</p>
                <Link href="#booking" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#6b1a2a] transition-all hover:shadow-lg active:scale-95">
                  Book Now <ArrowRight size={14} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            EXPERIENCE JOURNEY
            ══════════════════════════════════════════════════════════════════════ */}
        <section id="experience" className="bg-[#f7efe2] py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP} className="mb-16 text-center sm:mb-20">
              <p className="kicker justify-center">Your Perfect Day</p>
              <h2 className="mt-5 font-display text-4xl text-[#1a1014] sm:text-5xl lg:text-6xl">
                The <span className="italic text-[#6b1a2a]">Experience</span>
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-[#7a5c65] sm:text-lg">
                From the moment you arrive to the last golden hour — every detail of your Couples Picnic Date is crafted for romance.
              </p>
            </motion.div>

            <div className="space-y-16 sm:space-y-20">
              {journey.map(({ step, title, desc, image }, i) => (
                <motion.div key={step} variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP}
                  className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">

                  {/* Image side */}
                  <div className={i % 2 === 0 ? "lg:order-1" : "lg:order-2"}>
                    <div className="relative overflow-hidden rounded-[24px] shadow-[0_20px_50px_rgba(107,26,42,0.12)] sm:rounded-[28px]">
                      <Image src={image} alt={title} width={900} height={600}
                        className="h-[280px] w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[380px] lg:h-[440px]" />
                      {/* Step badge */}
                      <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#6b1a2a] text-white shadow-lg">
                        <span className="font-display text-sm font-bold">{step}</span>
                      </div>
                    </div>
                  </div>

                  {/* Text side */}
                  <div className={i % 2 === 0 ? "lg:order-2" : "lg:order-1"}>
                    <p className="font-serif text-5xl italic text-[#e8d8dc] sm:text-6xl">{step}</p>
                    <h3 className="mt-1 font-display text-3xl text-[#1a1014] sm:text-4xl">{title}</h3>
                    <p className="mt-4 text-base leading-8 text-[#7a5c65] sm:text-lg">{desc}</p>
                    {i === journey.length - 1 && (
                      <Link href="#booking" className="btn-burgundy mt-7 inline-flex text-sm sm:text-base">
                        Book This Experience <Heart size={15} className="fill-white" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            ABOUT — Stats + story
            ══════════════════════════════════════════════════════════════════════ */}
        <section id="about" className="bg-[#fdf8f0] py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

              {/* Image */}
              <motion.div variants={slideL} initial="hidden" whileInView="visible" viewport={VP}>
                <div className="relative overflow-hidden rounded-[24px] shadow-[0_24px_64px_rgba(107,26,42,0.1)] sm:rounded-[28px]">
                  <Image src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80"
                    alt="Berakhah Gardens landscape" width={1200} height={1400}
                    className="h-[380px] w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[500px] lg:h-[580px]" />
                  {/* Overlay badge */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1a0810]/70 to-transparent p-6 sm:p-8">
                    <p className="font-serif text-lg italic text-white/90">Nanyuki&apos;s most romantic outdoor venue</p>
                    <p className="mt-1 font-display text-3xl text-white sm:text-4xl">Berakhah Gardens</p>
                  </div>
                </div>
              </motion.div>

              {/* Text + stats */}
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP}>
                <p className="kicker">About us</p>
                <h2 className="mt-5 font-display text-3xl leading-tight text-[#1a1014] sm:text-4xl lg:text-5xl">
                  Where Nature Meets <span className="italic text-[#6b1a2a]">Romance</span>
                </h2>
                <p className="mt-5 text-base leading-8 text-[#3d2530] sm:text-lg">
                  Berakhah Gardens Nanyuki was created to give couples, families, and friends a place to gather, celebrate, and connect in a setting of natural beauty and genuine warmth.
                </p>
                <p className="mt-4 text-sm leading-7 text-[#7a5c65] sm:text-base">
                  Nestled in the serene landscapes of Nanyuki, our garden offers romantic picnic dates, birthday celebrations, team retreats, photoshoots, and memorable outdoor moments — all designed with thoughtful detail and personal care.
                </p>

                {/* Stat cards — 2×2 grid, no min-h or fixed heights */}
                <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={VP}
                  className="mt-8 grid grid-cols-2 gap-4">
                  {statCards.map(({ value, label, icon: Icon }) => (
                    <motion.div key={label} variants={cardUp}
                      className="glass-card rounded-[20px] p-4 sm:rounded-[22px] sm:p-5">
                      <div className="icon-tile h-10 w-10 rounded-xl sm:h-11 sm:w-11 sm:rounded-2xl">
                        <Icon size={18} />
                      </div>
                      <p className="mt-4 font-display text-2xl font-bold text-[#1a1014] sm:text-3xl">{value}</p>
                      <p className="mt-1 text-xs text-[#7a5c65] sm:text-sm">{label}</p>
                    </motion.div>
                  ))}
                </motion.div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="#included" className="btn-burgundy text-sm">
                    See What&apos;s Included <ArrowRight size={14} />
                  </Link>
                  <a href="https://wa.me/254757692495" target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#e8d8dc] bg-white px-5 py-2.5 text-sm font-semibold text-[#6b1a2a] transition-all hover:border-[#c4607a] hover:bg-[#fde8ed] active:scale-95">
                    <MessageCircle size={15} /> WhatsApp Us
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            WHY CHOOSE US
            ══════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP} className="mb-14 max-w-2xl">
              <p className="kicker">Why Choose Us</p>
              <h2 className="mt-5 font-display text-4xl text-[#1a1014] sm:text-5xl lg:text-6xl">
                A garden experience <span className="italic text-[#6b1a2a]">designed with care</span>
              </h2>
            </motion.div>

            {/* Clean grid — NO translate-y stagger, stagger is entry-animation only */}
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={VP}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {features.map(({ icon: Icon, title, desc }) => (
                <motion.div key={title} variants={cardUp} className="feature-card">
                  <div className="feature-card-icon"><Icon size={24} /></div>
                  <h3 className="mt-5 font-display text-xl text-[#1a1014] sm:text-2xl">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#7a5c65] sm:text-base">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════════════════════════════
            GALLERY
            ══════════════════════════════════════════════════════════════════════ */}
        <section id="gallery" className="bg-[#f7efe2] py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP}
              className="mb-10 flex flex-col gap-6 sm:mb-12 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="kicker">Gallery</p>
                <h2 className="mt-5 font-display text-4xl text-[#1a1014] sm:text-5xl lg:text-6xl">
                  Moments <span className="italic text-[#6b1a2a]">captured in nature</span>
                </h2>
              </div>
              {/* Filter pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button key={cat} type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200 sm:px-5 sm:py-2 sm:text-sm ${
                      activeCategory === cat
                        ? "border-[#6b1a2a] bg-[#6b1a2a] text-white shadow-[0_3px_12px_rgba(107,26,42,0.3)]"
                        : "border-[#e8d8dc] bg-white text-[#3d2530] hover:border-[#c4607a] hover:bg-[#fde8ed]"
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Masonry columns: 1 → 2 → 4 */}
            <div className="columns-1 gap-4 sm:columns-2 sm:gap-5 xl:columns-4">
              <AnimatePresence>
                {filteredGallery.map((item, idx) => (
                  <motion.button
                    key={`${item.src}-${idx}`}
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.3, ease: E }}
                    type="button" aria-label={`View: ${item.alt}`}
                    className="group mb-4 block w-full overflow-hidden rounded-[20px] shadow-[0_6px_18px_rgba(107,26,42,0.08)] transition-shadow duration-300 hover:shadow-[0_14px_36px_rgba(107,26,42,0.14)] sm:mb-5 sm:rounded-[24px]"
                    onClick={() => setSelectedImage(idx)}>
                    <div className="overflow-hidden rounded-[20px] sm:rounded-[24px]">
                      <Image src={item.src} alt={item.alt} width={900}
                        height={item.aspect === "portrait" ? 1200 : 700}
                        className="w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] flex items-end justify-center bg-[#0f0509]/88 px-0 backdrop-blur-md sm:items-center sm:px-4"
              onClick={() => setSelectedImage(null)}>
              <motion.div initial={{ scale: 0.93, opacity: 0, y: 28 }} animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.96, opacity: 0, y: 14 }} transition={{ duration: 0.25, ease: E }}
                className="relative w-full max-w-5xl rounded-t-[24px] border border-white/15 bg-[#fdf8f0] p-2.5 shadow-[0_32px_80px_rgba(0,0,0,0.45)] sm:rounded-[28px] sm:p-3"
                onClick={e => e.stopPropagation()}>
                <button type="button" aria-label="Close" onClick={() => setSelectedImage(null)}
                  className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#1a1014] shadow-sm transition-all hover:bg-white active:scale-90 sm:h-10 sm:w-10">
                  <X size={17} />
                </button>
                <div className="overflow-hidden rounded-[18px] sm:rounded-[22px]">
                  <Image src={filteredGallery[selectedImage].src} alt={filteredGallery[selectedImage].alt}
                    width={1600} height={1100} className="max-h-[60vh] w-full object-cover sm:max-h-[75vh]" />
                </div>
                <div className="mt-3 flex items-center justify-between gap-4 px-2 pb-1.5 sm:mt-4 sm:pb-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.26em] text-[#c4607a]">{filteredGallery[selectedImage].category}</p>
                    <p className="mt-1 text-sm text-[#3d2530]">{filteredGallery[selectedImage].alt}</p>
                  </div>
                  <div className="flex gap-2">
                    {[{ label: "Prev", dir: -1, cls: "rotate-180", off: selectedImage === 0 },
                      { label: "Next", dir:  1, cls: "",            off: selectedImage === filteredGallery.length - 1 }
                    ].map(({ label, dir, cls, off }) => (
                      <button key={label} type="button" aria-label={label} disabled={off}
                        onClick={() => setSelectedImage(c => c === null ? 0 : Math.max(0, Math.min(filteredGallery.length - 1, c + dir)))}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8d8dc] bg-white text-[#1a1014] transition-all hover:bg-[#fde8ed] active:scale-90 disabled:opacity-30 sm:h-10 sm:w-10">
                        <ChevronRight size={15} className={cls} />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════════════════════════════════════════════════════════════════════
            PACKAGES
            ══════════════════════════════════════════════════════════════════════ */}
        <section id="packages" className="bg-[#fdf8f0] py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP} className="mb-14 max-w-2xl">
              <p className="kicker">Packages</p>
              <h2 className="mt-5 font-display text-4xl text-[#1a1014] sm:text-5xl lg:text-6xl">
                Flexible packages for <span className="italic text-[#6b1a2a]">every occasion</span>
              </h2>
            </motion.div>

            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={VP}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-5">
              {pricing.map((item) => (
                <motion.div key={item.name} variants={cardUp}
                  whileHover={{ y: -6, transition: { duration: 0.3, ease: E } }}
                  className={`flex flex-col rounded-[22px] border p-5 shadow-[0_6px_20px_rgba(107,26,42,0.06)] transition-shadow duration-300 hover:shadow-[0_18px_44px_rgba(107,26,42,0.12)] sm:rounded-[26px] sm:p-6 ${
                    item.featured
                      ? "border-[#b8972a] bg-gradient-to-b from-[#6b1a2a] to-[#4e1120] text-white ring-2 ring-[#b8972a]"
                      : "border-[#e8d8dc] bg-white"
                  }`}>
                  {item.featured && (
                    <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#b8972a] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a0810]">
                      <Star size={10} className="fill-[#1a0810]" /> {item.highlight}
                    </div>
                  )}
                  {!item.featured && item.highlight && (
                    <div className="mb-3 inline-flex rounded-full bg-[#fde8ed] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6b1a2a]">
                      {item.highlight}
                    </div>
                  )}
                  <h3 className={`font-display text-lg font-semibold sm:text-xl ${item.featured ? "text-white" : "text-[#1a1014]"}`}>{item.name}</h3>
                  <p className={`mt-4 font-display text-3xl font-bold sm:text-4xl ${item.featured ? "text-[#d4af5a]" : "text-[#6b1a2a]"}`}>{item.price}</p>
                  <div className={`mt-3 space-y-0.5 text-xs sm:text-sm ${item.featured ? "text-white/70" : "text-[#7a5c65]"}`}>
                    <p>{item.duration}</p>
                    <p>{item.guests}</p>
                  </div>
                  <ul className={`mt-5 flex-1 space-y-2.5 text-xs sm:text-sm ${item.featured ? "text-white/85" : "text-[#7a5c65]"}`}>
                    {item.features.map(f => (
                      <li key={f} className="flex items-start gap-2">
                        <span className={`mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full sm:h-5 sm:w-5 ${item.featured ? "bg-white/20 text-white" : "bg-[#fde8ed] text-[#6b1a2a]"}`}>
                          <Check size={10} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="#booking"
                    className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 active:scale-95 sm:mt-8 sm:py-3 ${
                      item.featured
                        ? "bg-[#b8972a] text-[#1a0810] hover:bg-[#d4af5a] shadow-[0_4px_14px_rgba(184,151,42,0.45)]"
                        : "bg-[#6b1a2a] text-white hover:bg-[#4e1120] hover:shadow-[0_6px_18px_rgba(107,26,42,0.3)]"
                    }`}>
                    {item.featured ? "Book This Date ❤️" : "Book Package"} <ArrowRight size={14} />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            BOOKING CTA BANNER
            ══════════════════════════════════════════════════════════════════════ */}
        <section id="booking" className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
              alt="Romantic garden at golden hour" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a0810]/80 via-[#1a0810]/75 to-[#1a0810]/85" />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP}>
              <p className="kicker justify-center text-[#f0c4cd]" style={{ color: "#f0c4cd" }}>
                <span className="before:bg-[#f0c4cd] after:bg-[#f0c4cd]">Don&apos;t Wait</span>
              </p>
              <h2 className="mt-5 font-display text-4xl text-white sm:text-5xl lg:text-6xl">
                Make it a date you&apos;ll<br />
                <span className="italic text-[#d4af5a]">never forget ❤️</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base text-white/75 sm:text-lg">
                Book your Couples Picnic Date at Berakhah Gardens. Limited slots available daily — don&apos;t miss your perfect moment.
              </p>

              {/* Price reminder */}
              <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-[#b8972a]/50 bg-white/8 px-6 py-3 backdrop-blur-sm">
                <Heart size={20} className="fill-[#f0c4cd] text-[#f0c4cd]" />
                <span className="font-display text-2xl text-white sm:text-3xl">KES 5,500</span>
                <span className="text-sm text-white/70">per couple</span>
              </div>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a href="tel:+254757692495"
                  className="btn-burgundy w-full justify-center text-base sm:w-auto bg-[#b8972a] text-[#1a0810] hover:bg-[#d4af5a]">
                  <Phone size={16} /> +254 757 692 495
                </a>
                <a href="https://wa.me/254757692495?text=Hi%2C%20I%27d%20like%20to%20book%20the%20Couples%20Picnic%20Date%20for%20KES%205500." target="_blank" rel="noreferrer"
                  className="w-full justify-center btn-outline sm:w-auto">
                  <MessageCircle size={16} /> WhatsApp to Book
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            BOOKING FORM
            ══════════════════════════════════════════════════════════════════════ */}
        <section className="bg-[#f7efe2] py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">

              {/* Left image panel */}
              <motion.div variants={slideL} initial="hidden" whileInView="visible" viewport={VP}
                className="relative overflow-hidden rounded-[26px] shadow-[0_24px_60px_rgba(107,26,42,0.12)] sm:rounded-[32px]">
                <Image src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80"
                  alt="Couples picnic at Berakhah Gardens" width={1200} height={1400}
                  className="h-[300px] w-full object-cover sm:h-[460px] lg:h-full lg:min-h-[600px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0810]/70 via-[#1a0810]/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#f0c4cd]">Reserve your date</p>
                  <h3 className="mt-2 font-display text-3xl sm:text-4xl">Book a timeless garden moment</h3>
                  <div className="mt-4 flex items-center gap-2 text-[#d4af5a]">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                    <span className="ml-1 text-sm text-white/75">Loved by 500+ couples</span>
                  </div>
                </div>
              </motion.div>

              {/* Form panel */}
              <motion.div variants={slideR} initial="hidden" whileInView="visible" viewport={VP}
                className="rounded-[24px] border border-[#e8d8dc] bg-white p-5 shadow-[0_16px_44px_rgba(107,26,42,0.07)] sm:rounded-[28px] sm:p-8">
                {!isSubmitted ? (
                  <>
                    <p className="kicker">Booking</p>
                    <h3 className="mt-4 font-display text-3xl text-[#1a1014] sm:text-4xl">Tell us about your date</h3>
                    <form onSubmit={handleSubmit(onSubmit as any)} className="mt-7 space-y-5" noValidate>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Full Name" htmlFor="fullName" error={errors.fullName?.message}>
                          <input id="fullName" {...register("fullName")} className={iCls} placeholder="Your name" />
                        </Field>
                        <Field label="Phone Number" htmlFor="phone" error={errors.phone?.message}>
                          <input id="phone" {...register("phone")} className={iCls} placeholder="+254 ..." />
                        </Field>
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Email Address" htmlFor="email" error={errors.email?.message}>
                          <input id="email" type="email" {...register("email")} className={iCls} placeholder="you@example.com" />
                        </Field>
                        <Field label="Package" htmlFor="package" error={errors.package?.message}>
                          <select id="package" {...register("package")} className={iCls}>
                            <option value="">Select a package</option>
                            <option value="Couples Picnic Date — KES 5,500">Couples Picnic Date — KES 5,500 ❤️</option>
                            <option value="Birthday Package — KSh 24,000">Birthday Package — KSh 24,000</option>
                            <option value="Meeting Package — KSh 18,500">Meeting Package — KSh 18,500</option>
                            <option value="Camping Package — KSh 15,500">Camping Package — KSh 15,500</option>
                            <option value="Photoshoot Package — KSh 10,800">Photoshoot Package — KSh 10,800</option>
                          </select>
                        </Field>
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Number of Guests" htmlFor="guests" error={errors.guests?.message}>
                          <input id="guests" type="number" min={1} {...register("guests", { valueAsNumber: true })} className={iCls} placeholder="2" />
                        </Field>
                        <Field label="Preferred Date" htmlFor="date" error={errors.date?.message}>
                          <input id="date" type="date" {...register("date")} className={iCls} />
                        </Field>
                      </div>
                      <Field label="Preferred Time" htmlFor="time" error={errors.time?.message}>
                        <input id="time" type="time" {...register("time")} className={iCls} />
                      </Field>
                      <div>
                        <label htmlFor="specialRequests" className="mb-2 block text-sm font-medium text-[#3d2530]">Special Requests</label>
                        <textarea id="specialRequests" {...register("specialRequests")} rows={3}
                          className={iCls} placeholder="Any special requests, theme preferences, or surprises planned?" />
                      </div>
                      <button type="submit"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#6b1a2a] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(107,26,42,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4e1120] hover:shadow-[0_10px_28px_rgba(107,26,42,0.42)] active:scale-95">
                        Reserve My Date <Heart size={15} className="fill-white" />
                      </button>
                    </form>
                  </>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: E }}
                    className="py-4 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1], delay: 0.15 }}
                      className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fde8ed] text-[#6b1a2a]">
                      <Heart size={28} className="fill-[#6b1a2a]" />
                    </motion.div>
                    <h3 className="mt-6 font-display text-3xl text-[#1a1014] sm:text-4xl">Booking submitted! ❤️</h3>
                    <p className="mt-3 text-sm text-[#7a5c65] sm:text-base">Your request is received. We&apos;ll confirm shortly via WhatsApp or email.</p>
                    <div className="mt-5 rounded-2xl border border-[#e8d8dc] bg-[#fdf8f0] p-4 text-left">
                      <p className="text-[10px] uppercase tracking-[0.26em] text-[#7a5c65]">Reference</p>
                      <p className="mt-2 font-display text-2xl font-semibold text-[#6b1a2a]">{bookingRef}</p>
                    </div>
                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                      <a href="https://wa.me/254757692495" target="_blank" rel="noreferrer"
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#6b1a2a] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#4e1120] active:scale-95">
                        <MessageCircle size={15} /> WhatsApp Us
                      </a>
                      <Link href="#home"
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#e8d8dc] bg-white px-5 py-3 text-sm font-semibold text-[#1a1014] transition-all hover:border-[#c4607a] active:scale-95">
                        Back Home
                      </Link>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            AVAILABILITY CALENDAR
            ══════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP} className="mb-10 flex items-center gap-3 sm:mb-12">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#fde8ed] text-[#6b1a2a] sm:h-12 sm:w-12">
                <CalendarDays size={21} />
              </div>
              <h3 className="font-display text-3xl text-[#1a1014] sm:text-4xl">Availability Calendar</h3>
            </motion.div>

            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={VP}
              className="rounded-[24px] border border-[#e8d8dc] bg-[#fdf8f0] p-4 shadow-[0_12px_28px_rgba(107,26,42,0.06)] sm:rounded-[28px] sm:p-6">

              {/* Month nav — max 2 months */}
              <div className="mb-6 flex items-center justify-between">
                <button type="button" aria-label="Previous month" disabled={calendarOffset === 0}
                  onClick={() => setCalendarOffset(0)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8d8dc] bg-white text-[#1a1014] transition-all hover:border-[#c4607a] disabled:cursor-not-allowed disabled:opacity-30 sm:h-10 sm:w-10">
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <div className="text-center">
                  <p className="font-semibold text-[#1a1014] sm:text-lg">
                    {new Date(calYear, calMonth).toLocaleString("default", { month: "long", year: "numeric" })}
                  </p>
                  <div className="mt-1.5 flex justify-center gap-2">
                    {[0, 1].map(o => (
                      <button key={o} type="button" onClick={() => setCalendarOffset(o)}
                        aria-label={o === 0 ? "Current month" : "Next month"}
                        className={`h-1.5 rounded-full transition-all duration-300 ${calendarOffset === o ? "w-6 bg-[#6b1a2a]" : "w-1.5 bg-[#e8d8dc] hover:bg-[#c4607a]"}`} />
                    ))}
                  </div>
                </div>
                <button type="button" aria-label="Next month" disabled={calendarOffset === 1}
                  onClick={() => setCalendarOffset(1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8d8dc] bg-white text-[#1a1014] transition-all hover:border-[#c4607a] disabled:cursor-not-allowed disabled:opacity-30 sm:h-10 sm:w-10">
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
                  <div key={d} className="pb-2 text-center text-[9px] font-semibold uppercase tracking-[0.16em] text-[#7a5c65] sm:text-xs">{d}</div>
                ))}
              </div>

              {/* Date cells */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {Array.from({ length: calOffset }).map((_, i) => <div key={`e-${i}`} />)}
                {Array.from({ length: calDays }, (_, i) => {
                  const day = i + 1;
                  const isToday = calendarOffset === 0 && day === today.getDate();
                  let status: "available" | "pending" | "unavailable";
                  if (calendarOffset === 0 && day < today.getDate()) status = "unavailable";
                  else if (day % 5 === 0 || day % 7 === 0) status = "pending";
                  else status = "available";
                  return (
                    <div key={day}
                      className={`relative flex h-9 items-center justify-center rounded-xl border text-xs font-medium transition-all sm:h-12 sm:rounded-2xl sm:text-sm ${
                        status === "available"   ? "border-[#f0c4cd] bg-[#fde8ed] text-[#6b1a2a]"
                        : status === "pending"   ? "border-[#e2d4a8] bg-[#f9f0d8] text-[#7a5821]"
                        :                         "border-[#e8d8dc] bg-[#faf5f6] text-[#b09098]"
                      } ${isToday ? "ring-2 ring-[#6b1a2a] ring-offset-1" : ""}`}>
                      {day}
                      {isToday && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#6b1a2a] sm:h-2.5 sm:w-2.5" />}
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap gap-3 text-xs text-[#7a5c65] sm:mt-6 sm:gap-4 sm:text-sm">
                {[["#fde8ed","Available"],["#f9f0d8","Pending"],["#faf5f6","Unavailable"]].map(([c, l]) => (
                  <div key={l} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3" style={{ background: c }} />{l}
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full ring-2 ring-[#6b1a2a] sm:h-3 sm:w-3" /> Today
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            TESTIMONIALS
            ══════════════════════════════════════════════════════════════════════ */}
        <section className="bg-[#f7efe2] py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP} className="mb-12 max-w-2xl">
              <p className="kicker">Testimonials</p>
              <h2 className="mt-5 font-display text-4xl text-[#1a1014] sm:text-5xl lg:text-6xl">
                Loved by couples <span className="italic text-[#6b1a2a]">just like you</span>
              </h2>
            </motion.div>

            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={VP}
              className="rounded-[24px] border border-[#e8d8dc] bg-white p-5 shadow-[0_14px_34px_rgba(107,26,42,0.07)] sm:rounded-[30px] sm:p-8">
              <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:gap-10">
                {/* Photo */}
                <div className="hidden overflow-hidden rounded-[20px] sm:block sm:rounded-[24px]">
                  <AnimatePresence mode="wait">
                    <motion.div key={testimonialIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                      <Image src={testimonials[testimonialIdx].image} alt={testimonials[testimonialIdx].name}
                        width={700} height={900} className="h-[300px] w-full object-cover lg:h-[400px]" />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Quote */}
                <div>
                  <div className="flex gap-1 text-[#b8972a]">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div key={testimonialIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.32 }}>
                      <p className="mt-5 font-serif text-xl italic leading-9 text-[#1a1014] sm:mt-6 sm:text-2xl lg:text-3xl lg:leading-10">
                        &ldquo;{testimonials[testimonialIdx].quote}&rdquo;
                      </p>
                      <div className="mt-6 border-t border-[#e8d8dc] pt-5 sm:mt-7">
                        <p className="font-semibold text-[#1a1014] sm:text-lg">{testimonials[testimonialIdx].name}</p>
                        <p className="mt-0.5 text-xs uppercase tracking-[0.22em] text-[#7a5c65] sm:text-sm">{testimonials[testimonialIdx].event}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-6 flex items-center gap-3 sm:mt-7">
                    <button type="button" aria-label="Previous testimonial"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e8d8dc] bg-[#fdf8f0] text-[#1a1014] transition-all hover:border-[#c4607a] active:scale-90 sm:h-11 sm:w-11"
                      onClick={() => setTestimonialIdx(c => (c - 1 + testimonials.length) % testimonials.length)}>
                      <ChevronRight size={16} className="rotate-180" />
                    </button>
                    <button type="button" aria-label="Next testimonial"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e8d8dc] bg-[#fdf8f0] text-[#1a1014] transition-all hover:border-[#c4607a] active:scale-90 sm:h-11 sm:w-11"
                      onClick={() => setTestimonialIdx(c => (c + 1) % testimonials.length)}>
                      <ChevronRight size={16} />
                    </button>
                    <div className="ml-2 flex gap-1.5">
                      {testimonials.map((_, i) => (
                        <button key={i} type="button" aria-label={`Go to testimonial ${i + 1}`}
                          onClick={() => setTestimonialIdx(i)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${i === testimonialIdx ? "w-6 bg-[#6b1a2a]" : "w-1.5 bg-[#e8d8dc] hover:bg-[#c4607a]"}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>


        {/* FAQ */}
        <section className="bg-white py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP} className="mb-10 sm:mb-12">
              <p className="kicker">FAQ</p>
              <h2 className="mt-5 font-display text-4xl text-[#1a1014] sm:text-5xl lg:text-6xl">
                Common <span className="italic text-[#6b1a2a]">questions</span>
              </h2>
            </motion.div>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={VP} className="space-y-3 sm:space-y-4">
              {faqItems.map((item, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <motion.div key={item.question} variants={cardUp}
                    className="overflow-hidden rounded-[20px] border border-[#e8d8dc] bg-[#fdf8f0] sm:rounded-[24px]">
                    <button type="button" aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:py-5"
                      onClick={() => setExpandedFaq(isOpen ? null : idx)}>
                      <span className="text-base font-medium text-[#1a1014] sm:text-lg">{item.question}</span>
                      <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.22 }}
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#6b1a2a] sm:h-8 sm:w-8">
                        <Plus size={15} />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: E }} className="overflow-hidden">
                          <p className="px-5 pb-5 text-sm leading-7 text-[#7a5c65] sm:text-base">{item.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="bg-[#f7efe2] py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP} className="mb-12">
              <p className="kicker">Contact</p>
              <h2 className="mt-5 font-display text-4xl text-[#1a1014] sm:text-5xl lg:text-6xl">
                Plan your next <span className="italic text-[#6b1a2a]">meaningful gathering</span>
              </h2>
            </motion.div>
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              {/* Details */}
              <motion.div variants={slideL} initial="hidden" whileInView="visible" viewport={VP}
                className="rounded-[24px] border border-[#e8d8dc] bg-white p-5 shadow-[0_12px_28px_rgba(107,26,42,0.06)] sm:rounded-[28px] sm:p-8">
                <div className="space-y-4 sm:space-y-5">
                  {[
                    { Icon: Phone,         label: "Phone",    node: <a href="tel:+254757692495" className="mt-1 text-base font-semibold text-[#6b1a2a] transition-colors hover:text-[#4e1120] sm:text-lg">+254 757 692 495</a> },
                    { Icon: MessageCircle, label: "WhatsApp", node: <a href="https://wa.me/254757692495" target="_blank" rel="noreferrer" className="mt-1 text-base font-semibold text-[#6b1a2a] transition-colors hover:text-[#4e1120] sm:text-lg">Chat with us</a> },
                    { Icon: Mail,          label: "Email",    node: <a href="mailto:hello@berakhahgardens.co.ke" className="mt-1 break-all text-base font-semibold text-[#6b1a2a] transition-colors hover:text-[#4e1120] sm:text-lg">hello@berakhahgardens.co.ke</a> },
                    { Icon: MapPin,        label: "Location", node: <p className="mt-1 text-base font-medium text-[#1a1014] sm:text-lg">Nanyuki, Laikipia County, Kenya</p> },
                    { Icon: Clock,         label: "Hours",    node: <p className="mt-1 text-base font-medium text-[#1a1014] sm:text-lg">Mon – Sun: 8:00 AM – 8:00 PM</p> },
                  ].map(({ Icon, label, node }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#fde8ed] text-[#6b1a2a] sm:h-11 sm:w-11">
                        <Icon size={17} />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-[#7a5c65]">{label}</p>
                        {node}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="tel:+254757692495" className="btn-burgundy text-sm">
                    <Phone size={15} /> Call Now
                  </a>
                  <a href="https://wa.me/254757692495" target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#e8d8dc] bg-white px-5 py-2.5 text-sm font-semibold text-[#6b1a2a] transition-all hover:border-[#c4607a] hover:bg-[#fde8ed] active:scale-95">
                    <MessageCircle size={15} /> WhatsApp
                  </a>
                  <a href="https://maps.google.com/?q=Nanyuki+Kenya" target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#e8d8dc] bg-white px-5 py-2.5 text-sm font-semibold text-[#6b1a2a] transition-all hover:border-[#c4607a] hover:bg-[#fde8ed] active:scale-95">
                    <MapPin size={15} /> Get Directions
                  </a>
                </div>
              </motion.div>
              {/* Map */}
              <motion.div variants={slideR} initial="hidden" whileInView="visible" viewport={VP}
                className="min-h-[300px] overflow-hidden rounded-[24px] border border-[#e8d8dc] bg-white shadow-[0_12px_28px_rgba(107,26,42,0.06)] sm:min-h-[400px] sm:rounded-[28px] lg:min-h-0">
                <iframe title="Berakhah Gardens map" src="https://www.google.com/maps?q=Nanyuki+Kenya&output=embed"
                  className="h-full min-h-[300px] w-full border-0 sm:min-h-[400px] lg:min-h-[520px]"
                  loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </motion.div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#e8d8dc] bg-[#1a0810] text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[#d4af5a]">
                  <TreePine size={18} />
                </div>
                <div>
                  <p className="font-display text-xl text-white">Berakhah</p>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/50">Gardens Nanyuki</p>
                </div>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-7 text-white/60">
                Nanyuki&apos;s most romantic outdoor venue for couples, families, and memorable gatherings.
              </p>
              <div className="mt-5 flex gap-1 text-[#b8972a]">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                <span className="ml-2 text-xs text-white/50">500+ happy couples</span>
              </div>
            </div>
            {/* Links */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">Quick Links</p>
              <ul className="mt-4 space-y-2.5 text-sm text-white/70">
                {[["Experience","#experience"],["What&apos;s Included","#included"],["Gallery","#gallery"],["Packages","#packages"],["Book Now","#booking"]].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="transition-colors hover:text-white" dangerouslySetInnerHTML={{ __html: label }} />
                  </li>
                ))}
              </ul>
            </div>
            {/* Contact */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">Contact</p>
              <ul className="mt-4 space-y-2.5 text-sm text-white/70">
                <li><a href="tel:+254757692495" className="transition-colors hover:text-white">+254 757 692 495</a></li>
                <li><a href="mailto:hello@berakhahgardens.co.ke" className="transition-colors hover:text-white">hello@berakhahgardens.co.ke</a></li>
                <li><a href="https://wa.me/254757692495" target="_blank" rel="noreferrer" className="transition-colors hover:text-white">WhatsApp Us</a></li>
                <li className="text-white/50">Nanyuki, Laikipia County, Kenya</li>
              </ul>
            </div>
            {/* CTA */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">Book a Date</p>
              <p className="mt-4 text-sm leading-6 text-white/60">Ready to create an unforgettable memory? Secure your slot today.</p>
              <Link href="#booking"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#b8972a] px-5 py-2.5 text-sm font-semibold text-[#1a0810] transition-all hover:bg-[#d4af5a] active:scale-95">
                Book Now <Heart size={14} className="fill-[#1a0810]" />
              </Link>
              <div className="mt-4 flex flex-col gap-2.5">
                <input type="email" placeholder="Your email for updates"
                  aria-label="Newsletter email"
                  className="w-full rounded-full border border-white/15 bg-white/8 px-4 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-[#c4607a] focus:ring-2 focus:ring-[#c4607a]/20" />
                <button type="button" className="rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/20 active:scale-95">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Berakhah Gardens Nanyuki. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <div className="flex gap-4">
                {[["Facebook","https://www.facebook.com"],["Instagram","https://www.instagram.com"],["TikTok","https://www.tiktok.com"]].map(([n,h]) => (
                  <a key={n} href={h} target="_blank" rel="noreferrer" aria-label={n} className="transition-colors hover:text-white">{n}</a>
                ))}
              </div>
              <span className="hidden sm:block text-white/20">|</span>
              {/* LoosukDevs credit */}
              <p className="flex items-center gap-1 text-white/40">
                Developed with <Heart size={10} className="fill-[#c4607a] text-[#c4607a]" /> by{" "}
                <span className="font-semibold text-[#c4607a]">LoosukDevs</span>
              </p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
