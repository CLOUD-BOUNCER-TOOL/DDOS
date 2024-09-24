import { Container } from "react-bootstrap";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import "./Footer.css";

export default function Footer() {
    return (
        <>
            <div id="footer">
                <Container fluid className="p-5 d-flex justify-content-evenly" >
                    <div className="logo">
                        <h3>CloudBouncer</h3>
                        <div className="d-flex justify-content-evenly ">
                            <li><a href="#"></a><FacebookIcon /></li>
                            <li><a href="#"></a><InstagramIcon /></li>
                            <li><a href="#"></a><XIcon /></li>
                            <li><a href="#"></a><LinkedInIcon /></li>
                            <li><a href="#"></a><YouTubeIcon /></li>
                            <li><a href="#"></a><WhatsAppIcon /></li>
                        </div>
                    </div>
                    <div className="d-flex">
                        <div className="footer-links">
                            <ul>
                                <li className="footer-links-li">Useful Links</li>
                                <li><a href="/">Home</a></li>
                                <li><a href="#AboutUs">About Us</a></li>
                                <li><a href="#Service">Services</a></li>
                                {/* <li><a href="#Subscriptions">Subscriptions</a></li> */}
                                <li><a href="#Contact">Contact Us</a></li>
                            </ul>
                        </div>
                        <div className="footer-links" style={{ width: "240px" }}>
                            <ul>
                                <li className="footer-links-li">Services</li>
                                <li><a href="#Service">Real Time Monitoring</a></li>
                                <li><a href="#Service">Automated Mitigation</a></li>
                                <li><a href="#Service">Traffic Redirection</a></li>
                                <li><a href="#Service">Comprehensice Logs</a></li>
                                <li><a href="#Service">Manual IP Whitelisting</a></li>
                                <li><a href="#Service">Alert Notifications</a></li>
                            </ul>
                        </div>
                    </div>
                </Container >
                <hr style={{ color: "#fff" }} />
                <div className="d-flex justify-content-center pb-3">
                    &copy;&nbsp;CloudBouncer. All rights reserved.
                </div>
            </div>

        </>
    )
}