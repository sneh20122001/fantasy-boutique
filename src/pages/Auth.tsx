import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type AuthMode = "signin" | "signup";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
  });
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate("/browse");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        await signIn(form.email, form.password);
        toast.success("Welcome back!");
        navigate("/browse");
      } else {
        if (!form.gender) {
          toast.error("Please select your gender");
          setLoading(false);
          return;
        }
        await signUp(form.email, form.password, form.name, form.phone, form.gender);
        toast.success("Account created! Check your email to confirm.");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="flex min-h-[80vh] items-center py-16">
        <div className="container mx-auto max-w-md px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="gradient-card rounded-xl border border-border p-8 shadow-card"
          >
            <div className="mb-8 text-center">
              <h1 className="font-display text-2xl font-semibold text-foreground">
                {mode === "signin" ? "Welcome Back" : "Join VelvetWhisper"}
              </h1>
              <p className="mt-2 font-body text-sm text-muted-foreground">
                {mode === "signin" ? "Sign in to your account" : "Create your anonymous account"}
              </p>
            </div>

            <div className="mb-6 flex rounded-full border border-border bg-secondary p-1">
              <button
                onClick={() => setMode("signin")}
                className={`flex-1 rounded-full py-2 font-body text-xs font-medium transition-all ${
                  mode === "signin" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode("signup")}
                className={`flex-1 rounded-full py-2 font-body text-xs font-medium transition-all ${
                  mode === "signup" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                  />
                  <select
                    required
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 font-body text-sm text-foreground focus:border-primary/50 focus:outline-none"
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                  <p className="font-body text-xs text-muted-foreground">
                    Only female-identifying users can register as sellers.
                  </p>
                </>
              )}

              <input
                type="email"
                required
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
              />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="gradient-wine w-full rounded-full py-3 font-body text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-50"
              >
                {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;
