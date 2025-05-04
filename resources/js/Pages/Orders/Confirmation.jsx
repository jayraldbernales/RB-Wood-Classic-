import React from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import Sidebar from "@/Components/Sidebar";
import LogoutModal from "@/Components/LogoutModal";

const Confirmation = ({ auth, order }) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(true);
    const [showLogoutModal, setShowLogoutModal] = React.useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className={`d-flex ${sidebarOpen ? "sidebar-open" : ""}`}>
            <Head title="Order Confirmation" />

            <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div
                className="content flex-grow-1"
                style={{
                    marginLeft: sidebarOpen ? "220px" : "0",
                    transition: "margin-left 0.3s ease",
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
                    />

                    <div className="container py-5">
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <div className="card shadow-sm border-0">
                                    <div className="card-header bg-white pt-4 border-bottom">
                                        <h2 className="text-center mb-0">
                                            Order Confirmed
                                        </h2>
                                    </div>
                                    <div className="card-body text-center py-5">
                                        <div className="mb-4 d-flex justify-content-center align-items-center">
                                            <svg
                                                width="80"
                                                height="80"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                                                    fill="#28a745"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="mb-3">
                                            Thank you for your order!
                                        </h3>
                                        <p className="text-muted mb-4">
                                            Your order #{order.id} has been
                                            received and is being processed.
                                        </p>

                                        <div className="bg-light p-4 rounded mb-4 text-start">
                                            <h5 className="mb-3">
                                                Order Summary
                                            </h5>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span>Order Number:</span>
                                                <strong>#{order.id}</strong>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span>Date:</span>
                                                <strong>
                                                    {new Date(
                                                        order.created_at
                                                    ).toLocaleDateString()}
                                                </strong>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span>Payment Method:</span>
                                                <strong>
                                                    {order.payment_method ===
                                                    "gcash"
                                                        ? "Gcash"
                                                        : "Pay In-Store"}
                                                </strong>
                                            </div>

                                            {order.payment_method ===
                                            "gcash" ? (
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span>Amount Paid:</span>
                                                    <strong>
                                                        ₱
                                                        {order.down_payment_amount.toLocaleString(
                                                            "en-PH"
                                                        )}
                                                    </strong>
                                                </div>
                                            ) : (
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span>Note:</span>
                                                    <strong>
                                                        Pay within 7 days to
                                                        process your order.
                                                    </strong>
                                                </div>
                                            )}
                                            <div className="d-flex justify-content-between">
                                                <span>Total Order Amount:</span>
                                                <strong>
                                                    ₱
                                                    {order.total_amount.toLocaleString(
                                                        "en-PH"
                                                    )}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-center gap-3">
                                            <Link
                                                href="/orders"
                                                className="btn btn-dark px-4 py-2"
                                            >
                                                View My Orders
                                            </Link>
                                            <Link
                                                href="/products"
                                                className="btn btn-outline-secondary px-4 py-2"
                                            >
                                                Continue Shopping
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <LogoutModal
                    showLogoutModal={showLogoutModal}
                    setShowLogoutModal={setShowLogoutModal}
                />
            </div>
        </div>
    );
};

export default Confirmation;
