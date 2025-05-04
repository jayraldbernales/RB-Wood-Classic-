import React from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import Sidebar from "@/Components/Sidebar";
import LogoutModal from "@/Components/LogoutModal";

const Failed = ({ auth, order }) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(true);
    const [showLogoutModal, setShowLogoutModal] = React.useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className={`d-flex ${sidebarOpen ? "sidebar-open" : ""}`}>
            <Head title="Payment Failed" />

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
                                            Payment Failed
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
                                                    d="M12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12C22 6.47 17.53 2 12 2ZM17 15.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12L17 15.59Z"
                                                    fill="#dc3545"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="mb-3">
                                            We couldn't process your payment
                                        </h3>
                                        <p className="text-muted mb-4">
                                            Your order #{order?.id} was not
                                            completed due to a payment issue.
                                        </p>

                                        <div className="alert alert-warning text-start">
                                            <h6 className="alert-heading">
                                                What to do next?
                                            </h6>
                                            <ul className="mb-0">
                                                <li>
                                                    Try again with a different
                                                    payment method
                                                </li>
                                                <li>
                                                    Check your payment account
                                                    for any issues
                                                </li>
                                                <li>
                                                    Contact support if the
                                                    problem persists
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="d-flex justify-content-center gap-3 mt-4">
                                            <Link
                                                href="/orders"
                                                className="btn btn-outline-secondary px-4 py-2"
                                            >
                                                View My Orders
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

export default Failed;
