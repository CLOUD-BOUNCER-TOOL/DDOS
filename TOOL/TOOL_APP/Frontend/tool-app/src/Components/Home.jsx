import { Container, Button } from "react-bootstrap"
import cloudImage from "../assets/cloud-security.png";
import "./Home.css";

export default function Home() {
    return (
        <>
            <Container className="d-flex justify-content-around align-items-center mt-4 landing-container">
                <div className="left">
                    <h1 className="landing-heading mb-3">
                        Your Trusted partner in Cyber Security
                    </h1>
                    <p className="mb-4">
                        Welcome to CloudBouncer, your ultimate shield against DDoS attacks. Harnessing the power of cutting-edge AI technology, CloudBouncer provides robust, real-time protection for your web applications. Our intelligent system continuously monitors traffic, identifies threats, and automatically mitigates attacks, ensuring your website remains secure and accessible. With CloudBouncer, experience seamless, worry-free operations and focus on what truly matters – growing your business. Join us today and bounce back from any threat with confidence.</p>
                    <div className="landing-btn">
                        <Button variant="primary" className="me-1 try-btn">Try for free </Button>{' '}
                        <Button variant="outline-primary">Learn More</Button>{' '}
                    </div>
                </div>
                <div className="right">
                    <img src={cloudImage} alt="CloudBouncer" />
                </div>
            </Container>
        </>
    )
}