import React from "react";
import { Link, usePage } from "@inertiajs/react"; // Import usePage

const Sidebar = ({ sidebarOpen }) => {
    const page = usePage();
    const url = page?.url || "";


    return (
        <div
            className={`sidebar bg-white text-dark d-flex flex-column p-4 shadow-lg ${
                sidebarOpen ? "open" : ""
            }`}
            style={{
                width: "240px",
                height: "100vh",
                position: "fixed",
                left: sidebarOpen ? "0" : "-280px",
                transition: "left 0.3s ease",
                overflowY: "auto",
                boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
            }}
        >
            {/* Logo Section */}
            <div className="d-flex align-items-center justify-content-center text-center w-100">
                <h2
                    className="text-dark"
                    style={{
                        fontFamily: "'Bowlby One SC', sans-serif", // Apply Bowlby One SC font
                        fontSize: "2rem", // Adjust font size
                        textAlign: "center", // Ensure text is centered
                        letterSpacing: "1px", // Add slight spacing
                        textTransform: "uppercase", // Uppercase for emphasis
                        width: "100%", // Ensure full width for centering
                    }}
                >
                    RB Wood Classic
                </h2>
            </div>

            {/* Divider */}
            <hr className="bg-secondary my-4" />

            {/* Navigation Links */}
            <ul className="flex-grow-1 list-unstyled">
                {[
                    {
                        icon: "bi-house-door",
                        text: "Overview",
                        route: "/overview",
                    },
                    { icon: "bi-bag", text: "Products", route: "/products" },
                    { icon: "bi-cart", text: "Orders", route: "/orders" },
                    { icon: "bi-gear", text: "Settings", route: "/settings" },
                ].map((item, index) => (
                    <li key={index} className="mb-2">
                        <Link
                            href={item.route}
                            className={`d-flex align-items-center text-decoration-none p-2 rounded ${
                                (url === "/" && item.route === "/overview") ||
                                (url === "/home" &&
                                    item.route === "/overview") ||
                                url.startsWith(item.route)
                                    ? "bg-dark text-white" // Active link
                                    : "text-secondary hover-effect"
                            }`}
                            style={{
                                transition: "all 0.2s ease",
                            }}
                        >
                            <i
                                className={`bi ${item.icon} me-3`}
                                style={{ fontSize: "1.2rem" }}
                            ></i>
                            <span className="fw-semibold">{item.text}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Call-To-Action (CTA) */}
            <div
                className="p-4 rounded shadow-sm text-center text-white mt-4"
                style={{
                    background: "linear-gradient(135deg, #c9a66b, #a07e45)",
                }}
            >
                <h5 className="fw-bold mb-2">
                    Fill your room with our products
                </h5>
                <button className="btn btn-light fw-semibold">
                    Explore Now
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
