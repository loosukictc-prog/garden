"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  CalendarDays,
  Camera,
  Car,
  Check,
  ChevronRight,
  Clock,
  Leaf,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Tent,
  TreePine,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

/* ─── Shared animation variants ──────────────────────────────────────────────
   All entry animations use transform + opacity only — no layout-affecting
   properties — so they cannot cause overlap or layout shift.
   ─────────────────────────────────────────────────────────────────────────── */
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.65, ease: EASE as any },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const slideLeft = {
  hidden: { opacity: 0, x: -36 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE as any } },
};

const slideRight = {
  hidden: { opacity: 0, x: 36 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE as any } },
};

/* Stagger container — drives staggerChildren only, never positions items */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};

/* Card entry — opacity + small Y + tiny scale. No translate-y in the grid! */
const cardEntry = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.55, ease: EASE as any },
  },
};

const VP = { once: true, amount: 0.12 } as const;

/* ─── Static data ────────────────────────────────────────────────────────── */
const navItems = [
  { label: "Home",        href: "#home" },
  { label: "About",       href: "#about" },
  { label: "Experiences", href: "#experiences" },
  { label: "Gallery",     href: "#gallery" },
  { label: "Packages",    href: "#packages" },
  { label: "Booking",     href: "#booking" },
  { label: "Contact",     href: "#contact" },
];

const statCards = [
  { value: 12,   suffix: "+",   label: "Garden spaces",    icon: TreePine },
  { value: 365,  suffix: "/yr", label: "Event-ready days", icon: CalendarDays },
  { value: 2500, suffix: "+",   label: "Guests hosted",    icon: Users },
  { value: 180,  suffix: "+",   label: "Photo moments",    icon: Camera },
];

/*
  WHY CHOOSE US FIX — root cause documented here:
  The previous code applied `xl:translate-y-12` to every odd-index card.
  CSS transforms do NOT affect layout flow — the grid rows collapse to their
  natural height, and the shifted card paints over the next row's content.
  Fix: remove all positional transforms from the grid. Stagger is handled
  exclusively by Framer Motion `cardEntry` (opacity + y during entrance only).
*/
const features = [
  { icon: Leaf,       title: "Naturally serene",   description: "Shaded lawns, fresh air, and greenery that create a calming backdrop for every gathering." },
  { icon: ShieldCheck,title: "Trusted hosting",    description: "A reliable venue experience with thoughtful support from setup to event closeout." },
  { icon: Car,        title: "Easy access",        description: "Convenient arrival for guests, with comfortable parking and a simple flow from gate to garden." },
  { icon: MapPin,     title: "Nanyuki location",   description: "Set in the beauty of Nanyuki, just far enough to feel private and peaceful." },
  { icon: Tent,       title: "Flexible setups",    description: "From relaxed picnics to full event production, our spaces adapt to your celebration style." },
  { icon: Sparkles,   title: "Thoughtful details", description: "Decor choices, curated ambience, and warm hospitality are designed to feel personal and premium." },
];

