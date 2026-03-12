import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Shield } from "lucide-react";

const sections = [
    {
        title: "Information We Collect",
        body: `We collect only the minimum information necessary to operate VelvetWhisper. This includes your email address (used solely for account authentication), an anonymous alias auto-generated at signup, and transaction data required to fulfil orders. We do not collect your real name, phone number, or any government-issued identity information unless you voluntarily provide a delivery address during checkout — which is stored encrypted and deleted 30 days after order fulfilment.`,
    },
    {
        title: "How We Use Your Information",
        body: `Your email is used only for login, password recovery, and critical service notifications. We do not send marketing emails without explicit opt-in. Your anonymous alias is how you appear to all other users — no real identity is ever exposed on the platform. Transaction data is retained for legal compliance (GST/taxation) for a period of 7 years as mandated by Indian law, after which it is permanently deleted.`,
    },
    {
        title: "Data Sharing",
        body: `We do not sell, rent, or trade your personal information to any third party. The only data shared externally is: (a) encrypted shipping address shared with our logistics partner solely to fulfil your order, and (b) anonymised, aggregated analytics data with no personally-identifiable information. Our payment processor (Razorpay / UPI gateway) handles all payment data under their own PCI-DSS compliant privacy policy.`,
    },
    {
        title: "Anonymity Architecture",
        body: `Seller identities are protected by design. Your real name, email, and financial details are never visible to buyers or other sellers. All user-facing identifiers are randomly-generated aliases (e.g., User_8472). Even our internal staff cannot link a listing to a real identity without a valid court order. Buyer shipping addresses are only visible to the specific seller shipping that order and are purged post-delivery.`,
    },
    {
        title: "Cookies & Tracking",
        body: `We use a single session cookie for authentication. We do not use advertising cookies, third-party trackers, or cross-site tracking. Our analytics are self-hosted and do not share data with Google, Meta, or any advertising network. You may disable cookies in your browser settings — this will require you to log in on each visit.`,
    },
    {
        title: "Your Rights",
        body: `Under applicable Indian data protection law and GDPR principles, you have the right to: request a copy of all data we hold about you; request correction of inaccurate data; request deletion of your account and associated data (subject to our legal retention obligations); and withdraw consent at any time. To exercise any of these rights, contact us at privacy@velvetwhisper.in and we will respond within 30 days.`,
    },
    {
        title: "Changes to This Policy",
        body: `We will notify registered users by email of any material changes to this Privacy Policy at least 14 days before they take effect. Continued use of the platform after that date constitutes acceptance of the updated policy.`,
    },
];

const PrivacyPolicy = () => (
    <Layout>
        <section className="py-16">
            <div className="container mx-auto max-w-2xl px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Header */}
                    <div className="mb-10 flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Shield size={22} className="text-primary" />
                        </div>
                        <div>
                            <h1 className="font-display text-3xl font-semibold text-foreground">
                                Privacy <span className="italic text-primary">Policy</span>
                            </h1>
                            <p className="mt-1 font-body text-sm text-muted-foreground">
                                Last updated: 1 March 2026
                            </p>
                        </div>
                    </div>

                    <p className="mb-8 font-body text-sm leading-relaxed text-muted-foreground">
                        VelvetWhisper is built on a foundation of privacy. We handle your data with the same discretion we promise every user of this platform. This policy explains what we collect, how we use it, and the rights you have over it.
                    </p>

                    <div className="space-y-8">
                        {sections.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
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
                        Questions? Contact us at{" "}
                        <a href="mailto:privacy@velvetwhisper.in" className="text-primary hover:underline">
                            privacy@velvetwhisper.in
                        </a>
                    </p>
                </motion.div>
            </div>
        </section>
    </Layout>
);

export default PrivacyPolicy;
