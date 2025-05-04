import React from "react";
import { Link } from "@inertiajs/react";
import CheckoutLayout from "@/Layouts/CheckoutLayout";

export default function CheckoutSuccess({ order }) {
    return (
        <CheckoutLayout step={3}>
            <div className="card">
                <div className="card-body text-center py-5">
                    <div className="mb-4">
                        <i
                            className="bi bi-check-circle-fill text-success"
                            style={{ fontSize: "5rem" }}
                        ></i>
                    </div>
                    <h2 className="mb-3">Payment Successful!</h2>
                    <p className="lead mb-4">
                        Thank you for your order (#{order.order_number})
                    </p>

                    <div className="alert alert-success text-start mb-4">
                        <p className="mb-2">
                            <strong>Next Steps:</strong>
                        </p>
                        <ul className="mb-0">
                            <li>
                                We've received your payment of ₱
                                {order.downpayment_amount.toLocaleString(
                                    "en-PH"
                                )}
                            </li>
                            <li>Your order is now in production</li>
                            <li>We'll notify you when your items are ready</li>
                            <li>Check your email for the order confirmation</li>
                        </ul>
                    </div>

                    <div className="d-flex justify-content-center gap-3">
                        <Link
                            href={route("orders.show", order.id)}
                            className="btn btn-primary"
                        >
                            View Order Details
                        </Link>
                        <Link href="/" className="btn btn-outline-secondary">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </CheckoutLayout>
    );
}
