import React, { useState } from "react";
import { router } from "@inertiajs/react";
import ContactMessagesModal from "./ContactMessagesModal";

const AdminNavbar = ({ toggleSidebar, setShowLogoutModal }) => {
    const [showMessagesModal, setShowMessagesModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        // Redirect to orders page with the search term
        router.get(route("admin.orders"), { search: searchTerm });
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light px-4 py-3 position-absolute top-0 start-0 w-100 custom-navbar">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    {/* Left: Sidebar Toggle & Search */}
                    <div className="d-flex align-items-center gap-3">
                        {/* Sidebar Toggle Button */}
                        <button
                            className="btn p-2"
                            onClick={toggleSidebar}
                            style={{
                                fontSize: "2rem",
                                background: "transparent",
                                border: "none",
                                color: "gray",
                            }}
                        >
                            <i className="bi bi-list"></i>
                        </button>

                        {/* Search Bar */}
                        <form
                            className="position-relative"
                            style={{ maxWidth: "300px", width: "100%" }}
                            onSubmit={handleSearch}
                        >
                            <input
                                type="text"
                                className="form-control bg-light text-dark px-5"
                                placeholder="Search orders..."
                                aria-label="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    paddingLeft: "40px",
                                    height: "40px",
                                    border: "1px solid #ddd",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                }}
                            />
                            <button
                                type="submit"
                                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                                style={{
                                    fontSize: "1.2rem",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                <i className="bi bi-search"></i>
                            </button>
                        </form>
                    </div>

                    {/* Right: Icons & User Menu */}
                    <div className="d-flex align-items-center gap-3">
                        <button
                            className="btn text-dark bg-white mr-2 p-2 position-relative"
                            style={{ fontSize: "1.5rem" }}
                            onClick={() => setShowMessagesModal(true)}
                        >
                            <i className="bi bi-chat-left-text"></i>
                        </button>

                        {/* Profile Dropdown */}
                        <div className="dropdown">
                            <a
                                href="#"
                                className="text-dark"
                                id="accountDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                style={{ fontSize: "1.5rem" }}
                            >
                                <i className="bi bi-person-circle"></i>
                            </a>
                            <ul
                                className="dropdown-menu dropdown-menu-end"
                                aria-labelledby="accountDropdown"
                            >
                                <li>
                                    <a
                                        className="dropdown-item"
                                        href="#"
                                        onClick={() => setShowLogoutModal(true)}
                                    >
                                        <i className="bi bi-box-arrow-right me-2"></i>{" "}
                                        Log Out
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

            <ContactMessagesModal
                show={showMessagesModal}
                onClose={() => setShowMessagesModal(false)}
            />
        </>
    );
};

export default AdminNavbar;
