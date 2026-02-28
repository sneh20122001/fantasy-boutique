import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import Sell from "./pages/Sell";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import HowItWorks from "./pages/HowItWorks";
import ListingDetail from "./pages/ListingDetail";
import Orders from "./pages/Orders";
import MyListings from "./pages/MyListings";
import EditListing from "./pages/EditListing";
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
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/my-listings" element={<MyListings />} />
              <Route path="/edit-listing/:id" element={<EditListing />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
