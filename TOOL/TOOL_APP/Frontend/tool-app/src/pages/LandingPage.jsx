import Navbar from "../Components/Navbar";
import AboutUs from "../Components/AboutUs";
import Service from "../Components/Service";
import ContactUs from "../Components/Contact";
import Footer from "../Components/Footer";
import Home from "../Components/Home";

import axiosInstance from "../utils/axiosInstance";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from 'axios';

export default function LandingPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchIpAndCheck = async () => {
            try {
                const response = await axiosInstance.get('/');

                if (response.data.isBlocked) {
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
        return <div>Checking IP...</div>;
    }

    return (
        <>
            <Navbar />
            <Home />
            <AboutUs />
            <Service />
            <ContactUs />
            <Footer />
        </>
    );
}
