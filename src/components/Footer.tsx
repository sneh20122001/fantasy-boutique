import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary py-12">
      <div className="container mx-auto px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <span className="font-display text-xl font-semibold text-foreground">
              Velvet<span className="text-primary">Whisper</span>
            </span>
            <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-muted-foreground">
              An anonymous marketplace where intimacy meets imagination. Every item tells a story.
            </p>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-foreground">
              Navigate
            </h4>
            <nav className="mt-4 flex flex-col gap-2">
              <Link to="/browse" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Browse</Link>
              <Link to="/sell" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Sell</Link>
              <Link to="/how-it-works" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">How It Works</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-foreground">
              Legal
            </h4>
            <nav className="mt-4 flex flex-col gap-2">
              <span className="font-body text-sm text-muted-foreground">Privacy Policy</span>
              <span className="font-body text-sm text-muted-foreground">Terms of Service</span>
              <span className="font-body text-sm text-muted-foreground">Anonymity Guarantee</span>
            </nav>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="font-body text-xs text-muted-foreground">
            © 2026 VelvetWhisper. All identities protected. All stories cherished.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
