"use client";

import { AnimatePresence, motion } from "framer-motion";
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

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experiences", href: "#experiences" },
  { label: "Gallery", href: "#gallery" },
  { label: "Packages", href: "#packages" },
  { label: "Booking", href: "#booking" },
  { label: "Contact", href: "#contact" },
];

const statCards = [
  { value: 12, suffix: "+", label: "Garden spaces", icon: TreePine },
  { value: 365, suffix: "/yr", label: "Event-ready days", icon: CalendarDays },
  { value: 2500, suffix: "+", label: "Guests hosted", icon: Users },
  { value: 180, suffix: "+", label: "Photo moments", icon: Camera },
];

const features = [
  {
    icon: Leaf,
    title: "Naturally serene",
    description: "Shaded lawns, fresh air, and greenery that create a calming backdrop for every gathering.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted hosting",
    description: "A reliable venue experience with thoughtful support from setup to event closeout.",
  },
  {
    icon: Car,
    title: "Easy access",
    description: "Convenient arrival for guests, with comfortable parking and a simple flow from gate to garden.",
  },
  {
    icon: MapPin,
    title: "Nanyuki location",
    description: "Set in the beauty of Nanyuki, just far enough to feel private and peaceful.",
  },
  {
    icon: Tent,
    title: "Flexible setups",
    description: "From relaxed picnics to full event production, our spaces adapt to your celebration style.",
  },
  {
    icon: Sparkles,
    title: "Thoughtful details",
    description: "Decor choices, curated ambience, and warm hospitality are designed to feel personal and premium.",
  },
];

const experiences = [
  {
    title: "Birthday Celebrations",
    icon: Sparkles,
    description:
      "Celebrate with music, garden dining, and a joyful atmosphere made for memorable birthdays and family gatherings.",
    bullets: ["Decor-ready lawn", "Custom setup", "Ambience lighting"],
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
    alt: "Birthday celebration at a garden venue",
  },
  {
    title: "Meetings & Workshops",
    icon: ShieldCheck,
    description:
      "Professional yet calming spaces that feel productive, welcoming, and visually inspiring for meaningful sessions.",
    bullets: ["Boardroom setup", "Quiet campus feel", "Reliable power access"],
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
    alt: "Business meeting in an outdoor event venue",
  },
  {
    title: "Team Building",
    icon: Users,
    description:
      "Encourage connection through outdoor games, relaxed interaction, and a natural setting that energizes teams.",
    bullets: ["Open-air activities", "Flexible layouts", "Group-focused flow"],
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
    alt: "Team bonding and outdoor activity in a garden",
  },
  {
    title: "Family Picnics",
    icon: Leaf,
    description:
      "Slow afternoons under the trees with curated picnic spaces, blanket-friendly layouts, and room to connect.",
    bullets: ["Shade and seating", "Picnic-ready spaces", "Easy family flow"],
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
    alt: "Family picnic in a scenic garden",
  },
  {
    title: "Photoshoots",
    icon: Camera,
    description:
      "Beautiful natural backdrops, open light, and lush textures designed to elevate portraits and brand imagery.",
    bullets: ["Natural light", "Scenic corners", "Versatile backdrops"],
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    alt: "Photoshoot setup in a lush outdoor garden",
  },
  {
    title: "Camping",
    icon: Tent,
    description:
      "A peaceful camp escape under the stars for small groups, retreats, and stargazing evenings in nature.",
    bullets: ["camping corner", "Evening ambience", "Nature rooted stay"],
    image:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80",
    alt: "Camping experience under the stars at a garden venue",
  },
];

const spaces = [
  {
    title: "Garden Lawn",
    capacity: "Up to 250 guests",
    bestFor: "Weddings, birthdays, open-air celebrations",
    image:
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Gazebo",
    capacity: "Up to 40 guests",
    bestFor: "Intimate gatherings and quiet events",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Picnic Area",
    capacity: "Up to 30 guests",
    bestFor: "Family days and relaxed social moments",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Meeting Pavilion",
    capacity: "Up to 60 guests",
    bestFor: "Workshops, trainings, and strategic sessions",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Camping Corner",
    capacity: "Up to 16 campers",
    bestFor: "Overnight nature retreats and team escapes",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Photo Spots",
    capacity: "Flexible styling",
    bestFor: "Content shoots and portrait sessions",
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
  },
];

const galleryItems = [
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
    alt: "Garden birthday celebration setup",
    category: "Birthdays",
    aspect: "portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    alt: "Open lawn garden view",
    category: "Garden Views",
    aspect: "landscape",
  },
  {
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
    alt: "Outdoor team building activity",
    category: "Meetings",
    aspect: "portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    alt: "Picnic area with friends and sunlight",
    category: "Picnics",
    aspect: "landscape",
  },
  {
    src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80",
    alt: "Garden lawn with event setup",
    category: "Birthdays",
    aspect: "landscape",
  },
  {
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
    alt: "Camping corner at dusk",
    category: "Camping",
    aspect: "portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    alt: "Stylish photo setup in the garden",
    category: "Photoshoots",
    aspect: "landscape",
  },
  {
    src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    alt: "Decorated gazebo in soft afternoon light",
    category: "Garden Views",
    aspect: "portrait",
  },
];

