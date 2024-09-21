import { Container } from "react-bootstrap";
import aboutImg from "../assets/Team.jpg";
import "./About.css";

export default function AboutUs() {
    return (
        <>
            <Container className="about-container mb-5" id="AboutUs">
                <div className="about-left me-4">
                    <img src={aboutImg} alt="Team Image" id="aboutImg" />
                </div>
                <div className="about-right">
                    <h1 className="text-center mt-2 mb-4" style={{ fontSize: "50px" }}>About us</h1>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt possimus assumenda vero voluptatem qui laudantium quasi eius, iste rerum, esse, recusandae repellat ex itaque molestiae officiis. Quaerat, laudantium cum minima nulla unde tempora excepturi aperiam aut ad fugit voluptas impedit repellendus laboriosam fuga optio explicabo, architecto tenetur, odio debitis quam.</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi quo maxime consequatur eos debitis vitae mollitia cum iste nihil repudiandae odio saepe quis minus, id dicta, aut quam magni aliquam at impedit architecto quidem a adipisci. Adipisci saepe tempora, quaerat minima necessitatibus ad excepturi ipsa sed consequuntur ab amet. Porro!</p>
                </div>
            </Container>
        </>
    )
}