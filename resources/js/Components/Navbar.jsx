import { Link, router } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CartModal from "@/Pages/modals/CartModal";

const Navbar = ({
    toggleSidebar,
    setShowLogoutModal,
    searchTerm: initialSearchTerm = "",
    setSearchTerm: externalSetSearchTerm,
}) => {
    const [showCartModal, setShowCartModal] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [localSearchTerm, setLocalSearchTerm] = useState(initialSearchTerm);

    // Handle search submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Redirect to products page with search term
        router.get(route("products.index"), { search: localSearchTerm });
    };

    // Fetch Cart Items on Mount & Update
    const fetchCartItems = async () => {
        try {
            const response = await axios.get(route("cart.index"));
            setCartItems(response.data || []);
        } catch (error) {
            console.error("Error fetching cart items:", error);
            setCartItems([]);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    // Sync local search term with parent component if on products page
    useEffect(() => {
        if (externalSetSearchTerm) {
            externalSetSearchTerm(localSearchTerm);
        }
    }, [localSearchTerm, externalSetSearchTerm]);

    const handleRemoveItem = async (cartItemId) => {
        try {
            await axios.delete(route("cart.destroy", { id: cartItemId }));
            fetchCartItems();
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const handleCartClick = () => {
        setShowCartModal(true);
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

                        {/* Search Form */}
                        <form
                            onSubmit={handleSearchSubmit}
                            className="position-relative"
                            style={{ maxWidth: "300px", width: "100%" }}
                        >
                            <input
                                type="text"
                                className="form-control bg-light text-dark px-5"
                                placeholder="Search products..."
                                aria-label="Search"
                                value={localSearchTerm}
                                onChange={(e) =>
                                    setLocalSearchTerm(e.target.value)
                                }
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
                        {/* Cart Button */}
                        <button
                            className="btn text-dark bg-white p-2 position-relative"
                            style={{ fontSize: "1.5rem" }}
                            onClick={handleCartClick}
                        >
                            <i className="bi bi-cart-plus"></i>
                            {cartItems.length > 0 && (
                                <span
                                    className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger p-1"
                                    style={{
                                        fontSize: "0.6rem",
                                        width: "18px",
                                        height: "18px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {cartItems.length}
                                </span>
                            )}
                        </button>

                        <a
                            href="https://m.me/647746091735906"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button
                                className="btn text-dark bg-white mr-2 p-2"
                                style={{ fontSize: "1.5rem" }}
                            >
                                <i className="bi bi-messenger"></i>
                            </button>
                        </a>

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
                                    <Link
                                        className="dropdown-item"
                                        href={route("settings.edit")}
                                    >
                                        <i className="bi bi-person me-2"></i>{" "}
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
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

            {/* Cart Modal */}
            <CartModal
                show={showCartModal}
                onHide={() => setShowCartModal(false)}
                cartItems={cartItems}
                onRemoveItem={handleRemoveItem}
                onCartUpdate={fetchCartItems}
            />
        </>
    );
};

export default Navbar;
