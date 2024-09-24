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
    const [data, setData] = useState(null);

    const navigate = useNavigate();

    
    useEffect(() => {
        axiosInstance
            .get('/') // Adjust the endpoint as necessary
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error(error);
            });

            const navigatetoDenied = () => {
                setInterval(()=> {
                    navigate("/denied");
                }, 4000);
            }

            navigatetoDenied();
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