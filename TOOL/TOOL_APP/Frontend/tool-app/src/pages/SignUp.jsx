import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Navbar from '../Components/Navbar';
import { validateEmail } from '../utils/utils';
import axiosInstance from '../utils/axiosInstance';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';

export default function Signup() {
    const [info, setInfo] = useState({ fullName: "", email: "", password: "" });

    const [error , setError] = useState(null);

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
                    return;
                }
    
                if (response.data && response.data.accessToken) {
                    localStorage.setItem("token", response.data.accessToken);
                    navigate("/login");
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
            <Container className='login-container p-5 mt-5'>
                <h1 className='text-center mb-5'>SignUp</h1>

                <Container>
                    <Form onSubmit={handleSignUp}> 
                        <Form.Group className="mb-3" controlId="fullName">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter your Full Name" name="fullName" onChange={handleInput} value={info.fullName} required={true} />
                        </Form.Group>


                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" name="email" onChange={handleInput} value={info.email} required={true} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter Password" name="password" onChange={handleInput} value={info.password} required={true} minLength={8} />
                        </Form.Group>
                        <div className='mb-2'>Already registered? Login<Link to="/login"> here</Link></div>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Container>
            </Container>
            <ToastContainer/>
        </>
    )
}