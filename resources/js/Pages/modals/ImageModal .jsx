import React from "react";

export default function ImageModal({
    showImageModal,
    setShowImageModal,
    selectedProductImages,
    handleImageChange,
    handleRemoveImage,
}) {
    if (!showImageModal) return null; // Don't render if modal is not shown

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
            onClick={() => setShowImageModal(false)} // Close modal when clicking outside
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
                    textAlign: "center",
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
                    }}
                    onClick={() => setShowImageModal(false)}
                >
                    &times;
                </button>

                {/* Modal Title */}
                <h3>Manage Product Images</h3>

                {/* Image Display Section */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                        justifyContent: "center",
                        marginBottom: "15px",
                    }}
                >
                    {selectedProductImages.map((img, index) => (
                        <div key={index} style={{ position: "relative" }}>
                            <img
                                src={`/storage/${img.image}`}
                                alt={`Product Image ${index + 1}`}
                                style={{
                                    height: "200px",
                                    borderRadius: "5px",
                                    objectFit: "cover",
                                }}
                            />
                            {/* Delete Button */}
                            <button
                                onClick={() => handleRemoveImage(img.id)}
                                style={{
                                    position: "absolute",
                                    top: "5px",
                                    right: "5px",
                                    backgroundColor: "red",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: "25px",
                                    height: "25px",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                }}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>

                {/* Choose New File Section */}
                <div>
                    <label className="btn btn-dark">
                        Choose New File
                        <input
                            type="file"
                            multiple
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />
                    </label>
                </div>
            </div>
        </div>
    );
}
