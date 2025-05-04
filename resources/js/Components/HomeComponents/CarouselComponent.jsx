import React from "react";

export default function CarouselComponent() {
    const slides = [
        {
            title: "Office Furniture",
            description: "Modern and ergonomic office setups.",
        },
        {
            title: "Kitchen Essentials",
            description: "Stylish and practical kitchen furniture.",
        },
        {
            title: "Dining Room",
            description: "Elegant and comfortable dining sets.",
        },
    ];

    return (
        <div
            id="carouselExampleCaptions"
            className="carousel slide"
            data-bs-ride="carousel"
        >
            {/* Carousel Indicators */}
            <div className="carousel-indicators">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide-to={index}
                        className={index === 0 ? "active" : ""}
                        aria-label={`Slide ${index + 1}`}
                        style={{ backgroundColor: "black" }}
                    ></button>
                ))}
            </div>

            {/* Carousel Slides */}
            <div className="carousel-inner">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`carousel-item ${
                            index === 0 ? "active" : ""
                        }`}
                        style={{ height: "200px", backgroundColor: "#f8f9fa" }}
                    >
                        <div className="d-flex align-items-center justify-content-center h-100">
                            <div className="text-center text-dark">
                                <h5 className="fw-bold">{slide.title}</h5>
                                <p className="m-0">{slide.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Carousel Controls */}
            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide="prev"
            >
                <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                    style={{ filter: "invert(1)" }}
                ></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide="next"
            >
                <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                    style={{ filter: "invert(1)" }}
                ></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
}
