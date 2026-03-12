import { Link } from "react-router-dom";
import { Heart, ShoppingBag, MessageSquare, HelpCircle } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <span className="font-display text-xl font-semibold text-foreground">
              Velvet<span className="text-primary">Whisper</span>
            </span>
            <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-muted-foreground">
              An anonymous marketplace where intimacy meets imagination. Every item tells a story.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h4 className="mb-4 font-display text-xs font-semibold uppercase tracking-widest text-foreground">
              Navigate
            </h4>
            <nav className="flex flex-col gap-2.5">
              <Link to="/browse" className="hover-underline w-fit font-body text-sm text-muted-foreground transition-colors hover:text-primary">
                Browse Stories
              </Link>
              <Link to="/sell" className="hover-underline w-fit font-body text-sm text-muted-foreground transition-colors hover:text-primary">
                Sell an Item
              </Link>
              <Link to="/how-it-works" className="hover-underline w-fit font-body text-sm text-muted-foreground transition-colors hover:text-primary">
                How It Works
              </Link>
            </nav>
          </div>

          {/* Account */}
          <div>
            <h4 className="mb-4 font-display text-xs font-semibold uppercase tracking-widest text-foreground">
              Account
            </h4>
            <nav className="flex flex-col gap-2.5">
              <Link to="/profile" className="hover-underline w-fit font-body text-sm text-muted-foreground transition-colors hover:text-primary">
                <span className="flex items-center gap-1.5">Profile</span>
              </Link>
              <Link to="/wishlist" className="hover-underline w-fit font-body text-sm text-muted-foreground transition-colors hover:text-primary">
                <span className="flex items-center gap-1.5"><Heart size={12} />Wishlist</span>
              </Link>
              <Link to="/orders" className="hover-underline w-fit font-body text-sm text-muted-foreground transition-colors hover:text-primary">
                <span className="flex items-center gap-1.5"><ShoppingBag size={12} />Orders</span>
              </Link>
              <Link to="/messages" className="hover-underline w-fit font-body text-sm text-muted-foreground transition-colors hover:text-primary">
                <span className="flex items-center gap-1.5"><MessageSquare size={12} />Messages</span>
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 font-display text-xs font-semibold uppercase tracking-widest text-foreground">
              Legal
            </h4>
            <nav className="flex flex-col gap-2.5">
              <Link to="/privacy" className="hover-underline w-fit font-body text-sm text-muted-foreground transition-colors hover:text-primary">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover-underline w-fit font-body text-sm text-muted-foreground transition-colors hover:text-primary">
                Terms of Service
              </Link>
              <Link to="/anonymity" className="hover-underline w-fit font-body text-sm text-muted-foreground transition-colors hover:text-primary">
                Anonymity Guarantee
              </Link>
              <Link to="/how-it-works" className="hover-underline w-fit font-body text-sm text-muted-foreground transition-colors hover:text-primary">
                <span className="flex items-center gap-1.5"><HelpCircle size={12} />Help & FAQ</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="font-body text-xs text-muted-foreground">
            © {year} VelvetWhisper. All identities protected. All stories cherished.
          </p>
          <p className="font-body text-xs text-muted-foreground/50">
            Made with ♥ for curious souls
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
