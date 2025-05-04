import React from "react";
import CustomBlackButton from "./CustomBlackButton";

const SecondNavbar = ({ onLogoutClick, toggleSidebar, sidebarOpen }) => {
    return (
        <nav
            className="navbar navbar-expand-lg navbar-light px-4 py-3 fixed-top w-100 fade-down"
            style={{
                zIndex: 1000,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                marginLeft: sidebarOpen ? "250px" : "0", // Adjust margin-left based on sidebar state
                maxWidth: sidebarOpen ? "calc(100% - 250px)" : "100%", // Constrain width when sidebar is open
                transition: "margin-left 0.3s ease, max-width 0.3s ease", // Smooth transition
            }}
        >
            <div className="container-fluid">
                <div className="d-flex align-items-center">
                    {/* Hamburger Menu Button */}
                    <button
                        className="btn text-black"
                        onClick={toggleSidebar}
                        style={{
                            width: "70px",
                            height: "70px",
                            fontSize: "2rem",
                        }}
                    >
                        <i className="bi bi-list"></i>
                    </button>

                    {/* Custom Buttons */}
                    <CustomBlackButton text="Home" variant="filled" />
                    <CustomBlackButton text="Products" variant="outline" />
                    <CustomBlackButton text="Contacts" variant="outline" />
                </div>
                <div className="ms-auto d-flex align-items-center">
                    {/* Search Bar */}
                    <div className="mx-auto max-w-md w-full">
                        <form className="relative">
                            <input
                                type="text"
                                className="w-full border border-gray-300 bg-transparent text-black placeholder-gray-500 px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                placeholder="Search..."
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                <i className="bi bi-search"></i>
                            </button>
                        </form>
                    </div>

                    {/* Cart Button */}
                    <button
                        className="btn ml-3 mr-3 text-gray-500"
                        style={{
                            width: "70px",
                            height: "70px",
                            fontSize: "1.5rem",
                        }}
                    >
                        <i className="bi bi-cart-plus"></i>
                    </button>

                    {/* Account Dropdown */}
                    <div className="dropdown">
                        <a
                            href="#"
                            className="text-gray-500"
                            style={{ fontSize: "1.5rem" }}
                            id="accountDropdown2"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="bi bi-person-circle"></i>
                        </a>
                        <ul
                            className="dropdown-menu dropdown-menu-end"
                            aria-labelledby="accountDropdown2"
                        >
                            <li>
                                <a
                                    className="dropdown-item"
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                    }}
                                >
                                    <i className="bi bi-person me-2"></i>
                                    Profile
                                </a>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <a
                                    className="dropdown-item"
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                    }}
                                >
                                    <i className="bi bi-cart4 me-2"></i>
                                    Orders
                                </a>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <a
                                    className="dropdown-item"
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onLogoutClick(); // Trigger logout modal
                                    }}
                                >
                                    <i className="bi bi-box-arrow-right me-2"></i>
                                    Log Out
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default SecondNavbar;
