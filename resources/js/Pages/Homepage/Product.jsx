import React, { useEffect, useState } from "react";
import "aos/dist/aos.css";
import Sidebar from "@/Components/Sidebar";
import Navbar from "@/Components/Navbar";
import LogoutModal from "@/Components/LogoutModal";
import { Head, Link, usePage, router } from "@inertiajs/react";
import OrderProductModal from "../modals/OrderProductModal";
import Items from "./Items";
import StatusModal from "../modals/StatusModal";

export default function Product({
    products,
    categories,
    filters,
    popularProducts,
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [activeCategory, setActiveCategory] = useState(
        filters.category || "All"
    );
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

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

    const handleCategoryChange = (categoryName) => {
        const categoryId =
            categoryName === "All"
                ? null
                : categories.find((c) => c.name === categoryName)?.id;

        setActiveCategory(categoryName);
        router.get(
            route("products.index"),
            {
                category: categoryId,
                search: searchTerm,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                route("products.index"),
                {
                    category:
                        activeCategory === "All"
                            ? null
                            : categories.find((c) => c.name === activeCategory)
                                  ?.id,
                    search: searchTerm,
                    page: 1,
                },
                {
                    preserveState: true,
                    replace: true,
                }
            );
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    return (
        <div
            className={`d-flex ${sidebarOpen ? "sidebar-open" : ""}`}
            style={{ overflow: "hidden" }}
        >
            <Head title="Products" />
            <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div
                className="content flex-grow-1"
                style={{
                    marginLeft: sidebarOpen ? "220px" : "0",
                    transition: "margin-left 0.3s ease",
                    backgroundColor: "#F8F9FA",
                    minHeight: "100vh",
                }}
            >
                <div
                    className="position-relative"
                    style={{ paddingTop: "50px" }}
                >
                    <Navbar
                        toggleSidebar={toggleSidebar}
                        setShowLogoutModal={setShowLogoutModal}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />

                    <div
                        className="container px-4 py-5"
                        style={{ maxWidth: "1220px" }}
                    >
                        <div className="row mb-4">
                            <div className="col-12">
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                                    <Items popularProducts={popularProducts} />
                                    {products.meta && (
                                        <div className="badge bg-light text-dark p-3 fs-6">
                                            Showing {products.meta.from}-
                                            {products.meta.to} of{" "}
                                            {products.meta.total} items
                                        </div>
                                    )}
                                </div>

                                {/* Category Filter - Enhanced UI */}
                                <div className="mb-4">
                                    <div
                                        className="d-flex overflow-auto pb-2"
                                        style={{ scrollbarWidth: "thin" }}
                                    >
                                        <div className="d-flex flex-nowrap gap-2 pe-3">
                                            <button
                                                key="all"
                                                className={`btn btn-sm rounded-pill px-4 py-2 fw-bold shadow-sm ${
                                                    activeCategory === "All"
                                                        ? "btn-dark text-white"
                                                        : "btn-outline-dark"
                                                }`}
                                                onClick={() =>
                                                    handleCategoryChange("All")
                                                }
                                            >
                                                All
                                            </button>
                                            {categories.map((category) => (
                                                <button
                                                    key={category.id}
                                                    className={`btn btn-sm rounded-pill px-4 py-2 fw-bold shadow-sm ${
                                                        activeCategory ===
                                                        category.name
                                                            ? "btn-dark text-white"
                                                            : "btn-outline-dark"
                                                    }`}
                                                    onClick={() =>
                                                        handleCategoryChange(
                                                            category.name
                                                        )
                                                    }
                                                >
                                                    {category.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="row g-4" style={{ minHeight: "600px" }}>
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="col-xl-3 col-lg-4 col-md-6 mb-4"
                                        onClick={() =>
                                            handleProductClick(product)
                                        }
                                        style={{ cursor: "pointer" }}
                                    >
                                        <div className="card product-card border-0 shadow-sm overflow-hidden">
                                            <div className="product-image-container">
                                                {product.images &&
                                                product.images.length > 0 ? (
                                                    <img
                                                        src={`/storage/${product.images[0].image}`}
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
                                    <div className="empty-state bg-white p-4 rounded shadow-sm">
                                        <i className="bi bi-search display-4 text-muted mb-3"></i>
                                        <h4 className="mb-2">
                                            No products found
                                        </h4>
                                        <p className="text-muted mb-4">
                                            Try adjusting your search or filter
                                            criteria
                                        </p>
                                    </div>
                                </div>
                            )}
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
