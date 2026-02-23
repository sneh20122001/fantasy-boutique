import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  // Empty cart state for now
  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto max-w-2xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="mb-8 font-display text-3xl font-semibold text-foreground">
              Your Cart
            </h1>

            <div className="gradient-card rounded-xl border border-border p-12 text-center shadow-card">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <ShoppingBag size={28} className="text-primary" />
              </div>
              <h3 className="font-display text-lg text-foreground">
                Your cart is empty
              </h3>
              <p className="mt-2 font-body text-sm text-muted-foreground">
                Browse our collection and find a story that moves you.
              </p>
              <Link
                to="/browse"
                className="gradient-wine mt-6 inline-flex rounded-full px-8 py-3 font-body text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105"
              >
                Browse Stories
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Cart;
