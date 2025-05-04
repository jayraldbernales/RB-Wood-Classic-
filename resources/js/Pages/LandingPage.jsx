import React from "react";
import HeroSection from "../Layouts/LandingPage/HeroSection";
import Contact from "@/Layouts/contact";
import Features from "@/Layouts/LandingPage/Features";
import Gallery from "@/Layouts/LandingPage/Gallery";
import Reviews from "@/Layouts/LandingPage/Reviews";

export default function LandingPage() {
    return (
        <div className="bg-white">
            <HeroSection />
            <Features />
            <Gallery />
            <Reviews />
            <Contact />
        </div>
    );
}
