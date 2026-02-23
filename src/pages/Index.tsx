import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Eye, PenLine } from "lucide-react";
import Layout from "@/components/Layout";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 gradient-hero opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

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
              A curated marketplace where intimacy meets imagination. Browse
              unique items paired with whispered fantasies — all sellers remain
              completely anonymous.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/browse"
                className="gradient-wine inline-flex items-center gap-2 rounded-full px-8 py-3 font-body text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105"
              >
                Browse Stories
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/sell"
                className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3 font-body text-sm text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                Become a Seller
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
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

          <div className="grid gap-8 md:grid-cols-3">
            {[
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
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="gradient-card rounded-lg border border-border p-8 text-center"
              >
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <item.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-24">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              Your secrets are safe with us
            </h2>
            <p className="mx-auto mt-4 max-w-md font-body text-sm leading-relaxed text-muted-foreground">
              Join a community built on trust, privacy, and the art of the written word.
            </p>
            <Link
              to="/auth"
              className="gradient-wine mt-8 inline-flex items-center gap-2 rounded-full px-10 py-3 font-body text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105"
            >
              Create Your Account
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
