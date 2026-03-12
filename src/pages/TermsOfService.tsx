import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { FileText } from "lucide-react";

const sections = [
    {
        title: "Acceptance of Terms",
        body: `By creating an account or using VelvetWhisper (the "Platform"), you agree to be bound by these Terms of Service. If you do not agree, you may not use the Platform. You must be at least 18 years of age to register or make a purchase. By registering, you confirm that you are 18 or older.`,
    },
    {
        title: "The Platform & Its Role",
        body: `VelvetWhisper is a peer-to-peer marketplace that facilitates anonymous transactions between sellers and buyers of pre-owned intimate apparel. We are not a party to any transaction between users. We do not manufacture, inspect, store, or ship any items. All listings, descriptions, and stories are created by independent sellers.`,
    },
    {
        title: "Seller Responsibilities",
        body: `Sellers agree to: list only items they legally own; describe items accurately including condition, size, and brand; fulfil all confirmed orders within 5 business days; not misrepresent items or use deceptive imagery; comply with all applicable Indian laws. Sellers are solely responsible for the accuracy of their listings and the condition of items shipped.`,
    },
    {
        title: "Buyer Responsibilities",
        body: `Buyers agree to: complete payment before requesting shipment; not file fraudulent disputes or chargebacks; provide accurate delivery information; treat sellers with respect in any communications. All sales are between buyer and seller directly. VelvetWhisper does not guarantee the condition of items beyond what sellers represent.`,
    },
    {
        title: "Prohibited Content",
        body: `The following are strictly prohibited on VelvetWhisper: listings involving minors in any capacity; content that is defamatory, harassing, or threatening; counterfeit or stolen goods; items prohibited under applicable law; any content that violates the dignity of any person. Violations will result in immediate account termination and may be reported to law enforcement.`,
    },
    {
        title: "Payments & Fees",
        body: `VelvetWhisper charges a platform fee of 8% on each completed transaction, deducted from the seller's payout. Buyers pay the listed price plus applicable delivery charges. All prices are in Indian Rupees (₹) and inclusive of applicable taxes. Refunds are processed to the original payment method within 7-10 business days where applicable.`,
    },
    {
        title: "Dispute Resolution",
        body: `In the event of a dispute between buyer and seller, users should first attempt resolution through the Platform's messaging system. If unresolved within 72 hours, either party may raise a dispute with VelvetWhisper support. Our decision in such disputes is final. These Terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.`,
    },
    {
        title: "Limitation of Liability",
        body: `VelvetWhisper shall not be liable for any indirect, incidental, or consequential damages arising from use of the Platform. Our total liability in any matter shall not exceed the transaction value of the order in dispute. We make no warranties regarding uptime, data loss, or the conduct of other users.`,
    },
    {
        title: "Termination",
        body: `We reserve the right to suspend or permanently terminate any account that violates these Terms, at our sole discretion, without prior notice. Users may delete their own accounts at any time from the Profile settings page. Termination does not relieve users of obligations arising from completed transactions.`,
    },
];

const TermsOfService = () => (
    <Layout>
        <section className="py-16">
            <div className="container mx-auto max-w-2xl px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Header */}
                    <div className="mb-10 flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <FileText size={22} className="text-primary" />
                        </div>
                        <div>
                            <h1 className="font-display text-3xl font-semibold text-foreground">
                                Terms of <span className="italic text-primary">Service</span>
                            </h1>
                            <p className="mt-1 font-body text-sm text-muted-foreground">
                                Last updated: 1 March 2026
                            </p>
                        </div>
                    </div>

                    <p className="mb-8 font-body text-sm leading-relaxed text-muted-foreground">
                        These Terms of Service govern your use of the VelvetWhisper platform. Please read them carefully before using the service. By accessing or using VelvetWhisper, you agree to these terms.
                    </p>

                    <div className="space-y-6">
                        {sections.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="gradient-card rounded-lg border border-border p-6"
                            >
                                <h2 className="mb-3 font-display text-lg font-semibold text-foreground">
                                    {i + 1}. {s.title}
                                </h2>
                                <p className="font-body text-sm leading-relaxed text-muted-foreground">
                                    {s.body}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <p className="mt-10 font-body text-xs text-muted-foreground">
                        Questions about our Terms?{" "}
                        <a href="mailto:legal@velvetwhisper.in" className="text-primary hover:underline">
                            legal@velvetwhisper.in
                        </a>
                    </p>
                </motion.div>
            </div>
        </section>
    </Layout>
);

export default TermsOfService;