const pricing = [
  {
    name: "Birthday Package",
    price: "KSh 24,000",
    duration: "4 hours",
    guests: "Up to 80 guests",
    features: ["Garden lawn access", "Decor assistance", "Sound setup", "Guest seating"],
    featured: false,
  },
  {
    name: "Meeting Package",
    price: "KSh 18,500",
    duration: "3 hours",
    guests: "Up to 50 guests",
    features: ["Pavilion access", "Projector support", "Tea station", "Flexible seating"],
    featured: false,
  },
  {
    name: "Picnic Package",
    price: "KSh 12,000",
    duration: "2 hours",
    guests: "Up to 30 guests",
    features: ["Picnic setup", "Blanket area", "Refreshments", "Garden access"],
    featured: true,
  },
  {
    name: "Camping Package",
    price: "KSh 15,500",
    duration: "Overnight",
    guests: "Up to 16 guests",
    features: ["Camp setup", "Outdoor lighting", "Fire pit zone", "Nature experience"],
    featured: false,
  },
  {
    name: "Photoshoot Package",
    price: "KSh 10,800",
    duration: "90 minutes",
    guests: "Up to 10 people",
    features: ["Scenic spots", "Natural light", "Styling guidance", "Access to multiple corners"],
    featured: false,
  },
];

const testimonials = [
  {
    name: "Njeri W.",
    event: "Birthday celebration",
    quote:
      "The garden felt magical from the moment we arrived. The setting was calm, beautiful, and perfect for our family’s celebration.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Michael K.",
    event: "Team building day",
    quote:
      "We wanted a venue that felt productive but still relaxed. Berakhah delivered exactly that, and our team loved every minute.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Amina S.",
    event: "Photoshoot session",
    quote:
      "The light, the greenery, and the natural flow of the venue made our shoot feel effortless and premium without being staged.",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=80",
  },
];

const faqItems = [
  {
    question: "How do I book?",
    answer:
      "You can reserve your date by completing the booking form on this page or reaching out via WhatsApp. We usually confirm availability within 24 hours.",
  },
  {
    question: "Can I bring decorations?",
    answer:
      "Yes, with prior approval, you may bring selected decorations. We can also recommend styling partners for a smoother setup.",
  },
  {
    question: "Is parking available?",
    answer:
      "Yes, guest parking is available on site and arranged for convenience during your event.",
  },
  {
    question: "Do you offer catering?",
    answer:
      "We can coordinate food and refreshment arrangements through trusted partners or work with your preferred caterer.",
  },
  {
    question: "Do you allow overnight camping?",
    answer:
      "Yes, camping remains available for designated packages and small group stays with prior arrangement.",
  },
  {
    question: "What happens after submitting a booking?",
    answer:
      "After submission, we review the request, confirm the date and package, and send your reservation details and WhatsApp confirmation.",
  },
];

type BookingForm = {
  fullName: string;
  phone: string;
  email: string;
  eventType: string;
  package: string;
  guests: number;
  date: string;
  time: string;
  specialRequests?: string;
  decorations?: boolean;
  catering?: boolean;
  photography?: boolean;
};

