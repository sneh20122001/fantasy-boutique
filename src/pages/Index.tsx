import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Eye, PenLine, Star, Package, Heart } from "lucide-react";
import Layout from "@/components/Layout";
import heroBg from "@/assets/hero-bg.jpg";
import { mockListings } from "@/data/mockListings";
import ListingCard from "@/components/ListingCard";

const FEATURES = [
  {
    icon: PenLine,
    title: "Write Your Fantasy",
    desc: "Sellers create listings paired with an intimate written story. Your identity stays hidden behind an anonymous alias.",
  },
  {
    icon: Eye,
    title: "Browse & Discover",
    desc: "Buyers explore a feed of fantasies. Each story is a window into a secret world — find the one that speaks to you.",
  },
  {
    icon: Shield,
    title: "Secure & Anonymous",
    desc: "Payments processed securely. Seller identities never revealed. Banking details stay private through encrypted payouts.",
  },
];

const TRUST_STATS = [
  { value: `${mockListings.length}+`, label: "Active Listings" },
  { value: "100%", label: "Anonymous Sellers" },
  { value: "4.8★", label: "Avg Rating" },
];

/**
 * Homepage — hero, trust stats bar, how-it-works, featured listings, CTA.
 */
const Index = () => {
  const featured = mockListings.filter((l) => l.status === "AVAILABLE").slice(0, 3);

  return (
    <Layout>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 gradient-hero opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

        <div className="container relative z-10 mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="mb-4 font-body text-xs uppercase tracking-[0.3em] text-primary">
              Anonymous · Intimate · Yours
            </p>
            <h1 className="font-display text-5xl font-semibold leading-tight tracking-tight text-foreground md:text-7xl">
              Every piece tells a{" "}
              <span className="italic text-primary">story</span>
            </h1>
            <p className="mt-6 max-w-lg font-body text-base leading-relaxed text-muted-foreground">
              A curated marketplace where intimacy meets imagination. Browse unique items paired with whispered fantasies — all sellers remain completely anonymous.
            </p>
            {/* Mobile: stack; sm+: row */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link
                to="/browse"
                className="gradient-wine inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-body text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105 active:scale-95"
              >
                Browse Stories <ArrowRight size={16} />
              </Link>
              <Link
                to="/sell"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-8 py-3.5 font-body text-sm text-foreground transition-all hover:border-primary/40 hover:text-primary active:scale-95"
              >
                Become a Seller
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Trust stats bar ───────────────────────────────────────────────── */}
      <section className="border-y border-border bg-secondary/30 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
            {TRUST_STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-2xl font-semibold text-primary">{s.value}</p>
                <p className="mt-0.5 font-body text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              How it works
            </h2>
            <p className="mt-3 font-body text-sm text-muted-foreground">
              Three simple steps. Total anonymity guaranteed.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {FEATURES.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="gradient-card rounded-lg border border-border p-8 text-center transition-all duration-300 hover:border-primary/30 hover:shadow-glow"
              >
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <item.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured listings ─────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="border-t border-border py-24">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-10 flex items-end justify-between"
            >
              <div>
                <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
                  Latest <span className="italic text-primary">Stories</span>
                </h2>
                <p className="mt-2 font-body text-sm text-muted-foreground">{mockListings.length} listings live right now</p>
              </div>
              <Link to="/browse" className="hidden font-body text-sm text-primary hover-underline sm:block">
                View all →
              </Link>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} index={i} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link to="/browse" className="font-body text-sm text-primary underline underline-offset-4">
                View all {mockListings.length} stories →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="border-t border-border py-24">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Heart size={24} className="text-primary" />
            </div>
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              Your secrets are safe with us
            </h2>
            <p className="mx-auto mt-4 max-w-md font-body text-sm leading-relaxed text-muted-foreground">
              Join a community built on trust, privacy, and the art of the written word.
            </p>
            <Link
              to="/auth"
              className="gradient-wine mt-8 inline-flex items-center gap-2 rounded-full px-10 py-3.5 font-body text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105 active:scale-95"
            >
              Create Your Account <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
