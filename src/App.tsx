import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import Sell from "./pages/Sell";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import HowItWorks from "./pages/HowItWorks";
import ListingDetail from "./pages/ListingDetail";
import Orders from "./pages/Orders";
import MyListings from "./pages/MyListings";
import EditListing from "./pages/EditListing";
<<<<<<< HEAD
import SellerDashboard from "./pages/SellerDashboard";
import Favorites from "./pages/Favorites";
=======
import Profile from "./pages/Profile";
import SellerDashboard from "./pages/SellerDashboard";
import Messages from "./pages/Messages";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import AnonymityGuarantee from "./pages/AnonymityGuarantee";
>>>>>>> 538f260 (Updated project changes)
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
<<<<<<< HEAD
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/my-listings" element={<MyListings />} />
              <Route path="/seller-dashboard" element={<SellerDashboard />} />
              <Route path="/edit-listing/:id" element={<EditListing />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
=======
            <WishlistProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/listing/:id" element={<ListingDetail />} />
                <Route path="/sell" element={<Sell />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/my-listings" element={<MyListings />} />
                <Route path="/edit-listing/:id" element={<EditListing />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<SellerDashboard />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/anonymity" element={<AnonymityGuarantee />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </WishlistProvider>
>>>>>>> 538f260 (Updated project changes)
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