const bookingSchema: z.ZodType<BookingForm> = z.object({
  fullName: z.string().min(2, "Please enter your full name."),
  phone: z.string().min(8, "Please enter a valid phone number."),
  email: z.string().email("Please enter a valid email address."),
  eventType: z.string().min(1, "Please choose an event type."),
  package: z.string().min(1, "Please select a package."),
  guests: z.coerce.number().min(1, "Guest count must be at least 1."),
  date: z.string().min(1, "Please choose a preferred date."),
  time: z.string().min(1, "Please choose a preferred time."),
  specialRequests: z.string().optional(),
  decorations: z.boolean().optional(),
  catering: z.boolean().optional(),
  photography: z.boolean().optional(),
});

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [bookingReference, setBookingReference] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    "All",
    ...new Set(galleryItems.map((item) => item.category)),
  ];

  const filteredGallery = useMemo(() => {
    if (activeCategory === "All") return galleryItems;
    return galleryItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema as any) as any,
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      eventType: "",
      package: "",
      guests: 1,
      date: "",
      time: "",
      specialRequests: "",
      decorations: false,
      catering: false,
      photography: false,
    },
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTestimonialIndex((current) => (current + 1) % testimonials.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedImage === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
        return;
      }

      if (event.key === "ArrowRight") {
        setSelectedImage((current) => {
          if (current === null) return 0;
          return Math.min(current + 1, filteredGallery.length - 1);
        });
      }

      if (event.key === "ArrowLeft") {
        setSelectedImage((current) => {
          if (current === null) return filteredGallery.length - 1;
          return Math.max(current - 1, 0);
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredGallery.length, selectedImage]);

  const onSubmit = async (values: BookingForm) => {
    const ref = `BG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setBookingReference(ref);
    setIsSubmitted(true);
    reset();

    try {
      // Send booking to backend API
      const response = await fetch('/api/send-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          bookingReference: ref,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Booking sent to WhatsApp successfully!', result.messageId);
      } else {
        console.log('⚠️ Booking saved but WhatsApp delivery status:', result.message);
      }
    } catch (error) {
      console.error('Error sending booking:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#1F2937]">
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#FAF8F3]/95 shadow-[0_10px_30px_rgba(17,24,39,0.08)] backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="#home" className="flex items-center gap-3" aria-label="Berakhah Gardens home">
            <Image
              src="/logo.png"
              alt="Berakhah Gardens Logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <div>
              <p className="font-display text-lg leading-none text-[#1F2937]">Berakhah</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#6B7280]">Gardens Nanyuki</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-[#1F2937] transition-colors hover:text-[#1F5E3B]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex">
            <Link
              href="#booking"
              className="inline-flex items-center gap-2 rounded-full bg-[#1F5E3B] px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#174a31]"
            >
              Book Now
              <ArrowRight size={16} />
            </Link>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB] bg-white/80 text-[#1F2937] shadow-sm lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="border-t border-[#E5E7EB] bg-[#FAF8F3] px-4 py-5 shadow-lg lg:hidden"
            >
              <nav aria-label="Mobile navigation" className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-base font-medium text-[#1F2937]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="#booking"
                  className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-[#1F5E3B] px-5 py-3 text-sm font-semibold text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Book Now
                  <ArrowRight size={16} />
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main id="home">
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
              alt="Scenic garden venue with lush greenery and open air seating"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#0d1a14]/40" />
          </div>

          <div className="relative mx-auto grid min-h-[780px] max-w-7xl items-center gap-10 px-4 pb-16 pt-20 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:pt-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-xl text-white"
            >
              <p className="mb-6 text-xs font-medium uppercase tracking-[0.32em] text-[#F7F3EB]">Berakhah Gardens</p>
              <h1 className="font-display text-5xl leading-none tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Nanyuki
              </h1>
              <p className="mt-5 max-w-lg text-lg text-[#F5F1EA] sm:text-xl">
                Hidden Gem for Birthdays, Meetings, Picnics and Outdoor Experiences.
              </p>
              <p className="mt-5 max-w-md text-base leading-7 text-[#efe7db]">
                A peaceful garden venue where thoughtful gatherings, fresh air, and natural beauty come together for celebrations that feel personal, premium, and unforgettable.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="#booking"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1F5E3B] px-6 py-3.5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#174a31]"
                >
                  Book Your Event
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="#gallery"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/8 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/12"
                >
                  View Gallery
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-4 text-[#F0E9DD]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/5">
                  <ChevronRight size={16} className="rotate-90" />
                </div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#F0E9DD]">Scroll to explore</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="relative flex justify-end"
            >
              <div className="relative w-full max-w-lg overflow-hidden rounded-[30px] border border-white/20 bg-white/10 p-3 shadow-[0_25px_60px_rgba(0,0,0,0.25)] backdrop-blur-sm">
                <div className="overflow-hidden rounded-[22px]">
                  <Image
                    src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=80"
                    alt="Outdoor event seating in a premium garden setting"
                    width={900}
                    height={1200}
                    className="h-[620px] w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 left-8 max-w-[230px] rounded-2xl bg-[#FAF8F3] p-4 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E7F1EA] text-[#1F5E3B]">
                      <Leaf size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#6B7280]">Outdoor Luxury</p>
                      <p className="text-lg font-semibold text-[#1F2937]">Peaceful gatherings</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              <div className="overflow-hidden rounded-[28px] shadow-[0_28px_70px_rgba(17,24,39,0.08)]">
                <Image
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80"
                  alt="Berakhah Gardens landscape and greenery in Nanyuki"
                  width={1200}
                  height={1400}
                  className="h-[620px] w-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-xl"
            >
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#4C7A57]">About us</p>
              <h2 className="mt-5 font-display text-4xl leading-tight text-[#1F2937] sm:text-5xl">
                A Place Where Nature Meets Celebration
              </h2>
              <p className="mt-6 text-lg leading-8 text-[#4B5563]">
                Berakhah Gardens Nanyuki was created to offer a place where people can gather freely, celebrate beautifully, and enjoy the warmth of outdoor luxury in a natural setting.
              </p>
              <p className="mt-4 text-base leading-7 text-[#6B7280]">
                Nestled in the calm beauty of Nanyuki, our garden offers a welcoming atmosphere for birthdays, meetings, family picnics, creative sessions, and private moments worth remembering. Every detail is designed to feel thoughtful, peaceful, and truly personal.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {statCards.map(({ value, suffix, label, icon: Icon }) => (
                  <div key={label} className="human-card rounded-[24px] p-5 transition-all duration-300 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="icon-tile h-11 w-11 rounded-2xl">
                        <Icon size={20} />
                      </div>
                    </div>
                    <div className="mt-5 text-3xl font-semibold text-[#1F2937]">
                      {value}
                      <span className="text-lg text-[#4C7A57]">{suffix}</span>
                    </div>
                    <p className="mt-2 text-sm text-[#6B7280]">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-12 max-w-2xl"
            >
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#4C7A57]">Why choose us</p>
              <h2 className="mt-4 font-display text-4xl text-[#1F2937] sm:text-5xl">A garden experience designed with care</h2>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {features.map(({ icon: Icon, title, description }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className={`human-card rounded-[26px] p-6 transition-all duration-300 ${
                    index % 2 === 1 ? "xl:translate-y-12" : ""
                  }`}
                >
                  <div className="icon-tile h-16 w-16 rounded-[20px]">
                    <Icon size={30} />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-[#1F2937]">{title}</h3>
                  <p className="mt-3 text-base leading-7 text-[#6B7280]">{description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="experiences" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#4C7A57]">Experiences</p>
            <h2 className="mt-4 font-display text-4xl text-[#1F2937] sm:text-5xl">Moments designed for every kind of gathering</h2>
          </div>

          <div className="space-y-12">
            {experiences.map(({ title, icon: Icon, description, bullets, image, alt }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="grid items-center gap-6 lg:grid-cols-2"
              >
                <div className={`${index % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}>
                  <div className="human-card overflow-hidden rounded-[30px] p-2">
                    <Image src={image} alt={alt} width={1200} height={900} className="h-[500px] w-full rounded-[24px] object-cover transition duration-700 hover:scale-105" />
                  </div>
                </div>

                <div className={`${index % 2 === 0 ? "lg:order-2" : "lg:order-1"} max-w-xl`}>
                  <div className="flex items-center gap-3">
                    <div className="icon-tile h-12 w-12 rounded-full">
                      <Icon size={22} />
                    </div>
                    <p className="section-kicker">Experience</p>
                  </div>
                  <h3 className="mt-5 font-display text-4xl text-[#1F2937] sm:text-[2.6rem]">{title}</h3>
                  <p className="mt-5 text-lg leading-8 text-[#4B5563]">{description}</p>
                  <ul className="mt-6 space-y-3 text-base text-[#374151]">
                    {bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-3">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#EAF3EE] text-[#1F5E3B]">
                          <Check size={14} />
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="#booking"
                    className="soft-button mt-8 inline-flex items-center gap-2 rounded-full bg-[#1F5E3B] px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#174a31]"
                  >
                    Book This Experience
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="spaces" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-12 max-w-2xl"
            >
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#4C7A57]">Featured spaces</p>
              <h2 className="mt-4 font-display text-4xl text-[#1F2937] sm:text-5xl">Spaces shaped for your story</h2>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {spaces.map(({ title, capacity, bestFor, image }) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="group relative overflow-hidden rounded-[28px]"
                >
                  <div className="relative h-[420px] overflow-hidden rounded-[28px] border border-[#E7E1D5] shadow-[0_20px_38px_rgba(17,24,39,0.05)]">
                    <Image src={image} alt={title} width={900} height={1200} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1712]/75 via-[#0d1712]/12 to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-xs uppercase tracking-[0.26em] text-[#E7E0D0]">{capacity}</p>
                    <h3 className="mt-3 font-display text-3xl text-white">{title}</h3>
                    <p className="mt-2 text-sm text-[#F2EBDC]">Best for: {bestFor}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="gallery" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#4C7A57]">Gallery</p>
              <h2 className="mt-4 font-display text-4xl text-[#1F2937] sm:text-5xl">Moments captured in nature</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? "border-[#1F5E3B] bg-[#1F5E3B] text-white"
                      : "border-[#E5E7EB] bg-white text-[#374151] hover:border-[#C7DCCB]"
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="columns-1 gap-5 sm:columns-2 xl:columns-4">
            {filteredGallery.map((item, index) => (
              <button
                key={`${item.category}-${index}`}
                type="button"
                aria-label={`Open photo in ${item.category}`}
                className="group mb-5 block w-full overflow-hidden rounded-[24px] text-left shadow-[0_18px_28px_rgba(17,24,39,0.06)]"
                onClick={() => setSelectedImage(index)}
              >
                <div className="overflow-hidden rounded-[24px]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={900}
                    height={item.aspect === "portrait" ? 1200 : 700}
                    className="w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
              </button>
            ))}
          </div>
        </section>

        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0f1720]/80 px-4 backdrop-blur-sm"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.98, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-5xl rounded-[28px] border border-white/20 bg-[#FAF8F3] p-3 shadow-[0_24px_60px_rgba(15,23,42,0.35)]"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  aria-label="Close gallery image"
                  className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1F2937]"
                  onClick={() => setSelectedImage(null)}
                >
                  <X size={18} />
                </button>
                <div className="overflow-hidden rounded-[20px]">
                  <Image
                    src={filteredGallery[selectedImage].src}
                    alt={filteredGallery[selectedImage].alt}
                    width={1600}
                    height={1100}
                    className="max-h-[75vh] w-full object-cover"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-4 px-2 pb-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#4C7A57]">{filteredGallery[selectedImage].category}</p>
                    <p className="mt-2 text-base text-[#374151]">{filteredGallery[selectedImage].alt}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      aria-label="Previous image"
                      onClick={() => setSelectedImage((current) => (current === null ? 0 : Math.max(current - 1, 0)))}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#1F2937]"
                    >
                      <ChevronRight size={16} className="rotate-180" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next image"
                      onClick={() => setSelectedImage((current) => (current === null ? 0 : Math.min(current + 1, filteredGallery.length - 1)))}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#1F2937]"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <section id="packages" className="bg-[#F3EFE7] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-12 max-w-2xl"
            >
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#4C7A57]">Packages</p>
              <h2 className="mt-4 font-display text-4xl text-[#1F2937] sm:text-5xl">Flexible packages for every occasion</h2>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-5">
              {pricing.map((item) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`rounded-[26px] border bg-white p-6 shadow-[0_18px_36px_rgba(17,24,39,0.05)] ${
                    item.featured ? "border-[#C8A951] ring-1 ring-[#C8A951]" : "border-[#E5E7EB]"
                  }`}
                >
                  {item.featured && (
                    <div className="mb-4 inline-flex rounded-full bg-[#F5F0E4] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7A6421]">
                      Most loved
                    </div>
                  )}
                  <h3 className="text-2xl font-semibold text-[#1F2937]">{item.name}</h3>
                  <div className="mt-5 text-3xl font-semibold text-[#1F2937]">{item.price}</div>
                  <div className="mt-4 space-y-3 text-sm text-[#4B5563]">
                    <p>{item.duration}</p>
                    <p>{item.guests}</p>
                  </div>
                  <ul className="mt-6 space-y-3 text-sm text-[#4B5563]">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#EAF3EE] text-[#1F5E3B]">
                          <Check size={12} />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="#booking"
                    className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1F5E3B] px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#174a31]"
                  >
                    Book Package
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="booking" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="relative overflow-hidden rounded-[32px] shadow-[0_28px_65px_rgba(17,24,39,0.08)]">
              <Image
                src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80"
                alt="Warm wedding and event reception in a garden setting"
                width={1200}
                height={1400}
                className="h-full min-h-[650px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1712]/60 via-[#0d1712]/15 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <p className="text-xs uppercase tracking-[0.2em] text-[#f6efe7]">Reserve your date</p>
                <h2 className="mt-3 font-display text-4xl sm:text-5xl">Book a timeless garden moment</h2>
              </div>
            </div>

            <div className="rounded-[30px] border border-[#E5E7EB] bg-white p-6 shadow-[0_20px_45px_rgba(17,24,39,0.05)] sm:p-8">
              {!isSubmitted ? (
                <>
                  <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#4C7A57]">Booking</p>
                  <h3 className="mt-4 font-display text-4xl text-[#1F2937]">Tell us about your event</h3>
                  <form onSubmit={handleSubmit(onSubmit as any)} className="mt-8 space-y-5" noValidate>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-[#374151]">Full Name</label>
                        <input id="fullName" {...register("fullName")} aria-invalid={Boolean(errors.fullName)} className="w-full rounded-2xl border border-[#E5E7EB] bg-[#FAF8F3] px-4 py-3 text-[#1F2937] outline-none transition focus:border-[#1F5E3B]" placeholder="Your name" />
                        {errors.fullName && <p className="mt-2 text-sm text-[#b91c1c]">{errors.fullName.message}</p>}
                      </div>

                      <div>
                        <label htmlFor="phone" className="mb-2 block text-sm font-medium text-[#374151]">Phone Number</label>
                        <input id="phone" {...register("phone")} aria-invalid={Boolean(errors.phone)} className="w-full rounded-2xl border border-[#E5E7EB] bg-[#FAF8F3] px-4 py-3 text-[#1F2937] outline-none transition focus:border-[#1F5E3B]" placeholder="+254 ..." />
                        {errors.phone && <p className="mt-2 text-sm text-[#b91c1c]">{errors.phone.message}</p>}
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#374151]">Email Address</label>
                        <input id="email" type="email" {...register("email")} aria-invalid={Boolean(errors.email)} className="w-full rounded-2xl border border-[#E5E7EB] bg-[#FAF8F3] px-4 py-3 text-[#1F2937] outline-none transition focus:border-[#1F5E3B]" placeholder="you@example.com" />
                        {errors.email && <p className="mt-2 text-sm text-[#b91c1c]">{errors.email.message}</p>}
                      </div>

                      <div>
                        <label htmlFor="eventType" className="mb-2 block text-sm font-medium text-[#374151]">Event Type</label>
                        <select id="eventType" {...register("eventType")} aria-invalid={Boolean(errors.eventType)} className="w-full rounded-2xl border border-[#E5E7EB] bg-[#FAF8F3] px-4 py-3 text-[#1F2937] outline-none transition focus:border-[#1F5E3B]">
                          <option value="">Select event type</option>
                          <option value="Birthday">Birthday</option>
                          <option value="Meeting">Meeting</option>
                          <option value="Picnic">Picnic</option>
                          <option value="Camping">Camping</option>
                          <option value="Photoshoot">Photoshoot</option>
                          <option value="Private Event">Private Event</option>
                        </select>
                        {errors.eventType && <p className="mt-2 text-sm text-[#b91c1c]">{errors.eventType.message}</p>}
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="package" className="mb-2 block text-sm font-medium text-[#374151]">Package</label>
                        <select id="package" {...register("package")} aria-invalid={Boolean(errors.package)} className="w-full rounded-2xl border border-[#E5E7EB] bg-[#FAF8F3] px-4 py-3 text-[#1F2937] outline-none transition focus:border-[#1F5E3B]">
                          <option value="">Select package</option>
                          <option value="Birthday Package">Birthday Package</option>
                          <option value="Meeting Package">Meeting Package</option>
                          <option value="Picnic Package">Picnic Package</option>
                          <option value="Camping Package">Camping Package</option>
                          <option value="Photoshoot Package">Photoshoot Package</option>
                        </select>
                        {errors.package && <p className="mt-2 text-sm text-[#b91c1c]">{errors.package.message}</p>}
                      </div>

                      <div>
                        <label htmlFor="guests" className="mb-2 block text-sm font-medium text-[#374151]">Number of Guests</label>
                        <input
                          id="guests"
                          type="number"
                          min={1}
                          {...register("guests", { valueAsNumber: true })}
                          aria-invalid={Boolean(errors.guests)}
                          className="w-full rounded-2xl border border-[#E5E7EB] bg-[#FAF8F3] px-4 py-3 text-[#1F2937] outline-none transition focus:border-[#1F5E3B]"
                          placeholder="30"
                        />
                        {errors.guests && <p className="mt-2 text-sm text-[#b91c1c]">{errors.guests.message}</p>}
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="date" className="mb-2 block text-sm font-medium text-[#374151]">Preferred Date</label>
                        <input id="date" type="date" {...register("date")} aria-invalid={Boolean(errors.date)} className="w-full rounded-2xl border border-[#E5E7EB] bg-[#FAF8F3] px-4 py-3 text-[#1F2937] outline-none transition focus:border-[#1F5E3B]" />
                        {errors.date && <p className="mt-2 text-sm text-[#b91c1c]">{errors.date.message}</p>}
                      </div>

                      <div>
                        <label htmlFor="time" className="mb-2 block text-sm font-medium text-[#374151]">Preferred Time</label>
                        <input id="time" type="time" {...register("time")} aria-invalid={Boolean(errors.time)} className="w-full rounded-2xl border border-[#E5E7EB] bg-[#FAF8F3] px-4 py-3 text-[#1F2937] outline-none transition focus:border-[#1F5E3B]" />
                        {errors.time && <p className="mt-2 text-sm text-[#b91c1c]">{errors.time.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="specialRequests" className="mb-2 block text-sm font-medium text-[#374151]">Special Requests</label>
                      <textarea id="specialRequests" {...register("specialRequests")} rows={4} className="w-full rounded-2xl border border-[#E5E7EB] bg-[#FAF8F3] px-4 py-3 text-[#1F2937] outline-none transition focus:border-[#1F5E3B]" placeholder="Tell us about your ideal setup, theme, or timing" />
                    </div>

                    <div className="space-y-3 text-sm text-[#374151]">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" {...register("decorations")} className="h-4 w-4 rounded border-[#D1D5DB] text-[#1F5E3B] focus:ring-[#1F5E3B]" />
                        Need Decorations
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" {...register("catering")} className="h-4 w-4 rounded border-[#D1D5DB] text-[#1F5E3B] focus:ring-[#1F5E3B]" />
                        Need Catering
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" {...register("photography")} className="h-4 w-4 rounded border-[#D1D5DB] text-[#1F5E3B] focus:ring-[#1F5E3B]" />
                        Need Photography
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1F5E3B] px-5 py-3.5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#174a31]"
                    >
                      Reserve My Date
                      <ArrowRight size={16} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="rounded-[24px] border border-[#E5E7EB] bg-[#F9F7F2] p-6 text-center shadow-[0_18px_32px_rgba(17,24,39,0.04)]">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3EE] text-[#1F5E3B]">
                    <Check size={28} />
                  </div>
                  <h3 className="mt-6 font-display text-4xl text-[#1F2937]">Booking submitted</h3>
                  <p className="mt-4 text-base text-[#4B5563]">Your request has been received and our team will confirm availability soon.</p>
                  <div className="mt-6 rounded-2xl bg-white p-4 text-left shadow-sm">
                    <p className="text-[10px] uppercase tracking-[0.26em] text-[#6B7280]">Reference</p>
                    <p className="mt-2 text-2xl font-semibold text-[#1F2937]">{bookingReference}</p>
                  </div>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link href="https://wa.me/254700000000" target="_blank" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1F5E3B] px-5 py-3 text-sm font-semibold text-white">
                      <MessageCircle size={16} />
                      WhatsApp Confirmation
                    </Link>
                    <Link href="#home" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-semibold text-[#1F2937]">
                      Back Home
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-[#F6F1E8] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF3EE] text-[#1F5E3B]">
                <CalendarDays size={22} />
              </div>
              <h3 className="font-display text-4xl text-[#1F2937]">Availability calendar</h3>
            </div>

            <div className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-[0_20px_35px_rgba(17,24,39,0.04)]">
              <div className="grid gap-3 sm:grid-cols-7">
                {[
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                  "Sun",
                ].map((day) => (
                  <div key={day} className="pb-2 text-center text-xs font-medium uppercase tracking-[0.22em] text-[#6B7280]">
                    {day}
                  </div>
                ))}

                {Array.from({ length: 35 }, (_, index) => {
                  const statuses = ["available", "pending", "unavailable"] as const;
                  const status = statuses[index % 3];
                  const date = index + 1;

                  return (
                    <div
                      key={date}
                      className={`flex h-14 items-center justify-center rounded-2xl border text-sm font-medium ${
                        status === "available"
                          ? "border-[#C7DCCB] bg-[#EAF3EE] text-[#1F5E3B]"
                          : status === "pending"
                            ? "border-[#E8D9A1] bg-[#F8F1DE] text-[#8A6B17]"
                            : "border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF]"
                      }`}
                    >
                      {date}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-[#4B5563]">
                <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#EAF3EE]" /> Available</div>
                <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#F8F1DE]" /> Pending</div>
                <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#F3F4F6]" /> Unavailable</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#4C7A57]">Testimonials</p>
            <h2 className="mt-4 font-display text-4xl text-[#1F2937] sm:text-5xl">Loved by those who gathered here</h2>
          </div>

          <div className="rounded-[30px] border border-[#E5E7EB] bg-white p-6 shadow-[0_20px_40px_rgba(17,24,39,0.05)] sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
              <div className="overflow-hidden rounded-[26px]">
                <Image
                  src={testimonials[testimonialIndex].image}
                  alt={testimonials[testimonialIndex].name}
                  width={700}
                  height={900}
                  className="h-[420px] w-full object-cover"
                />
              </div>

              <div>
                <div className="flex gap-1 text-[#C8A951]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={18} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-6 text-2xl leading-10 text-[#1F2937] sm:text-3xl">“{testimonials[testimonialIndex].quote}”</p>
                <div className="mt-8 border-t border-[#E5E7EB] pt-6">
                  <p className="text-xl font-semibold text-[#1F2937]">{testimonials[testimonialIndex].name}</p>
                  <p className="mt-1 text-sm uppercase tracking-[0.22em] text-[#6B7280]">{testimonials[testimonialIndex].event}</p>
                </div>
                <div className="mt-8 flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Previous testimonial"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#FAF8F3] text-[#1F2937] transition hover:border-[#C7DCCB]"
                    onClick={() => setTestimonialIndex((current) => (current - 1 + testimonials.length) % testimonials.length)}
                  >
                    <ChevronRight size={18} className="rotate-180" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next testimonial"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#FAF8F3] text-[#1F2937] transition hover:border-[#C7DCCB]"
                    onClick={() => setTestimonialIndex((current) => (current + 1) % testimonials.length)}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#4C7A57]">FAQ</p>
              <h2 className="mt-4 font-display text-4xl text-[#1F2937] sm:text-5xl">Common questions from guests</h2>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, index) => {
                const isOpen = expandedFaq === index;
                return (
                  <div key={item.question} className="overflow-hidden rounded-[24px] border border-[#E5E7EB] bg-[#FAF8F3]">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                      onClick={() => setExpandedFaq(isOpen ? null : index)}
                      aria-expanded={isOpen}
                    >
                      <span className="text-lg font-medium text-[#1F2937]">{item.question}</span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#1F5E3B]">
                        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-base leading-7 text-[#4B5563]">{item.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-[#F2EFE8] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-[0_18px_32px_rgba(17,24,39,0.04)] sm:p-8">
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#4C7A57]">Contact</p>
                <h2 className="mt-4 font-display text-4xl text-[#1F2937] sm:text-5xl">Plan your next meaningful gathering</h2>

                <div className="mt-8 space-y-5 text-[#374151]">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3EE] text-[#1F5E3B]">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[#6B7280]">Phone</p>
                      <a href="tel:+254757692495" className="mt-1 text-lg font-medium text-[#1F2937]">0757 692 495</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3EE] text-[#1F5E3B]">
                      <MessageCircle size={18} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[#6B7280]">WhatsApp</p>
                      <a href="https://wa.me/254757692495" target="_blank" rel="noreferrer" className="mt-1 text-lg font-medium text-[#1F2937]">Chat with us</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3EE] text-[#1F5E3B]">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[#6B7280]">Email</p>
                      <a href="mailto:hello@berakhahgardens.co.ke" className="mt-1 text-lg font-medium text-[#1F2937]">hello@berakhahgardens.co.ke</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3EE] text-[#1F5E3B]">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[#6B7280]">Location</p>
                      <p className="mt-1 text-lg font-medium text-[#1F2937]">Nanyuki, Laikipia County, Kenya</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3EE] text-[#1F5E3B]">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[#6B7280]">Operating hours</p>
                      <p className="mt-1 text-lg font-medium text-[#1F2937]">Mon - Sun: 8:00 AM - 8:00 PM</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="tel:+254757692495" className="inline-flex items-center gap-2 rounded-full bg-[#1F5E3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#174a31]">
                    <Phone size={16} />
                    Call Now
                  </a>
                  <a href="https://wa.me/254757692495" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-semibold text-[#1F2937] transition hover:border-[#C7DCCB]">
                    <MessageCircle size={16} />
                    WhatsApp
                  </a>
                  <a href="https://maps.google.com/?q=Nanyuki%20Kenya" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-semibold text-[#1F2937] transition hover:border-[#C7DCCB]">
                    <MapPin size={16} />
                    Get Directions
                  </a>
                </div>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-[#E5E7EB] bg-white shadow-[0_18px_32px_rgba(17,24,39,0.04)]">
                <iframe
                  title="Berakhah Gardens Nanyuki map"
                  src="https://www.google.com/maps?q=Nanyuki%20Kenya&output=embed"
                  className="h-[620px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#E5E7EB] bg-[#FAF8F3]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.8fr_0.9fr_1.2fr]">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D7D3C7] bg-white text-[#1F5E3B]">
                  <TreePine size={18} />
                </div>
                <div>
                  <p className="font-display text-xl text-[#1F2937]">Berakhah</p>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#6B7280]">Gardens Nanyuki</p>
                </div>
              </div>
              <p className="mt-5 max-w-xs text-base leading-7 text-[#6B7280]">
                A hidden gem for meaningful celebrations, natural gatherings, and outdoor experiences in Nanyuki.
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#6B7280]">Quick links</p>
              <ul className="mt-5 space-y-3 text-base text-[#374151]">
                <li><Link href="#about">About</Link></li>
                <li><Link href="#experiences">Experiences</Link></li>
                <li><Link href="#gallery">Gallery</Link></li>
                <li><Link href="#booking">Booking</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#6B7280]">Contact</p>
              <ul className="mt-5 space-y-3 text-base text-[#374151]">
                <li><a href="tel:+254757692495">0757 692 495</a></li>
                <li><a href="mailto:hello@berakhahgardens.co.ke">Email us</a></li>
                <li><a href="https://wa.me/254757692495" target="_blank" rel="noreferrer">WhatsApp</a></li>
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#6B7280]">Newsletter</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input type="email" placeholder="Email address" className="w-full rounded-full border border-[#E5E7EB] bg-white px-4 py-3 text-[#1F2937] outline-none focus:border-[#1F5E3B]" />
                <button type="button" className="rounded-full bg-[#1F5E3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#174a31]">Join</button>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-[#E5E7EB] pt-6 text-sm text-[#6B7280] sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Berakhah Gardens Nanyuki. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">Facebook</a>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">Instagram</a>
              <a href="https://www.tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok">TikTok</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
