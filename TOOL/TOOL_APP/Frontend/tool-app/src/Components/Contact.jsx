import { Container } from "react-bootstrap";
import "./Contact.css";
import CallIcon from '@mui/icons-material/Call';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';

export default function ContactUs() {
    return (
        <>
            <Container id="Contact">
                <div>
                    <h1 className="text-center contact-heading">Contact Us Today</h1>
                    <div className="d-flex align-items-center">
                        <button className="contact-btn ms-3 me-4">Let's Get Started</button>
                        <button className="contact-btn "><CallIcon />+000000000</button>
                    </div>
                </div>
            </Container>
            <Container className="d-flex justify-content-evenly align-items-center info-container">
                <div className="d-flex align-items-center">
                    <div className="contact-icon"><CallIcon style={{ fontSize: 50, color: "#fff" }} /></div>
                    <div className="contact-info">
                        Address <br />
                        Delhi
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    <div className="contact-icon"><LocationOnIcon style={{ fontSize: 50, color: "#fff" }} /></div>
                    <div className="contact-info">
                        Call us on: <br />
                        +0000000000
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    <div className="contact-icon"><EmailIcon style={{ fontSize: 50, color: "#fff" }} /></div>
                    <div className="contact-info">
                        Email on: <br />
                        <a href="mailto:contact@cloudbouncer.com">contact@cloudbouncer.com</a>
                    </div>
                </div>
            </Container>
        </>
    )
}