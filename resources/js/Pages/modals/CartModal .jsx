import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";

const CartModal = ({ show, onHide, cartItems, onRemoveItem }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [removingItem, setRemovingItem] = useState(null);
    const [visibleItems, setVisibleItems] = useState(cartItems);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    useEffect(() => {
        setSelectedItems(cartItems.map((item) => item.id));
        setQuantities(
            cartItems.reduce(
                (acc, item) => ({ ...acc, [item.id]: item.quantity || 1 }),
                {}
            )
        );
        setVisibleItems(cartItems);
    }, [cartItems]);

    const toggleSelection = (id) => {
        setSelectedItems((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((itemId) => itemId !== id)
                : [...prevSelected, id]
        );
    };

    const getProductImage = (product) => {
        if (product.images?.length > 0) {
            return (
                product.images[0].url || `/storage/${product.images[0].image}`
            );
        }
        return "/placeholder-image.jpg";
    };

    const selectedCartItems = visibleItems.filter((item) =>
        selectedItems.includes(item.id)
    );

    const calculateSubtotal = () => {
        return selectedCartItems.reduce((sum, item) => {
            const price = item.product?.price || 0;
            const quantity = quantities[item.id] || 1;
            return sum + price * quantity;
        }, 0);
    };

    // Add this function to your CartModal component
    const saveQuantity = async (itemId, quantity) => {
        try {
            await axios.patch(route("cart.update", itemId), { quantity });
            // Optionally show success feedback
        } catch (error) {
            console.error("Failed to update quantity:", error);
            // Optionally show error feedback
        }
    };

    // Modify the handleQuantityChange function to save changes
    const handleQuantityChange = (id, amount) => {
        setQuantities((prev) => {
            const newQuantity = Math.max(1, (prev[id] || 1) + amount);
            saveQuantity(id, newQuantity); // Save to backend
            return { ...prev, [id]: newQuantity };
        });
    };

    const handleRemove = (id) => {
        setRemovingItem(id);
        setTimeout(() => {
            setVisibleItems((prev) => prev.filter((item) => item.id !== id));
            onRemoveItem(id);
            setRemovingItem(null);
        }, 300); // Match animation duration
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            size="lg"
            className="cart-modal"
        >
            <Modal.Header closeButton className="border-bottom-0 bg-light">
                <Modal.Title className="fw-bold fs-5">
                    <i className="bi bi-cart3 me-2"></i>
                    Your Shopping Cart
                </Modal.Title>
            </Modal.Header>

            <Modal.Body
                className="p-0 d-flex flex-column"
                style={{
                    maxHeight: "70vh",
                    minHeight: "200px",
                    overflow: "hidden",
                }}
            >
                {visibleItems.length === 0 ? (
                    <div className="text-center py-5 d-flex flex-column align-items-center justify-content-center">
                        <i className="bi bi-cart-x fs-1 text-muted mb-3"></i>
                        <h5 className="mb-4">Your cart is empty</h5>
                        <Link
                            href="/products"
                            className="btn btn-dark px-4 py-2"
                            onClick={onHide}
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        <div
                            className="cart-items-scrollable px-3 pt-3"
                            style={{
                                flex: 1,
                                overflowY: "auto",
                            }}
                        >
                            {visibleItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={`cart-item d-flex align-items-center mb-3 p-3 rounded ${
                                        removingItem === item.id
                                            ? "removing"
                                            : ""
                                    }`}
                                    style={{
                                        backgroundColor: "#f8f9fa",
                                        border: "1px solid #dee2e6",
                                        minHeight: "100px",
                                    }}
                                >
                                    <div className="form-check custom-checkbox-dark me-3">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={selectedItems.includes(
                                                item.id
                                            )}
                                            onChange={() =>
                                                toggleSelection(item.id)
                                            }
                                            id={`cart-item-${item.id}`}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor={`cart-item-${item.id}`}
                                        ></label>
                                    </div>

                                    <img
                                        src={getProductImage(item.product)}
                                        alt={item.product.name}
                                        className="rounded me-3"
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                            objectFit: "cover",
                                        }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src =
                                                "/placeholder-image.jpg";
                                        }}
                                    />

                                    <div className="flex-grow-1">
                                        <h6 className="mb-1 fw-bold text-truncate">
                                            {item.product.name}
                                        </h6>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold text-dark">
                                                ₱
                                                {Number(
                                                    item.product.price
                                                ).toLocaleString("en-PH")}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center">
                                        <button
                                            className="btn btn-sm btn-outline-secondary me-2"
                                            onClick={() =>
                                                handleQuantityChange(
                                                    item.id,
                                                    -1
                                                )
                                            }
                                            style={{ width: "30px" }}
                                        >
                                            −
                                        </button>
                                        <span
                                            className="fw-bold"
                                            style={{
                                                minWidth: "30px",
                                                textAlign: "center",
                                            }}
                                        >
                                            {quantities[item.id]}
                                        </span>
                                        <button
                                            className="btn btn-sm btn-outline-secondary ms-2"
                                            onClick={() =>
                                                handleQuantityChange(item.id, 1)
                                            }
                                            style={{ width: "30px" }}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        className="btn btn-sm btn-outline-danger ms-3"
                                        onClick={() => handleRemove(item.id)}
                                        style={{ width: "30px" }}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="border-top px-3 pt-3 pb-3 bg-white">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-muted">
                                    Selected Items:
                                </span>
                                <span className="fw-bold">
                                    {selectedCartItems.length}
                                </span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-muted">Subtotal:</span>
                                <span className="fw-bold fs-5 text-dark">
                                    ₱
                                    {calculateSubtotal().toLocaleString(
                                        "en-PH"
                                    )}
                                </span>
                            </div>

                            <Link
                                href="/checkout"
                                className={`btn btn-dark w-100 py-2 ${
                                    selectedCartItems.length === 0 ||
                                    isCheckingOut
                                        ? "disabled"
                                        : ""
                                }`}
                                onClick={async (e) => {
                                    e.preventDefault();
                                    if (
                                        selectedCartItems.length > 0 &&
                                        !isCheckingOut
                                    ) {
                                        setIsCheckingOut(true);

                                        try {
                                            // Update quantities
                                            await Promise.all(
                                                selectedCartItems.map((item) =>
                                                    axios.patch(
                                                        route(
                                                            "cart.update",
                                                            item.id
                                                        ),
                                                        {
                                                            quantity:
                                                                quantities[
                                                                    item.id
                                                                ],
                                                        }
                                                    )
                                                )
                                            );

                                            // Proceed to checkout
                                            router.visit("/checkout", {
                                                data: {
                                                    selectedItems:
                                                        selectedCartItems.map(
                                                            (item) => item.id
                                                        ),
                                                    quantities: quantities,
                                                },
                                                onFinish: () => {
                                                    setIsCheckingOut(false);
                                                    onHide();
                                                },
                                            });
                                        } catch (error) {
                                            setIsCheckingOut(false);
                                            // Optional: Show error message
                                            console.error(
                                                "Checkout failed:",
                                                error
                                            );
                                        }
                                    }
                                }}
                            >
                                {isCheckingOut ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        Processing...
                                    </>
                                ) : (
                                    "Checkout"
                                )}
                            </Link>
                        </div>
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default CartModal;
