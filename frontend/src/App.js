import "@/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import SignatureDishes from "@/components/SignatureDishes";
import MenuSection from "@/components/MenuSection";
import Experience from "@/components/Experience";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import Reservation from "@/components/Reservation";
import LocationSection from "@/components/LocationSection";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";
import AdminPanel from "@/pages/admin/AdminPanel";

function HomePage() {
    return (
        <div className="App bg-ink text-cream font-sans antialiased">
            <Navbar />
            <main>
                <Hero />
                <About />
                <SignatureDishes />
                <MenuSection />
                <Experience />
                <Gallery />
                <Reviews />
                <Reservation />
                <LocationSection />
                <ContactCTA />
            </main>
            <Footer />
            <MobileCTA />
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admin" element={<AdminPanel />} />
            </Routes>
            <Toaster position="top-center" theme="dark" richColors />
        </BrowserRouter>
    );
}
