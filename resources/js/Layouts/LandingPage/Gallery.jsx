import React, { useState, useEffect } from "react";
import "aos/dist/aos.css"; // Import AOS styles
import AOS from "aos"; // Import AOS

// Import Images
const img1 = "/img/products/dining_set/DiningTable3.jpg";
const img2 = "/img/products/dining_set/DiningTable6.jpg";
const img3 = "/img/products/dining_set/DiningTable4.jpg";
const img4 = "/img/products/dining_set/DiningTable1.jpg";
const img5 = "/img/products/dining_set/Diningtable.png";
const img6 = "/img/products/cabinets/Hcabinet.png";

// Images Array
const images = [img1, img2, img3, img4, img5, img6];

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 1000, once: true }); // Initialize AOS
    }, []);

    return (
        <div className="container my-5 py-5 text-center">
            {/* Heading Section */}
            <h5 className="text-uppercase text-danger mb-3" data-aos="fade-up">
                Check Our Collection
            </h5>
            <h2 className="fw-bold display-5 mb-2" data-aos="fade-up">
                Our Furniture Gallery
            </h2>
            <p className="text-secondary fs-5 mb-4" data-aos="fade-up">
                Explore Our Gallery of Inspiring Designs
            </p>

            {/* Gallery Grid */}
            <div className="row g-4 justify-content-center">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="col-lg-4 col-md-6"
                        data-aos="zoom-in"
                    >
                        <div
                            className="gallery-item position-relative rounded-3 overflow-hidden shadow-sm"
                            style={{
                                cursor: "pointer",
                                transition: "transform 0.3s ease",
                            }}
                            onClick={() => setSelectedImage(image)}
                        >
                            <img
                                src={image}
                                alt={`Furniture Design ${index + 1}`}
                                className="img-fluid w-100 rounded-3"
                                style={{ objectFit: "cover", height: "300px" }}
                            />
                            {/* Hover Effect */}
                            <div
                                className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center opacity-0 hover-overlay"
                                style={{
                                    transition: "opacity 0.3s ease",
                                }}
                            >
                                <i className="bi bi-eye-fill text-white fs-1"></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75"
                    style={{ zIndex: 1050 }}
                    onClick={() => setSelectedImage(null)}
                    role="dialog"
                    aria-label="Image Modal"
                >
                    <img
                        src={selectedImage}
                        alt="Selected Furniture Design"
                        className="img-fluid rounded-3 shadow-lg"
                        style={{ maxHeight: "90%", maxWidth: "90%" }}
                    />
                    <button
                        className="btn btn-light position-absolute top-0 end-0 m-3"
                        onClick={() => setSelectedImage(null)}
                        aria-label="Close Modal"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Gallery;
