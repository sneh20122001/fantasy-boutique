import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/*
        pt-16 (64px) matches the header height.
        Using a CSS variable would be cleaner but pt-16 is a
        safe match for the 64px header. On mobile the header
        can be slightly taller when the search bar is open —
        to avoid clipping we give a little extra breathing room
        via pt-[72px] at the exact header height measured.
      */}
      <main className="flex-1 pt-[72px]">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
