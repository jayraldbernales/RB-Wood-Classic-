import React, { useState, useEffect } from "react";
import "aos/dist/aos.css"; // Import AOS styles
import AOS from "aos"; // Import AOS
import Categories from "@/Components/HomeComponents/Categories"; // Import Categories component

const Items = ({ categories, products, activeCategory, setActiveCategory }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 1000, once: true }); // Initialize AOS
    }, []);

    // Filter products based on the active category
    const filteredProducts = activeCategory
        ? products.filter((product) => product.category_id === activeCategory)
        : products;

    return (
        <div className="container text-center">
            {/* Categories Component */}
            <Categories
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
            />

            {/* Gallery Grid */}
            <div className="row g-4 justify-content-center">
                {filteredProducts.map((product, index) => {
                    const imageUrl =
                        product.images && product.images.length > 0
                            ? `/storage/${product.images[0].image}`
                            : "/img/placeholder.jpg"; // Placeholder image path

                    return (
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
                                onClick={() => setSelectedImage(imageUrl)}
                            >
                                <img
                                    src={imageUrl}
                                    alt={product.name}
                                    className="img-fluid w-100 rounded-3"
                                    style={{
                                        objectFit: "cover",
                                        height: "300px",
                                    }}
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
                    );
                })}
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
                        alt="Selected Product Image"
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

export default Items;
