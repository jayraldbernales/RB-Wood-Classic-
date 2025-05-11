import React, { useState } from "react";
import ContactMessagesModal from "./ContactMessagesModal";

const AdminNavbar = ({ toggleSidebar, setShowLogoutModal }) => {
    const [showMessagesModal, setShowMessagesModal] = useState(false);

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
