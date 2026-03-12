import { Link, useLocation, useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { motion } from "framer-motion";
import { ShoppingBag, Menu, X, PenLine, LogOut, ClipboardList, Heart, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/hooks/useFavorites";
import NotificationBell from "@/components/NotificationBell";
=======
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, PenLine, LogOut, ClipboardList, Search, Heart, MessageSquare, User, BarChart2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
>>>>>>> 538f260 (Updated project changes)

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, isSeller, signOut } = useAuth();
  const { itemCount } = useCart();
<<<<<<< HEAD
  const { favoriteIds } = useFavorites();
  const favCount = favoriteIds.length;
=======
  const { wishlistCount } = useWishlist();
>>>>>>> 538f260 (Updated project changes)

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Focus search on open
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navItems = [
    { label: "Browse", path: "/browse" },
    { label: "How It Works", path: "/how-it-works" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl transition-shadow duration-300 ${scrolled ? "shadow-md shadow-black/10" : ""}`}>
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Wordmark */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Velvet<span className="text-primary">Whisper</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative font-body text-sm tracking-wide transition-colors hover:text-primary ${location.pathname === item.path ? "text-primary" : "text-muted-foreground"
                }`}
            >
              {item.label}
              {location.pathname === item.path && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-px rounded-full bg-primary"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-4 md:flex">
          {/* Search icon */}
          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="text-muted-foreground transition-colors hover:text-foreground"
            title="Search"
          >
            <Search size={18} />
          </button>

          {isSeller && (
            <>
<<<<<<< HEAD
              <Link
                to="/seller-dashboard"
                className="flex items-center gap-1.5 font-body text-sm tracking-wide text-muted-foreground transition-colors hover:text-primary"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
              <Link
                to="/my-listings"
                className="font-body text-sm tracking-wide text-muted-foreground transition-colors hover:text-primary"
              >
                My Listings
=======
              <Link to="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground" title="Seller Dashboard">
                <BarChart2 size={18} />
>>>>>>> 538f260 (Updated project changes)
              </Link>
              <Link to="/my-listings" className="font-body text-sm tracking-wide text-muted-foreground transition-colors hover:text-primary">My Listings</Link>
              <Link to="/sell" className="flex items-center gap-2 rounded-full border border-primary/30 px-4 py-2 font-body text-sm text-primary transition-all hover:bg-primary/10">
                <PenLine size={14} /> Sell
              </Link>
            </>
          )}

          {user ? (
            <>
<<<<<<< HEAD
              <Link
                to="/favorites"
                className="relative text-muted-foreground transition-colors hover:text-foreground"
                title="Favorites"
              >
                <Heart size={18} />
                {favCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {favCount}
                  </span>
                )}
              </Link>
              <NotificationBell />
              <Link
                to="/orders"
                className="text-muted-foreground transition-colors hover:text-foreground"
                title="Order History"
              >
=======
              <Link to="/messages" className="text-muted-foreground transition-colors hover:text-foreground" title="Messages">
                <MessageSquare size={18} />
              </Link>
              <Link to="/orders" className="text-muted-foreground transition-colors hover:text-foreground" title="Orders">
>>>>>>> 538f260 (Updated project changes)
                <ClipboardList size={18} />
              </Link>
              <Link to="/profile" className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 font-body text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary" title="Profile">
                <User size={13} />
                <span className="max-w-[80px] truncate">{profile?.anonymous_alias || "Profile"}</span>
              </Link>
              <button onClick={handleSignOut} className="text-muted-foreground transition-colors hover:text-foreground" title="Sign Out">
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

          {/* Wishlist */}
          <Link to="/wishlist" className="relative text-muted-foreground transition-colors hover:text-foreground" title="Wishlist">
            <Heart size={20} />
            <AnimatePresence>
              {wishlistCount > 0 && (
                <motion.span
                  key="wishlist-count"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative text-muted-foreground transition-colors hover:text-foreground">
            <ShoppingBag size={20} />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key="cart-count"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="text-foreground md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

<<<<<<< HEAD
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
              <>
                <Link to="/seller-dashboard" onClick={() => setMenuOpen(false)} className="font-body text-sm text-muted-foreground">Dashboard</Link>
                <Link to="/my-listings" onClick={() => setMenuOpen(false)} className="font-body text-sm text-muted-foreground">My Listings</Link>
                <Link to="/sell" onClick={() => setMenuOpen(false)} className="font-body text-sm text-primary">Sell an Item</Link>
              </>
            )}
            {user ? (
              <>
                <Link to="/favorites" onClick={() => setMenuOpen(false)} className="font-body text-sm text-muted-foreground">Favorites</Link>
                <Link to="/orders" onClick={() => setMenuOpen(false)} className="font-body text-sm text-muted-foreground">Order History</Link>
                <button onClick={() => { handleSignOut(); setMenuOpen(false); }} className="font-body text-sm text-muted-foreground text-left">Sign Out</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMenuOpen(false)} className="font-body text-sm text-muted-foreground">Sign In</Link>
            )}
          </nav>
        </motion.div>
      )}
=======
      {/* Inline search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border"
          >
            <form onSubmit={handleSearchSubmit} className="container mx-auto flex items-center gap-3 px-6 py-3">
              <Search size={15} className="shrink-0 text-muted-foreground" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stories, brands, sizes…"
                className="flex-1 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border bg-background px-6 py-6 md:hidden"
          >
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-body text-sm ${location.pathname === item.path ? "text-primary" : "text-muted-foreground"}`}
                >
                  {item.label}
                </Link>
              ))}
              {isSeller && (
                <>
                  <Link to="/my-listings" className="font-body text-sm text-muted-foreground">My Listings</Link>
                  <Link to="/sell" className="font-body text-sm text-primary">Sell an Item</Link>
                </>
              )}
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="font-body text-sm text-muted-foreground">Profile</Link>
                  <Link to="/orders" onClick={() => setMenuOpen(false)} className="font-body text-sm text-muted-foreground">Order History</Link>
                  <Link to="/messages" onClick={() => setMenuOpen(false)} className="font-body text-sm text-muted-foreground">Messages</Link>
                  {isSeller && <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="font-body text-sm text-muted-foreground">Dashboard</Link>}
                  <Link to="/wishlist" className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                    Wishlist {wishlistCount > 0 && <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] text-white">{wishlistCount}</span>}
                  </Link>
                  <Link to="/cart" className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                    Cart {itemCount > 0 && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">{itemCount}</span>}
                  </Link>
                  <button
                    onClick={() => { handleSignOut(); setMenuOpen(false); }}
                    className="text-left font-body text-sm text-muted-foreground"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/auth" className="font-body text-sm text-muted-foreground">Sign In</Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
>>>>>>> 538f260 (Updated project changes)
    </header>
  );
};

export default Header;
