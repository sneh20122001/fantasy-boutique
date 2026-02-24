import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Menu, X, PenLine, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, isSeller, signOut } = useAuth();
  const { itemCount } = useCart();

  const navItems = [
    { label: "Browse", path: "/browse" },
    { label: "How It Works", path: "/how-it-works" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Velvet<span className="text-primary">Whisper</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-body text-sm tracking-wide transition-colors hover:text-primary ${
                location.pathname === item.path ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {isSeller && (
            <Link
              to="/sell"
              className="flex items-center gap-2 rounded-full border border-primary/30 px-4 py-2 font-body text-sm text-primary transition-all hover:bg-primary/10"
            >
              <PenLine size={14} />
              Sell
            </Link>
          )}
          {user ? (
            <>
              <span className="font-body text-xs text-muted-foreground">
                {profile?.anonymous_alias || "Loading..."}
              </span>
              <button
                onClick={handleSignOut}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign In
            </Link>
          )}
          <Link to="/cart" className="relative text-muted-foreground transition-colors hover:text-foreground">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        <button className="text-foreground md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-border bg-background px-6 py-6 md:hidden"
        >
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMenuOpen(false)} className="font-body text-sm text-muted-foreground">
                {item.label}
              </Link>
            ))}
            {isSeller && (
              <Link to="/sell" onClick={() => setMenuOpen(false)} className="font-body text-sm text-primary">Sell an Item</Link>
            )}
            {user ? (
              <button onClick={() => { handleSignOut(); setMenuOpen(false); }} className="font-body text-sm text-muted-foreground text-left">Sign Out</button>
            ) : (
              <Link to="/auth" onClick={() => setMenuOpen(false)} className="font-body text-sm text-muted-foreground">Sign In</Link>
            )}
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
