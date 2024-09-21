import Navbar from "../Components/Navbar";
import AboutUs from "../Components/AboutUs";
import Service from "../Components/Service";
import ContactUs from "../Components/Contact";
import Footer from "../Components/Footer";
import Home from "../Components/Home";

import axiosInstance from "../utils/axiosInstance";
import { useState, useEffect } from "react";

export default function LandingPage() {
    const [data, setData] = useState(null);

    useEffect(() => {
        axiosInstance
            .get('/') // Adjust the endpoint as necessary
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);
    
    return (
        <>
            <Navbar />
            <Home />
            <AboutUs />
            <Service />
            <ContactUs />
            <Footer />
            
        </>
    )
}