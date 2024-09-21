import { Container } from "react-bootstrap";
import "./Service.css";
import CardSlider from "./CardSlider";

export default function Service() {
    
    return (
        <>
            <Container id="Service" >
                <h1 className="text-center">Managed Services</h1>
                <p className="text-center " style={{fontSize: "20px"}}>
                    Forward thinking (IT) professionals dedicated to a management, <br />
                    administration and support of your computing environment.
                </p>
                <div className="slider-box">
                    <CardSlider />
                </div>                
            </Container>
        </>
    )
}