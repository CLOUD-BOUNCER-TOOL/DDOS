import { useNavigate } from "react-router";
import "./Nav.css";
import { Container, Navbar, Nav } from 'react-bootstrap';

export default function ToolNav() {
  const navigate = useNavigate();
  return (
    <>
    <Navbar className="nav-bar">
      <Container className="mb-1">
        <Navbar.Brand style={{ color: "#caf0f8" }}>CloudBouncer</Navbar.Brand>
        <Nav className="justify-content-center flex-grow-1">
          <div>
            <Nav.Link className="list-item" href="/">Home</Nav.Link>
          </div>
          <div>
            <Nav.Link className="list-item" href="#AboutUs">About Us</Nav.Link>
          </div>
          <div>
            <Nav.Link className="list-item" href="#Service">Service</Nav.Link>
          </div>
          <div>
            <Nav.Link className="list-item" href="#Contact">Contact Us</Nav.Link>
          </div>
          {/* <div>
            <Nav.Link className="list-item" href="#Subscription">Subscription Plans</Nav.Link>
          </div> */}
        </Nav>
        <button id="contact-btn" onClick={() => { navigate('/login') }}>Login</button>
      </Container>
    </Navbar>
    </>
  );
}