const experiences = [
  { title: "Birthday Celebrations", icon: Sparkles,    description: "Celebrate with music, garden dining, and a joyful atmosphere made for memorable birthdays and family gatherings.",           bullets: ["Decor-ready lawn", "Custom setup", "Ambience lighting"],      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80", alt: "Birthday celebration at a garden venue" },
  { title: "Meetings & Workshops",  icon: ShieldCheck, description: "Professional yet calming spaces that feel productive, welcoming, and visually inspiring for meaningful sessions.",            bullets: ["Boardroom setup", "Quiet campus feel", "Reliable power access"], image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80", alt: "Business meeting in an outdoor event venue" },
  { title: "Team Building",         icon: Users,       description: "Encourage connection through outdoor games, relaxed interaction, and a natural setting that energizes teams.",                bullets: ["Open-air activities", "Flexible layouts", "Group-focused flow"],  image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80", alt: "Team bonding and outdoor activity in a garden" },
  { title: "Family Picnics",        icon: Leaf,        description: "Slow afternoons under the trees with curated picnic spaces, blanket-friendly layouts, and room to connect.",                  bullets: ["Shade and seating", "Picnic-ready spaces", "Easy family flow"],  image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80", alt: "Family picnic in a scenic garden" },
  { title: "Photoshoots",           icon: Camera,      description: "Beautiful natural backdrops, open light, and lush textures designed to elevate portraits and brand imagery.",                 bullets: ["Natural light", "Scenic corners", "Versatile backdrops"],       image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80", alt: "Photoshoot setup in a lush outdoor garden" },
  { title: "Camping",               icon: Tent,        description: "A peaceful camp escape under the stars for small groups, retreats, and stargazing evenings in nature.",                       bullets: ["Camping corner", "Evening ambience", "Nature rooted stay"],     image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80", alt: "Camping experience under the stars at a garden venue" },
];

const spaces = [
  { title: "Garden Lawn",      capacity: "Up to 250 guests", bestFor: "Weddings, birthdays, open-air celebrations",         image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80" },
  { title: "Gazebo",           capacity: "Up to 40 guests",  bestFor: "Intimate gatherings and quiet events",                image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80" },
  { title: "Picnic Area",      capacity: "Up to 30 guests",  bestFor: "Family days and relaxed social moments",              image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80" },
  { title: "Meeting Pavilion", capacity: "Up to 60 guests",  bestFor: "Workshops, trainings, and strategic sessions",        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80" },
  { title: "Camping Corner",   capacity: "Up to 16 campers", bestFor: "Overnight nature retreats and team escapes",          image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80" },
  { title: "Photo Spots",      capacity: "Flexible styling", bestFor: "Content shoots and portrait sessions",                image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80" },
];

const galleryItems = [
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",  alt: "Garden birthday celebration setup",          category: "Birthdays",     aspect: "portrait"  },
  { src: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80", alt: "Open lawn garden view",                       category: "Garden Views",  aspect: "landscape" },
  { src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",  alt: "Outdoor team building activity",              category: "Meetings",      aspect: "portrait"  },
  { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",  alt: "Picnic area with friends and sunlight",        category: "Picnics",       aspect: "landscape" },
  { src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80",  alt: "Garden lawn with event setup",                 category: "Birthdays",     aspect: "landscape" },
  { src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",  alt: "Camping corner at dusk",                       category: "Camping",       aspect: "portrait"  },
  { src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",  alt: "Stylish photo setup in the garden",            category: "Photoshoots",   aspect: "landscape" },
  { src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",  alt: "Decorated gazebo in soft afternoon light",     category: "Garden Views",  aspect: "portrait"  },
];

const pricing = [
  { name: "Birthday Package",   price: "KSh 24,000", duration: "4 hours",     guests: "Up to 80 guests",  features: ["Garden lawn access", "Decor assistance", "Sound setup", "Guest seating"],              featured: false },
  { name: "Meeting Package",    price: "KSh 18,500", duration: "3 hours",     guests: "Up to 50 guests",  features: ["Pavilion access", "Projector support", "Tea station", "Flexible seating"],             featured: false },
  { name: "Picnic Package",     price: "KSh 12,000", duration: "2 hours",     guests: "Up to 30 guests",  features: ["Picnic setup", "Blanket area", "Refreshments", "Garden access"],                       featured: true  },
  { name: "Camping Package",    price: "KSh 15,500", duration: "Overnight",   guests: "Up to 16 guests",  features: ["Camp setup", "Outdoor lighting", "Fire pit zone", "Nature experience"],                featured: false },
  { name: "Photoshoot Package", price: "KSh 10,800", duration: "90 minutes",  guests: "Up to 10 people",  features: ["Scenic spots", "Natural light", "Styling guidance", "Access to multiple corners"],     featured: false },
];

const testimonials = [
  { name: "Njeri W.",    event: "Birthday celebration", quote: "The garden felt magical from the moment we arrived. The setting was calm, beautiful, and perfect for our family's celebration.",                             image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80" },
  { name: "Michael K.",  event: "Team building day",    quote: "We wanted a venue that felt productive but still relaxed. Berakhah delivered exactly that, and our team loved every minute.",                              image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80" },
  { name: "Amina S.",    event: "Photoshoot session",   quote: "The light, the greenery, and the natural flow of the venue made our shoot feel effortless and premium without being staged.",                              image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=80" },
];

const faqItems = [
  { question: "How do I book?",                          answer: "You can reserve your date by completing the booking form on this page or reaching out via WhatsApp. We usually confirm availability within 24 hours." },
  { question: "Can I bring decorations?",                answer: "Yes, with prior approval, you may bring selected decorations. We can also recommend styling partners for a smoother setup." },
  { question: "Is parking available?",                   answer: "Yes, guest parking is available on site and arranged for convenience during your event." },
  { question: "Do you offer catering?",                  answer: "We can coordinate food and refreshment arrangements through trusted partners or work with your preferred caterer." },
  { question: "Do you allow overnight camping?",         answer: "Yes, camping remains available for designated packages and small group stays with prior arrangement." },
  { question: "What happens after submitting a booking?",answer: "After submission, we review the request, confirm the date and package, and send your reservation details and WhatsApp confirmation." },
];

/* ─── Types ──────────────────────────────────────────────────────────────── */
type BookingForm = {
  fullName: string; phone: string; email: string;
  eventType: string; package: string; guests: number;
  date: string; time: string; specialRequests?: string;
  decorations?: boolean; catering?: boolean; photography?: boolean;
};

const bookingSchema: z.ZodType<BookingForm> = z.object({
  fullName:        z.string().min(2, "Please enter your full name."),
  phone:           z.string().min(8, "Please enter a valid phone number."),
  email:           z.string().email("Please enter a valid email address."),
  eventType:       z.string().min(1, "Please choose an event type."),
  package:         z.string().min(1, "Please select a package."),
  guests:          z.coerce.number().min(1, "Guest count must be at least 1."),
  date:            z.string().min(1, "Please choose a preferred date."),
  time:            z.string().min(1, "Please choose a preferred time."),
  specialRequests: z.string().optional(),
  decorations:     z.boolean().optional(),
  catering:        z.boolean().optional(),
  photography:     z.boolean().optional(),
});

/* ─── Reusable field wrapper ──────────────────────────────────────────────── */
const Field = ({ label, htmlFor, error, children }: {
  label: string; htmlFor: string; error?: string; children: React.ReactNode;
}) => (
  <div>
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-[#374151]">{label}</label>
    {children}
    {error && <p className="mt-1.5 text-sm text-[#b91c1c]">{error}</p>}
  </div>
);

const inputCls = "w-full rounded-2xl border border-[#E5E7EB] bg-[#FAF8F3] px-4 py-3 text-[#1F2937] outline-none transition-all duration-200 focus:border-[#1F5E3B] focus:ring-2 focus:ring-[#1F5E3B]/10 placeholder:text-[#9CA3AF]";

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  const [mobileOpen,      setMobileOpen]      = useState(false);
  const [scrolled,        setScrolled]        = useState(false);
  const [activeCategory,  setActiveCategory]  = useState("All");
  const [selectedImage,   setSelectedImage]   = useState<number | null>(null);
  const [expandedFaq,     setExpandedFaq]     = useState<number | null>(0);
  const [testimonialIdx,  setTestimonialIdx]  = useState(0);
  const [bookingRef,      setBookingRef]      = useState("");
  const [isSubmitted,     setIsSubmitted]     = useState(false);

  /* Calendar — 0 = current month, 1 = next month */
  const [calendarOffset, setCalendarOffset] = useState(0);
  const today = useMemo(() => new Date(), []);
  const calendarDate = useMemo(() => {
    const d = new Date(today.getFullYear(), today.getMonth() + calendarOffset, 1);
    return d;
  }, [today, calendarOffset]);
  const calendarYear  = calendarDate.getFullYear();
  const calendarMonth = calendarDate.getMonth();
  const calendarDaysInMonth = useMemo(
    () => new Date(calendarYear, calendarMonth + 1, 0).getDate(),
    [calendarYear, calendarMonth],
  );
  /* Monday-based offset: how many empty cells before the 1st */
  const calendarStartOffset = useMemo(() => {
    const jsDay = new Date(calendarYear, calendarMonth, 1).getDay(); // 0=Sun
    return jsDay === 0 ? 6 : jsDay - 1; // convert to Mon=0
  }, [calendarYear, calendarMonth]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(galleryItems.map((i) => i.category)))],
    [],
  );
  const filteredGallery = useMemo(
    () => activeCategory === "All" ? galleryItems : galleryItems.filter((i) => i.category === activeCategory),
    [activeCategory],
  );

  const { register, handleSubmit, formState: { errors }, reset } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema as any) as any,
    defaultValues: { fullName:"", phone:"", email:"", eventType:"", package:"", guests:1, date:"", time:"", specialRequests:"", decorations:false, catering:false, photography:false },
  });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTestimonialIdx((c) => (c + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (selectedImage === null) return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSelectedImage(null); return; }
      if (e.key === "ArrowRight") setSelectedImage((c) => c === null ? 0 : Math.min(c + 1, filteredGallery.length - 1));
      if (e.key === "ArrowLeft")  setSelectedImage((c) => c === null ? filteredGallery.length - 1 : Math.max(c - 1, 0));
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [filteredGallery.length, selectedImage]);

  /* Prevent background scroll while lightbox / mobile menu is open */
  useEffect(() => {
    if (selectedImage !== null || mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImage, mobileOpen]);

  const onSubmit = async (values: BookingForm) => {
    const ref = `BG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setBookingRef(ref);
    setIsSubmitted(true);
    reset();
    try {
      const res = await fetch("/api/send-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, bookingReference: ref }),
      });
      const result = await res.json();
      if (result.success) console.log("✅ Booking sent to WhatsApp!", result.messageId);
      else console.log("⚠️ WhatsApp delivery status:", result.message);
    } catch (err) { console.error("Error sending booking:", err); }
  };

  /* When reduced-motion is requested, skip initial animations entirely */
  const skipAnims = prefersReducedMotion ?? false;
  const maybeInit = skipAnims ? false : undefined;

  return (
    <div className="overflow-x-hidden bg-[#FAF8F3] text-[#1F2937]">

      {/* ════════════════════════════════════════════════════════════════════
          NAVBAR
          ════════════════════════════════════════════════════════════════════ */}
      <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#FAF8F3]/96 shadow-[0_8px_32px_rgba(17,24,39,0.09)] backdrop-blur-md" : "bg-transparent"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="#home" className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-80" aria-label="Berakhah Gardens home">
            <motion.div initial={skipAnims ? false : { opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.5, ease:EASE }}>
              <Image src="/logo.png" alt="Berakhah Gardens Logo" width={40} height={40} className="h-10 w-10 object-contain" />
            </motion.div>
            <motion.div initial={skipAnims ? false : { opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5, ease:EASE, delay:0.06 }}>
              <p className="font-display text-lg leading-none text-[#1F2937]">Berakhah</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#6B7280]">Gardens Nanyuki</p>
            </motion.div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            {navItems.map((item, i) => (
              <motion.div key={item.label} initial={skipAnims ? false : { opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.38, delay:0.07 + i * 0.05, ease:"easeOut" }}>
                <Link href={item.href} className="nav-link">{item.label}</Link>
              </motion.div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <motion.div className="hidden lg:flex" initial={skipAnims ? false : { opacity:0, scale:0.88 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.45, delay:0.5, ease:EASE }}>
            <Link href="#booking" className="inline-flex items-center gap-2 rounded-full bg-[#1F5E3B] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(31,94,59,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#174a31] hover:shadow-[0_8px_22px_rgba(31,94,59,0.32)] active:scale-95">
              Book Now <ArrowRight size={15} />
            </Link>
          </motion.div>

          {/* Mobile hamburger */}
          <button type="button" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB] bg-white/80 text-[#1F2937] shadow-sm transition-all duration-200 hover:border-[#C7DCCB] active:scale-90 lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={mobileOpen ? "x" : "menu"} initial={{ opacity:0, rotate:-90, scale:0.7 }} animate={{ opacity:1, rotate:0, scale:1 }} exit={{ opacity:0, rotate:90, scale:0.7 }} transition={{ duration:0.17 }}>
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }} transition={{ duration:0.3, ease:EASE }}
              className="overflow-hidden border-t border-[#E5E7EB] bg-[#FAF8F3]/98 backdrop-blur-md lg:hidden">
              <nav aria-label="Mobile navigation" className="flex flex-col gap-1 px-4 py-5">
                {navItems.map((item, i) => (
                  <motion.div key={item.label} initial={{ opacity:0, x:-14 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.22, delay:i * 0.04, ease:"easeOut" }}>
                    <Link href={item.href} className="block rounded-xl px-3 py-2.5 text-base font-medium text-[#1F2937] transition-colors hover:bg-[#EAF3EE] hover:text-[#1F5E3B]" onClick={() => setMobileOpen(false)}>
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.22, delay:navItems.length * 0.04 + 0.04 }}>
                  <Link href="#booking" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1F5E3B] px-5 py-3 text-sm font-semibold text-white active:scale-95" onClick={() => setMobileOpen(false)}>
                    Book Now <ArrowRight size={15} />
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main id="home">
        {/* ════════════════════════════════════════════════════════════════════
            HERO
            ════════════════════════════════════════════════════════════════════ */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80" alt="Scenic garden venue" fill priority className="object-cover" />
            <div className="absolute inset-0 bg-[#0d1a14]/42" />
          </div>
          <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-8 px-4 pb-14 pt-16 sm:min-h-[760px] sm:px-6 sm:pt-20 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:pt-14">

            {/* Hero text */}
            <motion.div initial={skipAnims ? false : { opacity:0, y:32 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, ease:EASE }} className="max-w-xl text-white">
              <motion.p initial={skipAnims ? false : { opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.9, delay:0.1 }} className="mb-5 text-xs font-medium uppercase tracking-[0.32em] text-[#F7F3EB]">Berakhah Gardens</motion.p>
              <motion.h1 initial={skipAnims ? false : { opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, ease:EASE, delay:0.15 }} className="font-display text-4xl leading-none tracking-[-0.04em] sm:text-5xl md:text-6xl lg:text-7xl">
                Nanyuki
              </motion.h1>
              <motion.p initial={skipAnims ? false : { opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.65, ease:"easeOut", delay:0.25 }} className="mt-4 max-w-lg text-base text-[#F5F1EA] sm:text-lg md:text-xl">
                Hidden Gem for Birthdays, Meetings, Picnics and Outdoor Experiences.
              </motion.p>
              <motion.p initial={skipAnims ? false : { opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.65, ease:"easeOut", delay:0.33 }} className="mt-4 max-w-md text-sm leading-7 text-[#efe7db] sm:text-base">
                A peaceful garden venue where thoughtful gatherings, fresh air, and natural beauty come together for celebrations that feel personal, premium, and unforgettable.
              </motion.p>
              <motion.div initial={skipAnims ? false : { opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, ease:"easeOut", delay:0.42 }} className="mt-7 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link href="#booking" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1F5E3B] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(31,94,59,0.35)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#174a31] hover:shadow-[0_10px_28px_rgba(31,94,59,0.4)] active:scale-95">
                  Book Your Event <ArrowRight size={15} />
                </Link>
                <Link href="#gallery" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/18 active:scale-95">
                  View Gallery
                </Link>
              </motion.div>
              <motion.div initial={skipAnims ? false : { opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.6, delay:0.65 }} className="mt-10 flex items-center gap-3 text-[#F0E9DD]">
                <motion.div animate={{ y:[0,5,0] }} transition={{ duration:2.2, repeat:Infinity, ease:"easeInOut" }} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/5">
                  <ChevronRight size={15} className="rotate-90" />
                </motion.div>
                <span className="text-xs uppercase tracking-[0.25em]">Scroll to explore</span>
              </motion.div>
            </motion.div>

            {/* Hero card */}
            <motion.div initial={skipAnims ? false : { opacity:0, x:28, scale:0.97 }} animate={{ opacity:1, x:0, scale:1 }} transition={{ duration:0.9, ease:EASE, delay:0.2 }} className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/20 bg-white/10 p-2.5 shadow-[0_28px_70px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:max-w-lg sm:rounded-[30px] sm:p-3">
                <div className="overflow-hidden rounded-[22px]">
                  <Image src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=80" alt="Outdoor event seating in a premium garden setting" width={900} height={1200} className="h-[440px] w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[560px] lg:h-[620px]" />
                </div>
                <div className="absolute -bottom-5 left-6 max-w-[200px] rounded-2xl bg-[#FAF8F3] p-3.5 shadow-[0_14px_36px_rgba(15,23,42,0.14)] sm:-bottom-6 sm:left-8 sm:max-w-[230px] sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#E7F1EA] text-[#1F5E3B] sm:h-11 sm:w-11"><Leaf size={17} /></div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.22em] text-[#6B7280] sm:text-[10px]">Outdoor Luxury</p>
                      <p className="text-base font-semibold text-[#1F2937] sm:text-lg">Peaceful gatherings</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            ABOUT
            ════════════════════════════════════════════════════════════════════ */}
        <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <motion.div variants={slideLeft} initial="hidden" whileInView="visible" viewport={VP}>
              <div className="overflow-hidden rounded-[24px] shadow-[0_24px_60px_rgba(17,24,39,0.09)] sm:rounded-[28px]">
                <Image src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80" alt="Berakhah Gardens landscape and greenery in Nanyuki" width={1200} height={1400} className="h-[380px] w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[500px] lg:h-[620px]" />
              </div>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP} className="max-w-xl">
              <p className="section-kicker">About us</p>
              <h2 className="mt-5 font-display text-3xl leading-tight text-[#1F2937] sm:text-4xl lg:text-5xl">A Place Where Nature Meets Celebration</h2>
              <p className="mt-5 text-base leading-8 text-[#4B5563] sm:text-lg">Berakhah Gardens Nanyuki was created to offer a place where people can gather freely, celebrate beautifully, and enjoy the warmth of outdoor luxury in a natural setting.</p>
              <p className="mt-4 text-sm leading-7 text-[#6B7280] sm:text-base">Nestled in the calm beauty of Nanyuki, our garden offers a welcoming atmosphere for birthdays, meetings, family picnics, creative sessions, and private moments worth remembering.</p>
              <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={VP} className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
                {statCards.map(({ value, suffix, label, icon: Icon }) => (
                  <motion.div key={label} variants={cardEntry} className="human-card rounded-[20px] p-4 sm:rounded-[24px] sm:p-5">
                    <div className="icon-tile h-10 w-10 rounded-xl sm:h-11 sm:w-11 sm:rounded-2xl"><Icon size={19} /></div>
                    <div className="mt-4 text-2xl font-semibold text-[#1F2937] sm:mt-5 sm:text-3xl">{value}<span className="text-base text-[#4C7A57] sm:text-lg">{suffix}</span></div>
                    <p className="mt-1.5 text-xs text-[#6B7280] sm:text-sm">{label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            WHY CHOOSE US
            ────────────────────────────────────────────────────────────────────
            ROOT CAUSE FIX:
            The old code used `xl:translate-y-12` on every odd-indexed card.
            CSS `transform: translateY()` does NOT remove the element from
            flow — the grid still allocates the normal row height, so the
            shifted card paints 48px below its allocated cell and overlaps
            the row beneath it.  Removed entirely.

            The visual stagger is now handled by Framer Motion staggerChildren
            on entrance only (opacity + y), which has zero impact on layout.
            Cards sit in a clean CSS grid with gap-6 on all breakpoints.
            ════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP} className="mb-10 max-w-2xl sm:mb-14">
              <p className="section-kicker">Why choose us</p>
              <h2 className="mt-4 font-display text-3xl text-[#1F2937] sm:text-4xl lg:text-5xl">A garden experience designed with care</h2>
            </motion.div>

            {/*
              Responsive grid:
              - Mobile (< 768px):   1 column  — cards stack vertically, full width
              - Tablet (768–1279px): 2 columns — side-by-side pairs
              - Desktop (≥ 1280px): 3 columns — classic 3-up layout
              gap-6 = 24px gutters on all axes, no overflow possible.
            */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={VP}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
            >
              {features.map(({ icon: Icon, title, description }) => (
                <motion.div key={title} variants={cardEntry} className="feature-card">
                  <div className="feature-card-icon"><Icon size={26} /></div>
                  <h3 className="mt-5 text-lg font-semibold text-[#1F2937] sm:text-xl">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#6B7280] sm:text-base">{description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            EXPERIENCES
            ════════════════════════════════════════════════════════════════════ */}
        <section id="experiences" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP} className="mb-12 max-w-2xl">
            <p className="section-kicker">Experiences</p>
            <h2 className="mt-4 font-display text-3xl text-[#1F2937] sm:text-4xl lg:text-5xl">Moments designed for every kind of gathering</h2>
          </motion.div>
          <div className="space-y-14 sm:space-y-16">
            {experiences.map(({ title, icon: Icon, description, bullets, image, alt }, index) => (
              <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP} className="grid items-center gap-8 lg:grid-cols-2">
                <div className={index % 2 === 0 ? "lg:order-1" : "lg:order-2"}>
                  <div className="overflow-hidden rounded-[26px] border border-[#E7DFD1] shadow-[0_16px_40px_rgba(17,24,39,0.07)] sm:rounded-[30px]">
                    <Image src={image} alt={alt} width={1200} height={900} className="h-[300px] w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[420px] lg:h-[480px]" />
                  </div>
                </div>
                <div className={`${index % 2 === 0 ? "lg:order-2" : "lg:order-1"}`}>
                  <div className="flex items-center gap-3">
                    <div className="icon-tile h-11 w-11 rounded-full sm:h-12 sm:w-12"><Icon size={20} /></div>
                    <p className="section-kicker">Experience</p>
                  </div>
                  <h3 className="mt-4 font-display text-3xl text-[#1F2937] sm:mt-5 sm:text-4xl">{title}</h3>
                  <p className="mt-4 text-base leading-8 text-[#4B5563] sm:mt-5 sm:text-lg">{description}</p>
                  <ul className="mt-5 space-y-3 text-sm text-[#374151] sm:mt-6 sm:text-base">
                    {bullets.map((b) => (
                      <li key={b} className="flex items-center gap-3">
                        <span className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#EAF3EE] text-[#1F5E3B] sm:h-6 sm:w-6"><Check size={13} /></span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link href="#booking" className="soft-button mt-7 inline-flex items-center gap-2 rounded-full bg-[#1F5E3B] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#174a31] active:scale-95 sm:mt-8 sm:px-6 sm:py-3">
                    Book This Experience <ArrowRight size={15} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SPACES
            ════════════════════════════════════════════════════════════════════ */}
        <section id="spaces" className="bg-white py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP} className="mb-10 max-w-2xl sm:mb-14">
              <p className="section-kicker">Featured spaces</p>
              <h2 className="mt-4 font-display text-3xl text-[#1F2937] sm:text-4xl lg:text-5xl">Spaces shaped for your story</h2>
            </motion.div>
            {/*
              Responsive grid:
              - Mobile:  1 column
              - Tablet:  2 columns
              - Desktop: 3 columns
            */}
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={VP} className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
              {spaces.map(({ title, capacity, bestFor, image }) => (
                <motion.div key={title} variants={cardEntry} className="group relative overflow-hidden rounded-[24px] sm:rounded-[28px]">
                  <div className="relative h-[360px] overflow-hidden rounded-[24px] border border-[#E7E1D5] shadow-[0_16px_32px_rgba(17,24,39,0.06)] sm:h-[400px] sm:rounded-[28px] lg:h-[420px]">
                    <Image src={image} alt={title} width={900} height={1200} className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-106" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1712]/78 via-[#0d1712]/14 to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                    <p className="text-xs uppercase tracking-[0.26em] text-[#E7E0D0]">{capacity}</p>
                    <h3 className="mt-2 font-display text-2xl text-white sm:text-3xl">{title}</h3>
                    <p className="mt-1.5 text-xs text-[#F2EBDC] sm:text-sm">Best for: {bestFor}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            GALLERY
            ════════════════════════════════════════════════════════════════════ */}
        <section id="gallery" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP} className="mb-8 flex flex-col gap-5 sm:mb-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="section-kicker">Gallery</p>
              <h2 className="mt-4 font-display text-3xl text-[#1F2937] sm:text-4xl lg:text-5xl">Moments captured in nature</h2>
            </div>
            {/* Filter pills — wrap on mobile, single row on larger screens */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button key={cat} type="button"
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 sm:px-4 sm:py-2 sm:text-sm ${activeCategory === cat ? "border-[#1F5E3B] bg-[#1F5E3B] text-white shadow-[0_3px_10px_rgba(31,94,59,0.25)]" : "border-[#E5E7EB] bg-white text-[#374151] hover:border-[#C7DCCB] hover:bg-[#F4FAF6]"}`}
                  onClick={() => setActiveCategory(cat)}>
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/*
            Masonry-style columns:
            - Mobile:  1 column
            - Small:   2 columns
            - Desktop: 4 columns
          */}
          <div className="columns-1 gap-4 sm:columns-2 sm:gap-5 xl:columns-4">
            <AnimatePresence>
              {filteredGallery.map((item, idx) => (
                <motion.button key={`${item.src}-${idx}`}
                  initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.92 }}
                  transition={{ duration:0.32, ease:EASE }}
                  type="button" aria-label={`View photo: ${item.alt}`}
                  className="group mb-4 block w-full overflow-hidden rounded-[20px] text-left shadow-[0_8px_20px_rgba(17,24,39,0.07)] transition-shadow duration-300 hover:shadow-[0_14px_36px_rgba(17,24,39,0.12)] sm:mb-5 sm:rounded-[24px]"
                  onClick={() => setSelectedImage(idx)}>
                  <div className="overflow-hidden rounded-[20px] sm:rounded-[24px]">
                    <Image src={item.src} alt={item.alt} width={900} height={item.aspect === "portrait" ? 1200 : 700} className="w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}
              className="fixed inset-0 z-[60] flex items-end justify-center bg-[#0f1720]/86 px-0 backdrop-blur-md sm:items-center sm:px-4"
              onClick={() => setSelectedImage(null)}>
              <motion.div initial={{ scale:0.94, opacity:0, y:24 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.96, opacity:0, y:12 }} transition={{ duration:0.25, ease:EASE }}
                className="relative w-full max-w-5xl rounded-t-[24px] border border-white/20 bg-[#FAF8F3] p-2.5 shadow-[0_28px_72px_rgba(15,23,42,0.4)] sm:rounded-[28px] sm:p-3"
                onClick={(e) => e.stopPropagation()}>
                {/* Close */}
                <button type="button" aria-label="Close" onClick={() => setSelectedImage(null)}
                  className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#1F2937] shadow-sm transition-all duration-200 hover:bg-white active:scale-90 sm:h-10 sm:w-10">
                  <X size={17} />
                </button>
                <div className="overflow-hidden rounded-[18px] sm:rounded-[22px]">
                  <Image src={filteredGallery[selectedImage].src} alt={filteredGallery[selectedImage].alt} width={1600} height={1100} className="max-h-[60vh] w-full object-cover sm:max-h-[75vh]" />
                </div>
                <div className="mt-3 flex items-center justify-between gap-4 px-2 pb-1.5 sm:mt-4 sm:pb-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#4C7A57]">{filteredGallery[selectedImage].category}</p>
                    <p className="mt-1 text-sm text-[#374151]">{filteredGallery[selectedImage].alt}</p>
                  </div>
                  <div className="flex gap-2">
                    {[{ label:"Previous", dir:-1, Icon:ChevronRight, cls:"rotate-180", disabled:selectedImage===0 },
                      { label:"Next",     dir: 1, Icon:ChevronRight, cls:"",           disabled:selectedImage===filteredGallery.length-1 }
                    ].map(({ label, dir, Icon:Ic, cls, disabled }) => (
                      <button key={label} type="button" aria-label={label} disabled={disabled}
                        onClick={() => setSelectedImage((c) => c === null ? 0 : Math.max(0, Math.min(filteredGallery.length-1, c+dir)))}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#1F2937] transition-all hover:bg-[#F4FAF6] active:scale-90 disabled:opacity-35 sm:h-10 sm:w-10">
                        <Ic size={15} className={cls} />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ════════════════════════════════════════════════════════════════════
            PACKAGES
            ════════════════════════════════════════════════════════════════════ */}
        <section id="packages" className="bg-[#F3EFE7] py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP} className="mb-10 max-w-2xl sm:mb-14">
              <p className="section-kicker">Packages</p>
              <h2 className="mt-4 font-display text-3xl text-[#1F2937] sm:text-4xl lg:text-5xl">Flexible packages for every occasion</h2>
            </motion.div>
            {/*
              Packages grid:
              - Mobile:  1 column (full-width stacked)
              - sm:      2 columns
              - lg:      3 columns
              - xl:      5 columns (one per package)
            */}
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={VP} className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-5">
              {pricing.map((item) => (
                <motion.div key={item.name} variants={cardEntry}
                  whileHover={{ y:-5, transition:{ duration:0.3, ease:EASE } }}
                  className={`flex flex-col rounded-[22px] border bg-white p-5 shadow-[0_8px_24px_rgba(17,24,39,0.06)] transition-shadow duration-300 hover:shadow-[0_18px_44px_rgba(17,24,39,0.1)] sm:rounded-[26px] sm:p-6 ${item.featured ? "border-[#C8A951] ring-1 ring-[#C8A951]" : "border-[#E5E7EB]"}`}>
                  {item.featured && (
                    <div className="mb-3 inline-flex rounded-full bg-[#F5F0E4] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7A6421]">Most loved</div>
                  )}
                  <h3 className="text-lg font-semibold text-[#1F2937] sm:text-xl">{item.name}</h3>
                  <div className="mt-4 text-2xl font-semibold text-[#1F2937] sm:text-3xl">{item.price}</div>
                  <div className="mt-3 space-y-1 text-xs text-[#4B5563] sm:text-sm">
                    <p>{item.duration}</p><p>{item.guests}</p>
                  </div>
                  <ul className="mt-5 flex-1 space-y-2.5 text-xs text-[#4B5563] sm:text-sm">
                    {item.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <span className="inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#EAF3EE] text-[#1F5E3B] sm:h-5 sm:w-5"><Check size={11} /></span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="#booking" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1F5E3B] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#174a31] hover:shadow-[0_6px_16px_rgba(31,94,59,0.28)] active:scale-95 sm:mt-8 sm:py-3">
                    Book Package <ArrowRight size={14} />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            BOOKING
            ════════════════════════════════════════════════════════════════════ */}
        <section id="booking" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">

            {/* Booking image panel */}
            <motion.div variants={slideLeft} initial="hidden" whileInView="visible" viewport={VP}
              className="relative overflow-hidden rounded-[28px] shadow-[0_24px_60px_rgba(17,24,39,0.09)] sm:rounded-[32px]">
              <Image src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80" alt="Warm garden event reception" width={1200} height={1400} className="h-[320px] w-full object-cover sm:h-[480px] lg:h-full lg:min-h-[650px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1712]/62 via-[#0d1712]/15 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-[#f6efe7]">Reserve your date</p>
                <h2 className="mt-2 font-display text-3xl sm:mt-3 sm:text-4xl lg:text-5xl">Book a timeless garden moment</h2>
              </div>
            </motion.div>

            {/* Booking form */}
            <motion.div variants={slideRight} initial="hidden" whileInView="visible" viewport={VP}
              className="rounded-[26px] border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_46px_rgba(17,24,39,0.06)] sm:rounded-[30px] sm:p-8">
              {!isSubmitted ? (
                <>
                  <p className="section-kicker">Booking</p>
                  <h3 className="mt-4 font-display text-3xl text-[#1F2937] sm:text-4xl">Tell us about your event</h3>
                  <form onSubmit={handleSubmit(onSubmit as any)} className="mt-7 space-y-5" noValidate>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Full Name" htmlFor="fullName" error={errors.fullName?.message}>
                        <input id="fullName" {...register("fullName")} aria-invalid={!!errors.fullName} className={inputCls} placeholder="Your name" />
                      </Field>
                      <Field label="Phone Number" htmlFor="phone" error={errors.phone?.message}>
                        <input id="phone" {...register("phone")} aria-invalid={!!errors.phone} className={inputCls} placeholder="+254 ..." />
                      </Field>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Email Address" htmlFor="email" error={errors.email?.message}>
                        <input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} className={inputCls} placeholder="you@example.com" />
                      </Field>
                      <Field label="Event Type" htmlFor="eventType" error={errors.eventType?.message}>
                        <select id="eventType" {...register("eventType")} aria-invalid={!!errors.eventType} className={inputCls}>
                          <option value="">Select event type</option>
                          {["Birthday","Meeting","Picnic","Camping","Photoshoot","Private Event"].map((v) => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </Field>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Package" htmlFor="package" error={errors.package?.message}>
                        <select id="package" {...register("package")} aria-invalid={!!errors.package} className={inputCls}>
                          <option value="">Select package</option>
                          {["Birthday Package","Meeting Package","Picnic Package","Camping Package","Photoshoot Package"].map((v) => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </Field>
                      <Field label="Number of Guests" htmlFor="guests" error={errors.guests?.message}>
                        <input id="guests" type="number" min={1} {...register("guests",{valueAsNumber:true})} aria-invalid={!!errors.guests} className={inputCls} placeholder="30" />
                      </Field>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Preferred Date" htmlFor="date" error={errors.date?.message}>
                        <input id="date" type="date" {...register("date")} aria-invalid={!!errors.date} className={inputCls} />
                      </Field>
                      <Field label="Preferred Time" htmlFor="time" error={errors.time?.message}>
                        <input id="time" type="time" {...register("time")} aria-invalid={!!errors.time} className={inputCls} />
                      </Field>
                    </div>
                    <div>
                      <label htmlFor="specialRequests" className="mb-2 block text-sm font-medium text-[#374151]">Special Requests</label>
                      <textarea id="specialRequests" {...register("specialRequests")} rows={4} className={inputCls} placeholder="Tell us about your ideal setup, theme, or timing" />
                    </div>
                    <fieldset className="space-y-3 text-sm text-[#374151]">
                      <legend className="sr-only">Add-on services</legend>
                      {[["decorations","Need Decorations"],["catering","Need Catering"],["photography","Need Photography"]] .map(([name,label]) => (
                        <label key={name} className="flex cursor-pointer items-center gap-3">
                          <input type="checkbox" {...register(name as any)} className="h-4 w-4 rounded border-[#D1D5DB] text-[#1F5E3B] focus:ring-[#1F5E3B]" />
                          {label}
                        </label>
                      ))}
                    </fieldset>
                    <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1F5E3B] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(31,94,59,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#174a31] hover:shadow-[0_8px_22px_rgba(31,94,59,0.32)] active:scale-95">
                      Reserve My Date <ArrowRight size={15} />
                    </button>
                  </form>
                </>
              ) : (
                <motion.div initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.4, ease:EASE }}
                  className="rounded-[24px] border border-[#E5E7EB] bg-[#F9F7F2] p-6 text-center shadow-[0_14px_28px_rgba(17,24,39,0.04)]">
                  <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ duration:0.4, ease:[0.34,1.56,0.64,1], delay:0.15 }}
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF3EE] text-[#1F5E3B] sm:h-16 sm:w-16">
                    <Check size={26} />
                  </motion.div>
                  <h3 className="mt-5 font-display text-3xl text-[#1F2937] sm:mt-6 sm:text-4xl">Booking submitted</h3>
                  <p className="mt-3 text-sm text-[#4B5563] sm:mt-4 sm:text-base">Your request has been received. Our team will confirm availability shortly.</p>
                  <div className="mt-5 rounded-2xl bg-white p-4 text-left shadow-sm sm:mt-6">
                    <p className="text-[10px] uppercase tracking-[0.26em] text-[#6B7280]">Reference</p>
                    <p className="mt-2 text-xl font-semibold text-[#1F2937] sm:text-2xl">{bookingRef}</p>
                  </div>
                  <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
                    <Link href="https://wa.me/254757692495" target="_blank" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1F5E3B] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#174a31] active:scale-95">
                      <MessageCircle size={15} /> WhatsApp Confirmation
                    </Link>
                    <Link href="#home" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-semibold text-[#1F2937] transition-all hover:border-[#C7DCCB] active:scale-95">
                      Back Home
                    </Link>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            AVAILABILITY CALENDAR
            ════════════════════════════════════════════════════════════════════ */}
        <section className="bg-[#F6F1E8] py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP} className="mb-8 flex items-center gap-3 sm:mb-10">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#EAF3EE] text-[#1F5E3B] sm:h-12 sm:w-12"><CalendarDays size={21} /></div>
              <h3 className="font-display text-3xl text-[#1F2937] sm:text-4xl">Availability calendar</h3>
            </motion.div>
            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={VP}
              className="rounded-[24px] border border-[#E5E7EB] bg-white p-4 shadow-[0_16px_32px_rgba(17,24,39,0.04)] sm:rounded-[28px] sm:p-6">

              {/* Month navigation — only current and next month allowed */}
              <div className="mb-5 flex items-center justify-between sm:mb-6">
                <button
                  type="button"
                  aria-label="Previous month"
                  disabled={calendarOffset === 0}
                  onClick={() => setCalendarOffset(0)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#FAF8F3] text-[#1F2937] transition-all hover:border-[#C7DCCB] disabled:cursor-not-allowed disabled:opacity-30 sm:h-10 sm:w-10"
                >
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <div className="text-center">
                  <p className="text-base font-semibold text-[#1F2937] sm:text-lg">
                    {new Date(calendarYear, calendarMonth).toLocaleString("default", { month: "long", year: "numeric" })}
                  </p>
                  <div className="mt-1.5 flex justify-center gap-2">
                    {[0, 1].map((offset) => (
                      <button
                        key={offset}
                        type="button"
                        onClick={() => setCalendarOffset(offset)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${calendarOffset === offset ? "w-6 bg-[#1F5E3B]" : "w-1.5 bg-[#D1D5DB] hover:bg-[#A7C4AE]"}`}
                        aria-label={offset === 0 ? "Current month" : "Next month"}
                      />
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Next month"
                  disabled={calendarOffset === 1}
                  onClick={() => setCalendarOffset(1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#FAF8F3] text-[#1F2937] transition-all hover:border-[#C7DCCB] disabled:cursor-not-allowed disabled:opacity-30 sm:h-10 sm:w-10"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
                  <div key={d} className="pb-2 text-center text-[9px] font-medium uppercase tracking-[0.18em] text-[#6B7280] sm:text-xs sm:tracking-[0.22em]">{d}</div>
                ))}
              </div>

              {/* Date cells — correctly offset by weekday */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {/* Empty cells before the 1st of the month */}
                {Array.from({ length: calendarStartOffset }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {/* Day cells */}
                {Array.from({ length: calendarDaysInMonth }, (_, i) => {
                  const day = i + 1;
                  const isToday = calendarOffset === 0 && day === today.getDate();
                  /* Simple demo pattern: past days = unavailable, today = available,
                     future days alternate available / pending */
                  let status: "available" | "pending" | "unavailable";
                  if (calendarOffset === 0 && day < today.getDate()) {
                    status = "unavailable";
                  } else if ((day % 5 === 0) || (day % 7 === 0)) {
                    status = "pending";
                  } else {
                    status = "available";
                  }
                  return (
                    <div
                      key={day}
                      className={`relative flex h-9 items-center justify-center rounded-xl border text-xs font-medium transition-all duration-200 sm:h-12 sm:rounded-2xl sm:text-sm ${
                        status === "available"
                          ? "border-[#C7DCCB] bg-[#EAF3EE] text-[#1F5E3B]"
                          : status === "pending"
                          ? "border-[#E8D9A1] bg-[#F8F1DE] text-[#8A6B17]"
                          : "border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF]"
                      } ${isToday ? "ring-2 ring-[#1F5E3B] ring-offset-1" : ""}`}
                    >
                      {day}
                      {isToday && (
                        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#1F5E3B] sm:h-2.5 sm:w-2.5" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap gap-3 text-xs text-[#4B5563] sm:mt-6 sm:gap-4 sm:text-sm">
                {[["#EAF3EE","Available"],["#F8F1DE","Pending"],["#F3F4F6","Unavailable"]].map(([color,label]) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3" style={{ background: color }} />
                    {label}
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full ring-2 ring-[#1F5E3B] sm:h-3 sm:w-3" />
                  Today
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            TESTIMONIALS
            ════════════════════════════════════════════════════════════════════ */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP} className="mb-10 max-w-2xl sm:mb-12">
            <p className="section-kicker">Testimonials</p>
            <h2 className="mt-4 font-display text-3xl text-[#1F2937] sm:text-4xl lg:text-5xl">Loved by those who gathered here</h2>
          </motion.div>
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={VP}
            className="rounded-[26px] border border-[#E5E7EB] bg-white p-5 shadow-[0_16px_36px_rgba(17,24,39,0.05)] sm:rounded-[30px] sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-8">
              {/* Photo — hidden on very small screens to save space */}
              <div className="hidden overflow-hidden rounded-[22px] sm:block sm:rounded-[26px]">
                <AnimatePresence mode="wait">
                  <motion.div key={testimonialIdx} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.45 }}>
                    <Image src={testimonials[testimonialIdx].image} alt={testimonials[testimonialIdx].name} width={700} height={900} className="h-[320px] w-full object-cover lg:h-[420px]" />
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* Quote */}
              <div>
                <div className="flex gap-1 text-[#C8A951]">
                  {Array.from({length:5}).map((_,i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={testimonialIdx} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:0.35 }}>
                    <p className="mt-5 text-xl leading-9 text-[#1F2937] sm:mt-6 sm:text-2xl lg:text-3xl lg:leading-10">"{testimonials[testimonialIdx].quote}"</p>
                    <div className="mt-6 border-t border-[#E5E7EB] pt-5 sm:mt-8 sm:pt-6">
                      <p className="text-lg font-semibold text-[#1F2937] sm:text-xl">{testimonials[testimonialIdx].name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#6B7280] sm:text-sm">{testimonials[testimonialIdx].event}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
                <div className="mt-6 flex items-center gap-3 sm:mt-8">
                  <button type="button" aria-label="Previous testimonial"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#FAF8F3] text-[#1F2937] transition-all hover:border-[#C7DCCB] active:scale-90 sm:h-11 sm:w-11"
                    onClick={() => setTestimonialIdx((c) => (c - 1 + testimonials.length) % testimonials.length)}>
                    <ChevronRight size={17} className="rotate-180" />
                  </button>
                  <button type="button" aria-label="Next testimonial"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#FAF8F3] text-[#1F2937] transition-all hover:border-[#C7DCCB] active:scale-90 sm:h-11 sm:w-11"
                    onClick={() => setTestimonialIdx((c) => (c + 1) % testimonials.length)}>
                    <ChevronRight size={17} />
                  </button>
                  {/* Dot indicators */}
                  <div className="ml-2 flex gap-1.5">
                    {testimonials.map((_,i) => (
                      <button key={i} type="button" aria-label={`Go to testimonial ${i+1}`}
                        onClick={() => setTestimonialIdx(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === testimonialIdx ? "w-6 bg-[#1F5E3B]" : "w-1.5 bg-[#D1D5DB] hover:bg-[#A7C4AE]"}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            FAQ
            ════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-5xl lg:px-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP} className="mb-8 max-w-2xl sm:mb-10">
              <p className="section-kicker">FAQ</p>
              <h2 className="mt-4 font-display text-3xl text-[#1F2937] sm:text-4xl lg:text-5xl">Common questions from guests</h2>
            </motion.div>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={VP} className="space-y-3 sm:space-y-4">
              {faqItems.map((item, index) => {
                const isOpen = expandedFaq === index;
                return (
                  <motion.div key={item.question} variants={cardEntry} className="overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-[#FAF8F3] sm:rounded-[24px]">
                    <button type="button" className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5 sm:py-5"
                      onClick={() => setExpandedFaq(isOpen ? null : index)} aria-expanded={isOpen}>
                      <span className="text-base font-medium text-[#1F2937] sm:text-lg">{item.question}</span>
                      <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.22 }}
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#1F5E3B] sm:h-8 sm:w-8">
                        <Plus size={15} />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.28, ease:EASE }} className="overflow-hidden">
                          <p className="px-4 pb-4 text-sm leading-7 text-[#4B5563] sm:px-5 sm:pb-5 sm:text-base">{item.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            CONTACT
            ════════════════════════════════════════════════════════════════════ */}
        <section id="contact" className="bg-[#F2EFE8] py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={VP} className="mb-10 max-w-2xl sm:mb-12">
              <p className="section-kicker">Contact</p>
              <h2 className="mt-4 font-display text-3xl text-[#1F2937] sm:text-4xl lg:text-5xl">Plan your next meaningful gathering</h2>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              {/* Contact details card */}
              <motion.div variants={slideLeft} initial="hidden" whileInView="visible" viewport={VP}
                className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_14px_28px_rgba(17,24,39,0.05)] sm:rounded-[28px] sm:p-8">

                <div className="space-y-4 text-[#374151] sm:space-y-5">
                  {[
                    { Icon: Phone,         label: "Phone",           content: <a href="tel:+254757692495" className="mt-1 text-base font-medium text-[#1F2937] transition-colors hover:text-[#1F5E3B] sm:text-lg">0757 692 495</a> },
                    { Icon: MessageCircle, label: "WhatsApp",        content: <a href="https://wa.me/254757692495" target="_blank" rel="noreferrer" className="mt-1 text-base font-medium text-[#1F2937] transition-colors hover:text-[#1F5E3B] sm:text-lg">Chat with us</a> },
                    { Icon: Mail,          label: "Email",           content: <a href="mailto:hello@berakhahgardens.co.ke" className="mt-1 break-all text-base font-medium text-[#1F2937] transition-colors hover:text-[#1F5E3B] sm:text-lg">hello@berakhahgardens.co.ke</a> },
                    { Icon: MapPin,        label: "Location",        content: <p className="mt-1 text-base font-medium text-[#1F2937] sm:text-lg">Nanyuki, Laikipia County, Kenya</p> },
                    { Icon: Clock,         label: "Operating hours", content: <p className="mt-1 text-base font-medium text-[#1F2937] sm:text-lg">Mon – Sun: 8:00 AM – 8:00 PM</p> },
                  ].map(({ Icon, label, content }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#EAF3EE] text-[#1F5E3B] sm:h-11 sm:w-11">
                        <Icon size={17} />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-[#6B7280]">{label}</p>
                        {content}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap gap-3 sm:mt-8">
                  <a href="tel:+254757692495"
                    className="inline-flex items-center gap-2 rounded-full bg-[#1F5E3B] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(31,94,59,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#174a31] active:scale-95 sm:px-5 sm:py-3">
                    <Phone size={15} /> Call Now
                  </a>
                  <a href="https://wa.me/254757692495" target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#1F2937] transition-all duration-300 hover:border-[#C7DCCB] hover:bg-[#F4FAF6] active:scale-95 sm:px-5 sm:py-3">
                    <MessageCircle size={15} /> WhatsApp
                  </a>
                  <a href="https://maps.google.com/?q=Nanyuki+Kenya" target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#1F2937] transition-all duration-300 hover:border-[#C7DCCB] hover:bg-[#F4FAF6] active:scale-95 sm:px-5 sm:py-3">
                    <MapPin size={15} /> Get Directions
                  </a>
                </div>
              </motion.div>

              {/* Map */}
              <motion.div variants={slideRight} initial="hidden" whileInView="visible" viewport={VP}
                className="min-h-[300px] overflow-hidden rounded-[24px] border border-[#E5E7EB] bg-white shadow-[0_14px_28px_rgba(17,24,39,0.05)] sm:min-h-[400px] sm:rounded-[28px] lg:min-h-0">
                <iframe
                  title="Berakhah Gardens Nanyuki map"
                  src="https://www.google.com/maps?q=Nanyuki+Kenya&output=embed"
                  className="h-full min-h-[300px] w-full border-0 sm:min-h-[400px] lg:min-h-[560px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </motion.div>
            </div>
          </div>
        </section>

      </main>

      {/* ════════════════════════════════════════════════════════════════════
          FOOTER
          ════════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-[#E5E7EB] bg-[#FAF8F3]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">

          {/* 4-column grid → 2-col on tablet → stacked on mobile */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-10">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D7D3C7] bg-white text-[#1F5E3B] sm:h-10 sm:w-10">
                  <TreePine size={17} />
                </div>
                <div>
                  <p className="font-display text-lg text-[#1F2937] sm:text-xl">Berakhah</p>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#6B7280]">Gardens Nanyuki</p>
                </div>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-7 text-[#6B7280] sm:text-base">
                A hidden gem for meaningful celebrations, natural gatherings, and outdoor experiences in Nanyuki.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#6B7280]">Quick links</p>
              <ul className="mt-4 space-y-2.5 text-sm text-[#374151] sm:space-y-3 sm:text-base">
                {[["About","#about"],["Experiences","#experiences"],["Gallery","#gallery"],["Booking","#booking"]].map(([label,href]) => (
                  <li key={label}>
                    <Link href={href} className="transition-colors hover:text-[#1F5E3B]">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#6B7280]">Contact</p>
              <ul className="mt-4 space-y-2.5 text-sm text-[#374151] sm:space-y-3 sm:text-base">
                <li><a href="tel:+254757692495" className="transition-colors hover:text-[#1F5E3B]">0757 692 495</a></li>
                <li><a href="mailto:hello@berakhahgardens.co.ke" className="transition-colors hover:text-[#1F5E3B]">Email us</a></li>
                <li><a href="https://wa.me/254757692495" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#1F5E3B]">WhatsApp</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#6B7280]">Newsletter</p>
              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
                <input
                  type="email"
                  placeholder="Email address"
                  aria-label="Newsletter email address"
                  className="w-full rounded-full border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#1F2937] outline-none transition-all focus:border-[#1F5E3B] focus:ring-2 focus:ring-[#1F5E3B]/10 placeholder:text-[#9CA3AF]"
                />
                <button
                  type="button"
                  className="flex-shrink-0 rounded-full bg-[#1F5E3B] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#174a31] active:scale-95">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 flex flex-col gap-3 border-t border-[#E5E7EB] pt-6 text-xs text-[#6B7280] sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
            <p>© 2026 Berakhah Gardens Nanyuki. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {[["Facebook","https://www.facebook.com"],["Instagram","https://www.instagram.com"],["TikTok","https://www.tiktok.com"]].map(([name,href]) => (
                <a key={name} href={href} target="_blank" rel="noreferrer" aria-label={name}
                  className="transition-colors hover:text-[#1F5E3B]">{name}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
