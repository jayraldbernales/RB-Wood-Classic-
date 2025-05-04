import React, { useState } from "react";

export default function ImageCarouselModal({
    showModal,
    setShowModal,
    images,
}) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track current image index

    // Handle image navigation (next/previous)
    const handleImageNavigation = (direction) => {
        if (direction === "prev") {
            setCurrentImageIndex((prev) =>
                prev > 0 ? prev - 1 : images.length - 1
            );
        } else {
            setCurrentImageIndex((prev) =>
                prev < images.length - 1 ? prev + 1 : 0
            );
        }
    };

    if (!showModal || !images || images.length === 0) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}
            onClick={() => setShowModal(false)} // Close modal when clicking outside
        >
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "20px",
                    borderRadius: "10px",
                    maxWidth: "90%",
                    maxHeight: "90%",
                    overflow: "auto",
                    position: "relative",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
            >
                {/* Close Button */}
                <button
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "transparent",
                        border: "none",
                        fontSize: "30px",
                        cursor: "pointer",
                        color: "#333",
                    }}
                    onClick={() => setShowModal(false)}
                    aria-label="Close modal"
                >
                    &times;
                </button>

                {/* Carousel */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "20px",
                    }}
                >
                    {/* Previous Button */}
                    <button
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                            color: "#fff",
                            border: "none",
                            padding: "10px",
                            borderRadius: "50%",
                            cursor: "pointer",
                        }}
                        onClick={() => handleImageNavigation("prev")}
                        aria-label="Previous image"
                    >
                        &larr;
                    </button>

                    {/* Current Image */}
                    <img
                        src={`/storage/${images[currentImageIndex].image}`}
                        alt={`Product Image ${currentImageIndex + 1}`}
                        style={{
                            maxWidth: "100%",
                            maxHeight: "70vh",
                            borderRadius: "5px",
                        }}
                    />

                    {/* Next Button */}
                    <button
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                            color: "#fff",
                            border: "none",
                            padding: "10px",
                            borderRadius: "50%",
                            cursor: "pointer",
                        }}
                        onClick={() => handleImageNavigation("next")}
                        aria-label="Next image"
                    >
                        &rarr;
                    </button>
                </div>
            </div>
        </div>
    );
}
