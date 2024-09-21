import { Container, Button } from "react-bootstrap"
import cloudImage from "../assets/cloud-security.png";
import "./Home.css";

export default function Home(){
    return (
        <>
            <Container className="d-flex justify-content-around align-items-center mt-4 landing-container">
                <div className="left">
                    <h1 className="landing-heading mb-3">
                        Your Trusted partner in Cyber Security
                    </h1>
                    <p className="mb-4">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laudantium obcaecati neque sunt repellendus nulla harum repudiandae accusantium modi, possimus necessitatibus doloribus! Ipsa natus ab aperiam, dicta ratione rerum officia molestias deserunt porro nisi quibusdam libero error eius quos iste ipsum debitis atque aut, blanditiis quidem mollitia? Facilis laboriosam incidunt earum.</p>
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