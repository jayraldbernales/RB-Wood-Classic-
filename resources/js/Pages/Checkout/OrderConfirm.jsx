import React from "react";
import { Head, Link } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";

const OrderConfirmation = ({ order }) => {
    return (
        <Layout>
            <Head title="Order Confirmation" />

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card shadow-sm">
                            <div className="card-body text-center p-5">
                                <div className="mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="80"
                                        height="80"
                                        fill="#28a745"
                                        className="bi bi-check-circle-fill"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                    </svg>
                                </div>
                                <h2 className="mb-3">
                                    Thank You for Your Order!
                                </h2>
                                <p className="lead mb-4">
                                    Your order #{order.id} has been received and
                                    is being processed.
                                </p>

                                <div className="bg-light p-4 rounded mb-4 text-start">
                                    <h5 className="mb-3">Order Details</h5>
                                    <div className="row mb-2">
                                        <div className="col-md-6">
                                            <p className="mb-1">
                                                <strong>Order Number:</strong> #
                                                {order.id}
                                            </p>
                                        </div>
                                        <div className="col-md-6">
                                            <p className="mb-1">
                                                <strong>Order Date:</strong>{" "}
                                                {new Date(
                                                    order.created_at
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-md-6">
                                            <p className="mb-1">
                                                <strong>Total Amount:</strong> ₱
                                                {order.total_amount.toLocaleString(
                                                    "en-PH"
                                                )}
                                            </p>
                                        </div>
                                        <div className="col-md-6">
                                            <p className="mb-1">
                                                <strong>Down Payment:</strong> ₱
                                                {order.down_payment_amount.toLocaleString(
                                                    "en-PH"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-md-6">
                                            <p className="mb-1">
                                                <strong>Payment Status:</strong>
                                                <span
                                                    className={`badge ${
                                                        order.payment_status ===
                                                        "paid"
                                                            ? "bg-success"
                                                            : "bg-warning"
                                                    } ms-2`}
                                                >
                                                    {order.payment_status}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="col-md-6">
                                            <p className="mb-1">
                                                <strong>Order Status:</strong>
                                                <span className="badge bg-info ms-2 text-capitalize">
                                                    {order.status.replace(
                                                        "_",
                                                        " "
                                                    )}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    {order.estimated_completion_date && (
                                        <div className="row">
                                            <div className="col-12">
                                                <p className="mb-1">
                                                    <strong>
                                                        Estimated Completion:
                                                    </strong>
                                                    {new Date(
                                                        order.estimated_completion_date
                                                    ).toLocaleDateString()}
                                                    (within 1 month)
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <p className="mb-4">
                                    We'll send you an email with the order
                                    details and updates on your order status.
                                </p>

                                <div className="d-flex justify-content-center gap-3">
                                    <Link
                                        href="/products"
                                        className="btn btn-outline-dark px-4"
                                    >
                                        Continue Shopping
                                    </Link>
                                    <Link
                                        href={route("orders.show", order.id)}
                                        className="btn btn-dark px-4"
                                    >
                                        View Order Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default OrderConfirmation;
