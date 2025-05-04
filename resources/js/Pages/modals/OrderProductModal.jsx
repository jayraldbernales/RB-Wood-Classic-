import React, { useState, useEffect } from "react";
import { Modal, Carousel } from "react-bootstrap";
import { useForm, Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import StatusModal from "../modals/StatusModal"; // Make sure to import your StatusModal component

const OrderProductModal = ({ product, show, onHide, showStatusModal }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [action, setAction] = useState(null); // 'cart' or 'order'
    const [statusModalData, setStatusModalData] = useState({
        show: false,
        isSuccess: false,
        title: "",
        message: "",
    });

    const { post, processing, setData, recentlySuccessful } = useForm({
        product_id: product.id,
        quantity: quantity,
        action: null,
    });

    useEffect(() => {
        setData("quantity", quantity);
    }, [quantity]);

    useEffect(() => {
        return () => {
            // Cleanup when component unmounts
            setQuantity(1);
            setAction(null);
            setActiveIndex(0);
        };
    }, []);

    const handleSelect = (selectedIndex) => setActiveIndex(selectedIndex);

    const handleAction = (actionType) => {
        const routeToPost = actionType === "cart" ? "/cart" : "/orders/store";

        router.post(
            routeToPost,
            { product_id: product.id, quantity: quantity },
            {
                preserveScroll: true,
                onSuccess: () => {
                    onHide();
                    // Optionally, you can show the modal after a short delay
                    setTimeout(() => {
                        if (actionType === "cart") {
                            showStatusModal(
                                true,
                                "Success!",
                                "Item added to cart successfully!"
                            );
                        }
                    }, 100); // Adjust the delay as needed

                    setTimeout(() => {
                        window.location.reload();
                    }, 200);
                },
                onError: () => {
                    showStatusModal(
                        false,
                        "Error!",
                        "Failed to add item to cart. Please try again."
                    );
                },
            }
        );
    };

    const getImageSource = (image) => {
        if (image.url) return image.url;
        if (image.image) return `/storage/${image.image}`;
        return "/placeholder-image.jpg";
    };

    const incrementQuantity = () =>
        setQuantity((prev) => Math.min(20, prev + 1));
    const decrementQuantity = () =>
        setQuantity((prev) => Math.max(1, prev - 1));

    return (
        <>
            {/* Status Modal */}
            <StatusModal
                show={statusModalData.show}
                onHide={() =>
                    setStatusModalData((prev) => ({ ...prev, show: false }))
                }
                isSuccess={statusModalData.isSuccess}
                title={statusModalData.title}
                message={statusModalData.message}
            />

            {/* Product Modal */}
            <Modal show={show} onHide={onHide} size="lg" centered>
                <Modal.Body className="p-4">
                    <div className="row g-4 align-items-center">
                        {/* Image Section */}
                        <div className="col-md-6">
                            <div className="p-3 bg-white shadow-sm rounded">
                                {product.images?.length > 0 ? (
                                    <Carousel
                                        activeIndex={activeIndex}
                                        onSelect={handleSelect}
                                        interval={null}
                                        className="rounded"
                                        prevIcon={
                                            <span
                                                className="text-secondary"
                                                style={{ fontSize: "2rem" }}
                                            >
                                                ‹
                                            </span>
                                        }
                                        nextIcon={
                                            <span
                                                className="text-secondary"
                                                style={{ fontSize: "2rem" }}
                                            >
                                                ›
                                            </span>
                                        }
                                    >
                                        {product.images?.map((image, index) => (
                                            <Carousel.Item key={index}>
                                                <img
                                                    className="d-block w-100 rounded"
                                                    src={getImageSource(image)}
                                                    alt={`${product.name} - ${
                                                        index + 1
                                                    }`}
                                                    style={{
                                                        height: "380px",
                                                        objectFit: "cover",
                                                    }}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src =
                                                            "/placeholder-image.jpg";
                                                    }}
                                                />
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                ) : (
                                    <div
                                        className="d-flex align-items-center justify-content-center bg-light rounded"
                                        style={{ height: "380px" }}
                                    >
                                        <span>No Image Available</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Details Section */}
                        <div className="col-md-6 d-flex flex-column">
                            {/* Product Info */}
                            <div className="flex-grow-1">
                                <h2 className="fw-bold text-dark mb-3">
                                    {product.name}
                                </h2>

                                <div className="mb-4">
                                    <h3 className="text-dark mb-0">
                                        ₱
                                        {Number(product.price).toLocaleString(
                                            "en-PH"
                                        )}
                                    </h3>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold d-block mb-2">
                                        Description
                                    </label>
                                    {product.description && (
                                        <p className="text-muted mb-0">
                                            {product.description}
                                        </p>
                                    )}
                                </div>

                                {product.dimensions && (
                                    <div className="mb-4">
                                        <h6 className="fw-semibold text-secondary mb-2">
                                            Dimensions
                                        </h6>
                                        <p className="text-dark mb-0">
                                            {product.dimensions}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Quantity Selector - Compact Version */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary d-block mb-1 small">
                                    Quantity
                                </label>
                                <div
                                    className="d-flex align-items-center"
                                    style={{ maxWidth: "120px" }}
                                >
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary px-2 py-1"
                                        onClick={decrementQuantity}
                                        disabled={quantity <= 1}
                                        style={{ minWidth: "32px" }}
                                    >
                                        <i className="bi bi-dash-lg"></i>
                                    </button>
                                    <input
                                        type="text"
                                        className="form-control text-center mx-1 py-1"
                                        value={quantity}
                                        readOnly
                                        style={{
                                            width: "40px",
                                            borderRadius: "6px",
                                            fontWeight: "bold",
                                            fontSize: "0.9rem",
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary px-2 py-1"
                                        onClick={incrementQuantity}
                                        disabled={quantity >= 20}
                                        style={{ minWidth: "32px" }}
                                    >
                                        <i className="bi bi-plus-lg"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex gap-3 mb-3">
                                <button
                                    className="btn btn-outline-dark flex-grow-1 py-3"
                                    onClick={() => handleAction("cart")}
                                    disabled={processing && action === "cart"}
                                >
                                    {processing && action === "cart" ? (
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                    ) : (
                                        <i className="bi bi-cart-plus me-2"></i>
                                    )}
                                    {processing && action === "cart"
                                        ? "Adding..."
                                        : "Add to Cart"}
                                </button>

                                <button
                                    className="btn btn-dark flex-grow-1 py-3"
                                    onClick={() => {
                                        router.visit(
                                            route("checkout.product.show", {
                                                product: product.id,
                                                quantity: quantity,
                                            })
                                        );
                                    }}
                                >
                                    <i className="bi bi-bag-check me-2"></i>
                                    Place Order
                                </button>
                            </div>

                            {/* Inquiry Link */}
                            <div className="text-center">
                                <small className="text-muted">
                                    Have questions?{" "}
                                    <a
                                        href="https://m.me/647746091735906"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-secondary fw-bold"
                                    >
                                        Message us
                                    </a>
                                </small>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default OrderProductModal;
