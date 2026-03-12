import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Eye, EyeOff, Lock, UserX, Fingerprint, Server } from "lucide-react";

const pillars = [
    {
        icon: EyeOff,
        title: "No Real Names. Ever.",
        body: `From the moment you sign up, you are known only by a randomly-generated alias (e.g., User_8472). Your real name is never stored, displayed, or transmitted on the platform. Buyers never see who they are buying from, and sellers never know who is buying from them — only a shipping address for fulfilment, which is deleted after delivery.`,
    },
    {
        icon: Lock,
        title: "End-to-End Encrypted Data",
        body: `All data transmissions between your device and our servers are encrypted using TLS 1.3. Sensitive data at rest — including email addresses, shipping addresses, and payment references — is encrypted using AES-256. Our database administrators cannot read your private information in plain text.`,
    },
    {
        icon: UserX,
        title: "Zero Seller Exposure",
        body: `Sellers are protected by multiple layers of anonymity. Your listings are linked to your alias, not your email or identity. Payment payouts are processed through verified bank accounts linked only to our payment processor — not stored on VelvetWhisper. Even if our platform were breached, seller real identities would not be exposed.`,
    },
    {
        icon: Fingerprint,
        title: "Anonymous by Architecture",
        body: `Anonymity is not a feature we added on top — it is the foundation of how VelvetWhisper was built. User IDs in our database are randomly-generated UUIDs with no sequential relationship. We do not log IP addresses against user activity. Analytics are processed in aggregate only, never at the individual level.`,
    },
    {
        icon: Eye,
        title: "What Other Users Can See",
        body: `Other users can only see: your anonymous alias, your listings (text, photos, size, price), and your star ratings. They cannot see your email, transaction history with other buyers, real location, or any data that could identify you in the real world. Even our support team sees only your alias during routine interactions.`,
    },
    {
        icon: Server,
        title: "Data Retention & Deletion",
        body: `We retain account data only as long as necessary. Inactive accounts (no login for 12 months) are automatically anonymised — your email is hashed and your alias reset, making the account unrecoverable but leaving no identifying trace. You may request immediate full deletion at any time from your Profile settings. Deletion is irreversible and completed within 72 hours.`,
    },
];

const AnonymityGuarantee = () => (
    <Layout>
        <section className="py-16">
            <div className="container mx-auto max-w-2xl px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
                            Anonymity{" "}
                            <span className="italic text-primary">Guarantee</span>
                        </h1>
                        <p className="mt-2 font-body text-sm text-muted-foreground">
                            Last updated: 1 March 2026
                        </p>
                    </div>

                    {/* Hero statement */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="mb-10 rounded-xl border border-primary/20 bg-primary/5 p-6"
                    >
                        <p className="font-display text-lg italic leading-relaxed text-foreground">
                            "Every person on VelvetWhisper — buyer or seller — has the absolute right to remain unknown. We do not merely promise anonymity. We build it into every layer of the platform so that breaking it would require dismantling the architecture itself."
                        </p>
                        <p className="mt-3 font-body text-xs text-primary">— VelvetWhisper founding principle</p>
                    </motion.div>

                    {/* Pillars */}
                    <div className="space-y-5">
                        {pillars.map((p, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 + i * 0.07 }}
                                className="gradient-card flex gap-5 rounded-lg border border-border p-6"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <p.icon size={18} className="text-primary" />
                                </div>
                                <div>
                                    <h2 className="mb-2 font-display text-base font-semibold text-foreground">
                                        {p.title}
                                    </h2>
                                    <p className="font-body text-sm leading-relaxed text-muted-foreground">
                                        {p.body}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Closing */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="mt-10 rounded-lg border border-border p-6 text-center"
                    >
                        <p className="font-display text-base text-foreground">
                            Have a concern about your anonymity?
                        </p>
                        <p className="mt-2 font-body text-sm text-muted-foreground">
                            Contact our privacy team directly —{" "}
                            <a href="mailto:anonymity@velvetwhisper.in" className="text-primary hover:underline">
                                anonymity@velvetwhisper.in
                            </a>
                        </p>
                        <p className="mt-1 font-body text-xs text-muted-foreground">
                            We respond to all anonymity concerns within 24 hours.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    </Layout>
);

export default AnonymityGuarantee;
