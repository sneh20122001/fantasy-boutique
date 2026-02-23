import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Shield, Eye, CreditCard, PenLine, Lock, UserX } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: UserX,
      title: "Register Anonymously",
      desc: "Sign up with your details — they're stored securely and never shared. You're assigned a random alias like User_8472.",
    },
    {
      icon: PenLine,
      title: "Create Your Listing",
      desc: "Add item details (brand, size, price) and write an intimate fantasy. This story is what buyers will discover.",
    },
    {
      icon: Eye,
      title: "Buyers Browse Stories",
      desc: "Buyers see only your alias and your words. No names, no photos, no personal information — ever.",
    },
    {
      icon: CreditCard,
      title: "Secure Checkout",
      desc: "Payments are processed through encrypted channels. Buyer and seller banking details are never shared with each other.",
    },
    {
      icon: Lock,
      title: "Private Payouts",
      desc: "Sellers receive payouts directly to their accounts via Stripe Connect. Complete financial privacy guaranteed.",
    },
    {
      icon: Shield,
      title: "Identity Protection",
      desc: "Our system is designed so that even our frontend code never receives seller PII. Privacy is architectural, not just policy.",
    },
  ];

  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto max-w-3xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="font-display text-4xl font-semibold text-foreground">
              How <span className="italic text-primary">VelvetWhisper</span> Works
            </h1>
            <p className="mt-3 font-body text-sm text-muted-foreground">
              Privacy-first design. Every step is built around protecting your identity.
            </p>
          </motion.div>

          <div className="space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5 gradient-card rounded-lg border border-border p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <step.icon size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1 font-body text-sm leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HowItWorks;
