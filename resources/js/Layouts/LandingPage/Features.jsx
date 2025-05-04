import React, { useEffect } from "react";
import "aos/dist/aos.css";
import AOS from "aos";
const customizationImage = "/img/features/customization.jpg";
const modularityImage = "/img/features/modularity.gif";
const qualityImage = "/img/features/quality.jpg";

// Reusable FeatureCard Component
const FeatureCard = ({ image, title, description, aosEffect }) => {
    return (
        <div className="col-lg-3" data-aos={aosEffect}>
            <div
                className="card border-0 rounded-4 shadow-lg position-relative overflow-hidden"
                style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "450px",
                    borderRadius: "20px",
                }}
                role="img"
                aria-label={title}
            >
                <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                ></div>
                <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
                    <h3 className="fw-bold fs-1">{title}</h3>
                    <p className="fs-5 px-4" style={{ maxWidth: "320px" }}>
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};

const Features = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <div className="container my-5">
            {/* Heading Section */}
            <div className="row align-items-center py-5 px-lg-5">
                <div className="col-lg-6" data-aos="fade-right">
                    <h1 className="fw-bold display-4 mb-4">
                        Style for <br /> Your Space
                    </h1>
                    <p className="text-secondary fs-5">
                        Creating Furniture that Transforms Every Corner
                    </p>
                </div>
                <div className="col-lg-6" data-aos="fade-left">
                    <h2 className="fw-semibold fs-2 text-dark">
                        Elevate your home with elegant and functional furniture,
                        creating a harmonious and sophisticated space.
                    </h2>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="row g-4">
                {/* First card - WIDER (col-lg-6) */}
                <div className="col-lg-6" data-aos="zoom-in">
                    <div
                        className="card border-0 rounded-4 shadow-lg position-relative overflow-hidden"
                        style={{
                            backgroundImage: `url(${customizationImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            minHeight: "450px",
                            borderRadius: "20px",
                        }}
                        role="img"
                        aria-label="Customization"
                    >
                        <div
                            className="position-absolute top-0 start-0 w-100 h-100"
                            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                        ></div>
                        <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
                            <h3 className="fw-bold fs-1">Customization</h3>
                            <p
                                className="fs-5 px-4"
                                style={{ maxWidth: "500px" }}
                            >
                                Tailor your furniture to match your style with
                                our customizable designs.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Other two cards - EQUAL (col-lg-3 each) */}
                <FeatureCard
                    image={modularityImage}
                    title="Modularity"
                    description="Versatile and adaptable pieces designed to fit any space."
                    aosEffect="zoom-in"
                />
                <FeatureCard
                    image={qualityImage}
                    title="Quality"
                    description="Crafted with premium materials and expert craftsmanship."
                    aosEffect="zoom-in"
                />
            </div>
        </div>
    );
};

export default Features;
