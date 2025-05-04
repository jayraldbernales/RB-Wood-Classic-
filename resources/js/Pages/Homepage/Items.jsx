import React, { useState } from "react";
import OrderProductModal from "../modals/OrderProductModal";
import StatusModal from "../modals/StatusModal";

export default function Items({ popularProducts }) {
    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusModalProps, setStatusModalProps] = useState({
        isSuccess: true,
        title: "",
        message: "",
    });

    // Function to show status modal
    const handleShowStatusModal = (isSuccess, title, message) => {
        setStatusModalProps({ isSuccess, title, message });
        setShowStatusModal(true);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    return (
        <div className="col-12 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-light">Popular Products</h3>
            </div>

            <div className="row g-4">
                {popularProducts.length > 0 ? (
                    popularProducts.map((product) => (
                        <div
                            key={product.id}
                            className="col-xl-3 col-lg-4 col-md-6 mb-4"
                            onClick={() => handleProductClick(product)}
                            style={{ cursor: "pointer" }}
                        >
                            <div
                                className="card product-card h-100 border-0 shadow-sm overflow-hidden"
                                style={{ borderRadius: "15px" }}
                            >
                                <div className="product-image-container">
                                    {product.images &&
                                    product.images.length > 0 ? (
                                        <img
                                            src={product.images[0].url}
                                            className="card-img-top"
                                            alt={product.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src =
                                                    "/placeholder-image.jpg";
                                            }}
                                        />
                                    ) : (
                                        <div className="no-image-placeholder">
                                            <i className="bi bi-image text-muted"></i>
                                        </div>
                                    )}
                                </div>
                                <div className="card-body p-3">
                                    <h5 className="card-title mb-1 text-truncate">
                                        {product.name}
                                    </h5>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-secondary fw-bold">
                                            ₱
                                            {typeof product.price === "number"
                                                ? product.price.toLocaleString()
                                                : parseFloat(
                                                      product.price || 0
                                                  ).toLocaleString()}
                                        </span>
                                        <button
                                            className="btn btn-sm rounded-circle btn-dark"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleProductClick(product); // Open modal on button click
                                            }}
                                        >
                                            <i className="bi bi-arrow-right-short"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center py-5">
                        <div className="empty-state bg-white p-4 rounded py-5">
                            <h4 className="mb-2 py-5 text-secondary">
                                No popular products found
                            </h4>
                        </div>
                    </div>
                )}
            </div>

            {selectedProduct && (
                <OrderProductModal
                    key={selectedProduct.id} // Add this line
                    product={selectedProduct}
                    show={showProductModal}
                    onHide={() => {
                        setShowProductModal(false);
                        setSelectedProduct(null); // Also clear the selected product
                    }}
                    showStatusModal={handleShowStatusModal}
                />
            )}
            <StatusModal
                show={showStatusModal}
                onHide={() => setShowStatusModal(false)}
                isSuccess={statusModalProps.isSuccess}
                title={statusModalProps.title}
                message={statusModalProps.message}
            />
        </div>
    );
}
