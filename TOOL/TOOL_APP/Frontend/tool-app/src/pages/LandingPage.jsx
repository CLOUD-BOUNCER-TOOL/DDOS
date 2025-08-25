import Navbar from "../Components/Navbar";
import AboutUs from "../Components/AboutUs";
import Service from "../Components/Service";
import ContactUs from "../Components/Contact";
import Footer from "../Components/Footer";
import Home from "../Components/Home";

import axiosInstance from "../utils/axiosInstance";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function LandingPage() {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchIpAndCheck = async () => {
            try {
                const response = await axiosInstance.get('/');

                if (response.data.isBlocked == true) {
                    console.log(response.data.isBlocked);
                    navigate('/denied');
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error checking IP address", error);
                setLoading(false);
            }
        };

        fetchIpAndCheck();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
                <div className="text-xl text-blue-700 font-semibold animate-pulse">Checking IP...</div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-blue-200 min-h-screen w-full">
            <Navbar />
            <main className="flex flex-col items-center w-full">
                <section className="w-full max-w-7xl px-4 md:px-8">
                    <Home />
                </section>
                <section className="w-full max-w-7xl px-4 md:px-8">
                    <AboutUs />
                </section>
                <section className="w-full max-w-7xl px-4 md:px-8">
                    <Service />
                </section>
                <section className="w-full max-w-7xl px-4 md:px-8">
                    <ContactUs />
                </section>
            </main>
            <Footer />
        </div>
    );
}
