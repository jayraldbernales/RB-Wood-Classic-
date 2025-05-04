import React from "react";
import { Link } from "@inertiajs/react";

export default function OrderShow({ order }) {
    return (
        <div className="container py-5">
            <div className="card">
                <div className="card-header">
                    <h2 className="mb-0">Order #{order.order_number}</h2>
                </div>

                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <h4>Order Details</h4>
                            <p>
                                <strong>Status:</strong>
                                <span
                                    className={`badge bg-${getStatusColor(
                                        order.status
                                    )} ms-2`}
                                >
                                    {order.status.replace("_", " ")}
                                </span>
                            </p>
                            <p>
                                <strong>Date:</strong>{" "}
                                {new Date(order.created_at).toLocaleString()}
                            </p>
                            <p>
                                <strong>Total Amount:</strong> ₱
                                {order.total.toLocaleString("en-PH")}
                            </p>
                            <p>
                                <strong>Downpayment Paid:</strong> ₱
                                {order.downpayment_amount.toLocaleString(
                                    "en-PH"
                                )}
                            </p>
                        </div>

                        <div className="col-md-6">
                            <h4>Shipping Information</h4>
                            <p>{order.shipping_address}</p>
                            <p>
                                <strong>Contact:</strong> {order.customer_phone}
                            </p>
                        </div>
                    </div>

                    <hr />

                    <h4 className="mb-3">Order Items</h4>
                    {order.items.map((item) => (
                        <div
                            key={item.id}
                            className="d-flex mb-3 p-3 bg-light rounded"
                        >
                            <img
                                src={
                                    item.product?.image ||
                                    "/images/placeholder.png"
                                }
                                className="rounded me-3"
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    objectFit: "cover",
                                }}
                                alt={item.product_name}
                            />
                            <div className="flex-grow-1">
                                <h5>{item.product_name}</h5>
                                <div className="d-flex justify-content-between">
                                    <span>
                                        ₱{item.price.toLocaleString("en-PH")} x{" "}
                                        {item.quantity}
                                    </span>
                                    <span className="fw-bold">
                                        ₱
                                        {(
                                            item.price * item.quantity
                                        ).toLocaleString("en-PH")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card-footer text-end">
                    <Link href="/orders" className="btn btn-outline-secondary">
                        Back to Orders
                    </Link>
                </div>
            </div>
        </div>
    );
}

function getStatusColor(status) {
    $statusColors = {
        pending: "secondary",
        downpayment_received: "info",
        in_production: "primary",
        completed: "success",
        cancelled: "danger",
    };
    return $statusColors[status] || "secondary";
}
