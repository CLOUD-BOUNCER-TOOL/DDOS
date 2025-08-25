import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Navbar from '../Components/Navbar';
import { validateEmail } from '../utils/utils';
import axiosInstance from '../utils/axiosInstance';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';

export default function Signup() {
    const [info, setInfo] = useState({ fullName: "", email: "", password: "" });
    const [error, setError] = useState("");


    const navigate = useNavigate();

    const handleInput = (e) => {
        setInfo({ ...info, [e.target.name]: e.target.value })
    }

    const handleSignUp = async(e) =>{
            e.preventDefault();

            if(!info.fullName){
                setError("Please enter your Full Name");
                return;
            }

            if(!validateEmail(info.email)){
                setError("Please enter a valid email address");
                toast.error("Please Enter a valid email address");
                return;
            }

            if(!info.password){
                setError("Please enter a valid password");
                return;
            }
            setError("");

            //sign up api is being called

            try{
                const response = await axiosInstance.post("/signup",{
                    fullName:info.fullName,
                    email:info.email,
                    password:info.password,
                });

                if (response.data && response.data.error) {
                    setError(response.data.message);
                    if (response.data.message === "User already exists") {
                        toast.error("User already exists");
                      
                    } else{
                        toast.error(response.data.message);
                    }
                    return;
                }
    
                if (response.data && response.data.accessToken) {
                    localStorage.setItem("token", response.data.accessToken);
                    toast.success("Account created successfully!");
                    setTimeout(() => {
                        navigate("/login");
                    }, 1200);
                }
            }catch(error){
                if (error.response && error.response.data && error.response.data.message) {
                    setError(error.response.data.message);
                } else {
                    toast.error(" An Unexpected error occured.");
                    setError("An unexpected error occured. Please try again.")
                }
            }
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
                <Container className="max-w-md w-full bg-white shadow-2xl rounded-3xl p-6 mt-8 mb-8">
                    <h1 className="text-center text-3xl font-bold mb-6 text-blue-700">Create Your Account</h1>
                    {error && (
                        <div className="mb-4 text-center text-red-600 font-semibold bg-red-100 rounded-lg p-2 border border-red-300">
                            {error}
                        </div>
                    )}
                    <Form onSubmit={handleSignUp} className="space-y-4">
                        <Form.Group controlId="fullName">
                            <Form.Label className="font-semibold">Full Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter your Full Name" name="fullName" onChange={handleInput} value={info.fullName} required className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="font-semibold">Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" name="email" onChange={handleInput} value={info.email} required className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label className="font-semibold">Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter Password" name="password" onChange={handleInput} value={info.password} required minLength={8} className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                        </Form.Group>
                        <div className="mb-2 text-center text-gray-600">
                            Already registered? <Link to="/login" className="text-blue-600 hover:underline font-semibold">Login here</Link>
                        </div>
                        <Button variant="primary" type="submit" className="w-full py-2 text-lg rounded-lg font-bold bg-blue-600 hover:bg-blue-700 border-0">
                            Sign Up
                        </Button>
                    </Form>
                </Container>
            </div>
            <ToastContainer/>
        </>
    )
}