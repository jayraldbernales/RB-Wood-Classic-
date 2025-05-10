import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Sidebar from "@/Components/Sidebar";
import Navbar from "@/Components/Navbar";
import LogoutModal from "@/Components/LogoutModal";
import { Link } from "@inertiajs/react";
import OrderProductModal from "../modals/OrderProductModal";
import StatusModal from "../modals/StatusModal";

export default function HeroSection({ popularProducts }) {
    useEffect(() => {
        AOS.init({
            once: true,
            duration: 1000,
            easing: "ease-in-out",
        });
    }, []);

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
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

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    return (
        <div
            className={`d-flex ${sidebarOpen ? "sidebar-open" : ""}`}
            style={{ overflow: "hidden" }}
        >
 

            {/* Main Content */}
            <div
                className="content flex-grow-1"
                style={{
                    marginLeft: sidebarOpen ? "220px" : "0",
                    transition: "margin-left 0.3s ease",
                    backgroundColor: "#F8F9FA",
                }}
            >
                {/* Hero Section */}
                <div
                    className="position-relative min-vh-100 d-flex align-items-center"
                    style={{ paddingTop: "50px" }}
                >
                    {/* Navbar */}
                    <Navbar
                        toggleSidebar={toggleSidebar}
                        setShowLogoutModal={setShowLogoutModal}
                        searchTerm=""
                        setSearchTerm={() => {}}
                    />

                    {/* Container */}
                    <div
                        className="container px-4 mt-4"
                        style={{ maxWidth: "1220px" }}
                    >
                        <div className="row">
                            {/* Left Section */}
                            <div
                                className="col-lg-8 d-flex p-3 flex-column justify-content-center"
                                style={{ height: "300px" }}
                            >
                                <div
                                    className="position-relative rounded-4 shadow-lg overflow-hidden"
                                    style={{ width: "100%", height: "100%" }}
                                >
                                    {/* Background Image */}
                                    <img
                                        src="/img/image.png"
                                        className="w-100 h-100 rounded img-fluid"
                                        alt="Furniture"
                                        style={{ objectFit: "cover" }}
                                    />

                                    {/* Curved White Text Box */}
                                    <div
                                        className="position-absolute top-0 end-0 p-3"
                                        style={{
                                            background: "white",
                                            borderRadius: "0 0 0 30px",
                                            boxShadow:
                                                "0 5px 15px rgba(0,0,0,0.1)",
                                        }}
                                    >
                                        <h5 className="text-dark fw-light m-0">
                                            Furniture for your home
                                        </h5>
                                        <h3 className="text-dark fw-bold m-0">
                                            Free Delivery
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            {/* Right Section */}
                            <div className="col-lg-4 d-flex justify-content-center">
                                <div
                                    className="bg-light p-4 rounded-4 mt-3 shadow-lg d-flex flex-column justify-content-center align-items-center"
                                    style={{ width: "100%", height: "270px" }}
                                >
                                    <h3 className="fw-bold text-dark text-center mb-3">
                                        Built to Fit
                                    </h3>
                                    <p className="text-muted text-center mb-4">
                                        To achieve a perfect furniture fit, we
                                        offer accurate in-home measurement
                                        services.
                                    </p>
                                    <a
                                        href="https://m.me/647746091735906"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-dark px-4 py-2"
                                    >
                                        Schedule now
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Popular Products Section - Matching Items component */}
                        <div className="col-12 mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h3 className="fw-light">Popular Products</h3>
                                <Link
                                    href="/products"
                                    className="btn btn-link text-secondary fw-semibold"
                                    style={{ textDecoration: "none" }}
                                >
                                    View More →
                                </Link>
                            </div>

                            <div className="row g-4" data-aos="fade-up">
                                {popularProducts &&
                                popularProducts.length > 0 ? (
                                    popularProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="col-xl-3 col-lg-4 col-md-6"
                                            onClick={() =>
                                                handleProductClick(product)
                                            }
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div
                                                className="card product-card h-100 border-0 shadow-sm overflow-hidden"
                                                style={{ borderRadius: "15px" }}
                                            >
                                                <div className="product-image-container">
                                                    {product.images &&
                                                    product.images.length >
                                                        0 ? (
                                                        <img
                                                            src={
                                                                product
                                                                    .images[0]
                                                                    .url
                                                            }
                                                            className="card-img-top"
                                                            alt={product.name}
                                                            onError={(e) => {
                                                                e.target.onerror =
                                                                    null;
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
                                                            {typeof product.price ===
                                                            "number"
                                                                ? product.price.toLocaleString()
                                                                : parseFloat(
                                                                      product.price ||
                                                                          0
                                                                  ).toLocaleString()}
                                                        </span>
                                                        <button
                                                            className="btn btn-sm rounded-circle btn-dark"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleProductClick(
                                                                    product
                                                                ); // Open modal on button click
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
                                            <h4 className="py-5 text-secondary">
                                                No popular products found
                                            </h4>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Modal */}
            {selectedProduct && (
                <OrderProductModal
                    key={selectedProduct.id}
                    product={selectedProduct}
                    show={showProductModal}
                    onHide={() => {
                        setShowProductModal(false);
                        setSelectedProduct(null);
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

            {/* Logout Modal */}
            <LogoutModal
                showLogoutModal={showLogoutModal}
                setShowLogoutModal={setShowLogoutModal}
            />
        </div>
    );
}
