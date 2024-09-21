import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './CardSlider.css';
import img1 from "../assets/artificial-intelligence.png";
import img2 from "../assets/mitigation.png";
import img3 from "../assets/graph.png";
import img4 from "../assets/traffic.png";
import img5 from "../assets/monitor.png";

const CardSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const cards = [
    {
      title: "AI based threat detetction",
      description: " Our advanced AI model is trained to recognize DDOS attack patterns, enabling rapid detection and immediate response.",
      imgSrc: img1
    },
    {
      title: "Auto Mitigaton",
      description: " Once an attack is detected, our system automatically activates defensive measures, including traffic filtering and load balancing, to ensure your website remains accessible to legitimate users.",
      imgSrc: img2
    },
    {
      title: "Traffic Redirection",
      description: "During an attack, all incoming traffic is routed through our secure filtering system, which uses load balancing to distribute traffic evenly and prevent server overload.",
      imgSrc: img3
    },
    {
      title: "Graphical reports",
      description: " Access visual reports that show traffic patterns, attack timelines, and geographic data to understand the nature and origin of the attack",
      imgSrc: img4
    },
    {
      title: "Real-Time Monitoring",
      description: " Access a secure dashboard where you can view real-time statistics of your website’s traffic and attack status.",
      imgSrc: img5
    },
  ];

  return (
    <div className="card-slider">
      <Slider {...settings}>
        {cards.map((card, index) => (
          <div key={index} className="card">
            <img src={card.imgSrc} alt={card.title} className="card-image" />
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CardSlider;
