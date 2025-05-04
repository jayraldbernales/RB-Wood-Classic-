import React from "react";
import { Modal, Button, Badge } from "react-bootstrap";
// ...imports stay the same

const OrderDetailsModal = ({ show, onHide, order, getStatusColor }) => {
    if (!order) return null;

    const getProductImage = (product) => {
        if (!product?.images?.length)
            return "https://via.placeholder.com/150?text=No+Image";

        if (product.images[0].url) {
            return product.images[0].url.startsWith("http")
                ? product.images[0].url
                : `${window.location.origin}${product.images[0].url}`;
        }

        return `${window.location.origin}/storage/${product.images[0].image}`;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton className="border-bottom bg-light">
                <Modal.Title className="fw-bold">
                    <i className="bi bi-receipt me-2"></i> Order #{order.id}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-4">
                {/* Customer Info */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <p className="mb-2">
                                    <strong>Name:</strong> {order.user.name}
                                </p>
                                <p className="mb-2">
                                    <strong>Email:</strong> {order.user.email}
                                </p>
                                <p className="mb-2">
                                    <strong>Phone:</strong>{" "}
                                    {order.user.phone_number || "N/A"}
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p className="mb-2">
                                    <strong>Address:</strong>{" "}
                                    {order.user.address || "N/A"}
                                </p>
                                <p className="mb-2">
                                    <strong>Order Date:</strong>{" "}
                                    {new Date(
                                        order.created_at
                                    ).toLocaleString()}
                                </p>

                                <p className="mb-2">
                                    <strong>Payment Method:</strong>{" "}
                                    <Badge
                                        bg={
                                            order.payment_method === "card"
                                                ? "primary"
                                                : "secondary"
                                        }
                                        className="me-2"
                                    >
                                        {order.payment_method === "card"
                                            ? "Credit Card"
                                            : "Pay In-Store"}
                                    </Badge>
                                </p>
                            </div>
                        </div>

                        {/* Enhanced Message Section */}
                        {order.message && (
                            <div className="mt-4">
                                <h6 className="fw-semibold mb-2">
                                    Customer Message
                                </h6>
                                <div className="border rounded bg-white p-3 shadow-sm">
                                    <p className="mb-0 text-dark">
                                        {order.message}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Items */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                        <h5 className="fw-semibold mb-3 border-bottom pb-2">
                            Ordered Items ({order.items.length})
                        </h5>

                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Product</th>
                                        <th>Qty</th>
                                        <th>Price</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={getProductImage(
                                                            item.product
                                                        )}
                                                        alt={
                                                            item.product
                                                                ?.name ||
                                                            `Product ${item.product_id}`
                                                        }
                                                        className="img-thumbnail me-3"
                                                        style={{
                                                            width: "80px",
                                                            height: "80px",
                                                            objectFit: "cover",
                                                        }}
                                                        onError={(e) => {
                                                            e.target.onerror =
                                                                null;
                                                            e.target.src =
                                                                "https://via.placeholder.com/150?text=No+Image";
                                                        }}
                                                    />
                                                    <div>
                                                        <div className="fw-medium">
                                                            {item.product
                                                                ?.name ||
                                                                `Product ${item.product_id}`}
                                                        </div>
                                                        {item.variation && (
                                                            <small className="text-muted">
                                                                {
                                                                    item
                                                                        .variation
                                                                        .name
                                                                }
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{item.quantity}</td>
                                            <td>
                                                {formatCurrency(item.price)}
                                            </td>
                                            <td className="fw-bold">
                                                {formatCurrency(
                                                    item.quantity * item.price
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold fs-5">Total Amount</span>
                            <span className="fw-bold text-dark fs-4">
                                {formatCurrency(order.total_amount)}
                            </span>
                        </div>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer className="border-top bg-light">
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderDetailsModal;
