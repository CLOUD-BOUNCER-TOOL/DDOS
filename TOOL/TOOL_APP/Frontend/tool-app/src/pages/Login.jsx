import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Container } from 'react-bootstrap';
import "../App.css"
import NavbarScroll from "../Components/Navbar";
import { validateEmail } from "../utils/utils";
import axiosInstance from "../utils/axiosInstance";
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);

    const handleInput = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateEmail(credentials.email)) {
            toast.error("Invalid email address"); // Use toast.error
            return;
        }

        if (!credentials.password) {
            toast.error("Please enter the password"); // Use toast.error
            return;
        }

        setError("");

        // Login API call
        try {
            const response = await axiosInstance.post("/login", {
                email: credentials.email,
                password: credentials.password,
            });

            if (response.data && response.data.accessToken) {
                localStorage.setItem("token", response.data.accessToken);
                toast.success("Login successful!"); 
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1000); 
            }
            

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
                toast.error(error.response.data.message); // Show error message
            } else {
                setError("An unexpected error occurred. Please try again.");
                toast.error("An unexpected error occurred. Please try again."); // Show error message
            }
        }
    }


    return (
        <>
            <NavbarScroll />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 px-2">
                <Container className="max-w-md w-full bg-white shadow-2xl rounded-3xl p-6 mt-8 mb-8 animate-fade-in">
                    <div className="flex flex-col items-center mb-6">
                        <svg className="w-16 h-16 text-blue-600 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        <h1 className="text-center text-3xl font-bold text-blue-700">Login to Your Account</h1>
                    </div>
                    {error && (
                        <div className="mb-4 text-center text-red-600 font-semibold bg-red-100 rounded-lg p-2 border border-red-300">
                            {error}
                        </div>
                    )}
                    <Form onSubmit={handleSubmit} className="space-y-4">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="font-semibold">Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                onChange={handleInput}
                                value={credentials.email}
                                required
                                className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <Form.Text className="text-muted">
                                We&apos;ll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label className="font-semibold">Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter Password"
                                name="password"
                                onChange={handleInput}
                                value={credentials.password}
                                required
                                minLength={8}
                                className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </Form.Group>
                        <div className="mb-2 text-center text-gray-600">
                            Do not have an account? <Link to="/signup" className="text-blue-600 hover:underline font-semibold">Sign up here</Link>
                        </div>
                        <Button variant="primary" type="submit" className="w-full py-2 text-lg rounded-lg font-bold bg-blue-600 hover:bg-blue-700 border-0 transition-all duration-200">
                            Login
                        </Button>
                    </Form>
                </Container>
            </div>
            <ToastContainer />
            <style>{`
                @media (max-width: 600px) {
                    .max-w-md { max-width: 100% !important; border-radius: 1rem !important; }
                    .p-6 { padding: 1rem !important; }
                }
                .animate-fade-in {
                    animation: fadeIn 0.7s ease;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    );
}          
