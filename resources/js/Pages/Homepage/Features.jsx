import React, { useEffect } from "react";
import "aos/dist/aos.css";
import AOS from "aos";

const Features = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <div className="container">
            {/* Heading Section */}
            <div className="row align-items-center px-lg-5">
                <div className="col-lg-6" data-aos="fade-right">
                    <h1 className="fw-bold display-6 mb-1">
                        Style for <br /> Your Space
                    </h1>
                    <p className="text-secondary fs-5">
                        Creating Furniture that Transforms Every Corner
                    </p>
                </div>
                <div className="col-lg-6" data-aos="fade-left">
                    <h2 className="fw-semibold fs-3 text-dark">
                        Elevate your home with elegant and functional furniture,
                        creating a harmonious and sophisticated space.
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default Features;
