import { Button as BootButton, Container } from 'react-bootstrap';
import "./Subscription.css";

export default function Subscription() {
    return (
        <>
            <Container id="Subscriptions">
                <h1>Choose your plan</h1>
                <div>14 days free trial</div>
                <div className="d-flex justify-content-between align-items-baseline">
                    <div>Get the right plan for your business. Plans can be upgraded in the future.</div>
                    <div>
                        <button>Monthly</button>
                        <button>Yearly</button>
                    </div>
                </div>
                <div className='d-flex justify-content-center align-items center'>
                    <div className="cards">
                        <h5>Basic Plan</h5>
                        <div className="price">
                            $4.99
                            <span>/month</span>
                        </div>
                        <ul>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                        <BootButton variant='outline-success' className='text-center' style={{width: "100%"}}>Get Plan</BootButton>
                    </div>
                    <div className="cards">
                        <h5>Standard Plan</h5>
                        <div className="price">
                            $9.99
                            <span>/month</span>
                        </div>
                        <ul>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                        <BootButton variant='success' className='text-center' style={{width: "100%"}}>Get Plan</BootButton>
                    </div>
                    <div className="cards">
                        <h5>Advanced Plan</h5>
                        <div className="price">
                            $19.99
                            <span>/month</span>
                        </div>
                        <ul>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                        <BootButton variant='outline-success' className='text-center' style={{width: "100%"}}>Get Plan</BootButton>
                    </div>
                </div>
            </Container>


        </>
    )
}