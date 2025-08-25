import { useNavigate } from "react-router";
import { useState } from "react";
import "./Nav.css";
import { Container, Navbar, Nav } from 'react-bootstrap';

export default function ToolNav() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <Navbar className="nav-bar" expand="md">
        <Container className="mb-1">
          <Navbar.Brand style={{ color: "#caf0f8" }}>CloudBouncer</Navbar.Brand>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
            <span className={menuOpen ? "hamburger-bar open" : "hamburger-bar"}></span>
            <span className={menuOpen ? "hamburger-bar open" : "hamburger-bar"}></span>
            <span className={menuOpen ? "hamburger-bar open" : "hamburger-bar"}></span>
          </button>
          <Nav className={menuOpen ? "nav-menu open" : "nav-menu"}>
            <Nav.Link className="list-item" href="/">Home</Nav.Link>
            <Nav.Link className="list-item" href="#AboutUs">About Us</Nav.Link>
            <Nav.Link className="list-item" href="#Service">Service</Nav.Link>
            <Nav.Link className="list-item" href="#Contact">Contact Us</Nav.Link>
            <button id="contact-btn" onClick={() => { navigate('/login') }}>Login</button>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}