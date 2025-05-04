import React, { useEffect } from "react";
import { Head } from "@inertiajs/react";
import CheckoutLayout from "@/Layouts/CheckoutLayout";

export default function PaymentProcessing({
    order,
    paymentIntentClientSecret,
}) {
    useEffect(() => {
        // Load PayMongo JS
        const script = document.createElement("script");
        script.src = "https://js.paymongo.com/v1";
        script.async = true;
        script.onload = initializePayment;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const initializePayment = () => {
        window.paymongo.setPublishableKey(process.env.MIX_PAYMONGO_PUBLIC_KEY);

        window.paymongo
            .createPaymentMethod({
                type: "gcash",
                billing: {
                    name: order.customer_name,
                    email: order.customer_email,
                    phone: order.customer_phone,
                },
            })
            .then((result) => {
                return window.paymongo.attachPaymentToIntent(
                    paymentIntentClientSecret,
                    result.paymentMethod.id
                );
            })
            .then((result) => {
                window.location.href =
                    result.paymentIntent.next_action.redirect.url;
            })
            .catch((error) => {
                console.error("Payment error:", error);
                // Handle error (show message to user)
            });
    };

    return (
        <CheckoutLayout step={2}>
            <Head title="Processing Payment" />
            <div className="card">
                <div className="card-body text-center py-5">
                    <div className="mb-4">
                        <div
                            className="spinner-border text-primary"
                            style={{ width: "3rem", height: "3rem" }}
                            role="status"
                        >
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    <h2 className="mb-3">Processing Your Payment</h2>
                    <p className="lead">
                        Please wait while we prepare your secure payment
                        gateway...
                    </p>
                    <p className="text-muted">Order #: {order.order_number}</p>
                    <p className="h4 text-primary">
                        Amount: ₱
                        {order.downpayment_amount.toLocaleString("en-PH")}
                    </p>
                </div>
            </div>
        </CheckoutLayout>
    );
}
