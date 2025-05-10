import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useForm, Head, Link } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import Navbar from "@/Components/Navbar";
import LogoutModal from "@/Components/LogoutModal";

const Checkout = ({ cartItems, total, auth }) => {
    useEffect(() => {
        AOS.init();
        loadPayMongo();
    }, []);

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const { data, setData, post, processing, errors } = useForm({
        items: cartItems,
        total_amount: total,
        down_payment_amount: total * 0.5,
        message: "",
        payment_method: "gcash",
        payment_type: "full",
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState(null);

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (data.payment_method === "gcash") {
            await processEwalletPayment("gcash");
        } else {
            post(route("orders.store"));
        }
    };

   const processEwalletPayment = async (ewalletType) => {
        setPaymentProcessing(true);
        setPaymentError(null);

        try {
            const paymentAmount =
                data.payment_type === "full" ? total : total * 0.5;

            // Create order via fetch POST and get order id
            const orderResponse = await fetch(route("orders.store"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]'
                    ).content,
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    payment_method: data.payment_method,
                    payment_type: data.payment_type,
                    total_amount: total,
                    down_payment_amount: paymentAmount,
                    items: cartItems,
                    message: data.message || "",
                    is_paid: false,
                }),
            });

            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                throw new Error(errorData.error || "Failed to create order");
            }

            const orderData = await orderResponse.json();
            const orderId = orderData.order.id;

            // Create PayMongo checkout session with order_id in metadata
            const paymentResponse = await fetch(
                route("paymongo.create-checkout"),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document.querySelector(
                            'meta[name="csrf-token"]'
                        ).content,
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        amount: paymentAmount * 100,
                        description: `Order Payment`,
                        payment_method_type: ewalletType,
                        metadata: {
                            order_id: orderId,
                            order_type: data.payment_type,
                            user_id: auth.user.id,
                            amount: paymentAmount,
                        },
                    }),
                }
            );

            const result = await paymentResponse.json();
            if (result.checkout_url) {
                window.location.href = result.checkout_url;
            } else {
                throw new Error("No checkout URL received");
            }
        } catch (error) {
            setPaymentError(error.message);
        } finally {
            setPaymentProcessing(false);
        }
    };
    
    const loadPayMongo = () => {
        if (!window.PayMongo) {
            const script = document.createElement("script");
            script.src = "https://js.paymongo.com/v1/paymongo.js";
            script.async = true;
            script.onload = () => console.log("PayMongo SDK loaded.");
            document.body.appendChild(script);
        }
    };

    return (
        <div
            className={`d-flex ${sidebarOpen ? "sidebar-open" : ""}`}
            style={{ overflow: "hidden" }}
        >
            <Head title="Checkout" />

            <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div
                className="content flex-grow-1"
                style={{
                    marginLeft: sidebarOpen ? "220px" : "0",
                    transition: "margin-left 0.3s ease",
                    backgroundColor: "#F8F9FA",
                    minHeight: "100vh",
                }}
            >
                <div
                    className="position-relative"
                    style={{ paddingTop: "50px" }}
                >
                    <Navbar
                        toggleSidebar={toggleSidebar}
                        setShowLogoutModal={setShowLogoutModal}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />

                    <div className="container-fluid px-0">
                        <div className="row">
                            {/* Main checkout content */}
                            <div className="col-lg-12">
                                <div
                                    className="px-4 py-5 mt-2"
                                    style={{
                                        maxWidth: "1000px",
                                        margin: "0 auto",
                                    }}
                                >
                                    {/* Checkout header with progress indicator */}
                                    <div
                                        className="mb-5"
                                        style={{ marginBottom: "4rem" }}
                                    >
                                        {" "}
                                        <h2 className="fw-bold mb-4">
                                            Checkout
                                        </h2>{" "}
                                        <div
                                            className="d-flex align-items-center"
                                            style={{ marginBottom: "3rem" }}
                                        >
                                            {" "}
                                            <div
                                                className="flex-grow-1 position-relative"
                                                style={{ zIndex: 1 }}
                                            >
                                                <div
                                                    className="progress"
                                                    style={{
                                                        height: "8px",
                                                        marginBottom: "2.5rem",
                                                    }}
                                                >
                                                    <div
                                                        className="progress-bar bg-dark"
                                                        role="progressbar"
                                                        style={{
                                                            width: `${
                                                                (currentStep /
                                                                    3) *
                                                                100
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <div
                                                    className="d-flex justify-content-between position-absolute w-100"
                                                    style={{
                                                        top: "1rem",
                                                    }}
                                                >
                                                    {[1, 2, 3].map((step) => (
                                                        <div
                                                            key={step}
                                                            className={`d-flex flex-column align-items-center ${
                                                                currentStep >=
                                                                step
                                                                    ? "text-dark"
                                                                    : "text-muted"
                                                            }`}
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() =>
                                                                currentStep >=
                                                                    step &&
                                                                setCurrentStep(
                                                                    step
                                                                )
                                                            }
                                                        >
                                                            <div
                                                                className={`rounded-circle d-flex align-items-center justify-content-center ${
                                                                    currentStep >=
                                                                    step
                                                                        ? "bg-dark text-white"
                                                                        : "bg-light"
                                                                }`}
                                                                style={{
                                                                    width: "36px" /* Increased from 30px */,
                                                                    height: "36px" /* Increased from 30px */,
                                                                    fontWeight:
                                                                        "600",
                                                                }}
                                                            >
                                                                {step}
                                                            </div>
                                                            <small
                                                                className="mt-2 text-nowrap" /* Increased from mt-1 to mt-2 */
                                                                style={{
                                                                    fontSize:
                                                                        "0.85rem",
                                                                }} /* Optional: slightly larger text */
                                                            >
                                                                {step === 1 &&
                                                                    "Order Summary"}
                                                                {step === 2 &&
                                                                    "Delivery Info"}
                                                                {step === 3 &&
                                                                    "Payment"}
                                                            </small>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        {/* Step 1: Order Summary */}
                                        {currentStep === 1 && (
                                            <div className="card border-0 shadow-sm mb-4">
                                                {" "}
                                                {/* Removed pt-5 */}
                                                <div className="card-header bg-white border-bottom py-3 mt-4">
                                                    {" "}
                                                    {/* Added mt-4 */}
                                                    <h4 className="mb-0">
                                                        Order Summary
                                                    </h4>
                                                </div>
                                                <div className="card-body p-0">
                                                    <div className="list-group list-group-flush">
                                                        {cartItems.map(
                                                            (item) => (
                                                                <div
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    className="list-group-item border-0 py-3 px-4"
                                                                >
                                                                    <div className="d-flex">
                                                                        <img
                                                                            src={
                                                                                item
                                                                                    .product
                                                                                    .images[0]
                                                                                    ?.url ||
                                                                                "/placeholder-image.jpg"
                                                                            }
                                                                            alt={
                                                                                item
                                                                                    .product
                                                                                    .name
                                                                            }
                                                                            className="rounded me-3"
                                                                            style={{
                                                                                width: "80px",
                                                                                height: "80px",
                                                                                objectFit:
                                                                                    "cover",
                                                                            }}
                                                                        />
                                                                        <div className="flex-grow-1">
                                                                            <h6 className="mb-1 fw-semibold">
                                                                                {
                                                                                    item
                                                                                        .product
                                                                                        .name
                                                                                }
                                                                            </h6>
                                                                            <p className="text-muted small mb-1">
                                                                                Quantity:{" "}
                                                                                {
                                                                                    item.quantity
                                                                                }
                                                                            </p>
                                                                            <p className="mb-0 fw-semibold">
                                                                                ₱
                                                                                {(
                                                                                    item
                                                                                        .product
                                                                                        .price *
                                                                                    item.quantity
                                                                                ).toLocaleString(
                                                                                    "en-PH"
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 2: Delivery Information */}
                                        {currentStep === 2 && (
                                            <div className="card border-0 shadow-sm mb-4">
                                                <div className="card-header bg-white border-bottom py-3">
                                                    <h4 className="mb-0">
                                                        Delivery Information
                                                    </h4>
                                                </div>
                                                <div className="card-body">
                                                    <div className="mb-4">
                                                        <label className="form-label fw-semibold">
                                                            Full Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control py-2"
                                                            value={
                                                                auth.user.name
                                                            }
                                                            readOnly
                                                        />
                                                    </div>
                                                    <div className="mb-4">
                                                        <label className="form-label fw-semibold">
                                                            Contact Number
                                                        </label>
                                                        <span className="text-danger">
                                                            *
                                                        </span>
                                                        <input
                                                            type="text"
                                                            className="form-control py-2"
                                                            value={
                                                                auth.user
                                                                    .phone_number ||
                                                                "Not set"
                                                            }
                                                            readOnly
                                                        />
                                                        {!auth.user
                                                            .phone_number && (
                                                            <div className="form-text text-secondary mt-1">
                                                                Click{" "}
                                                                <Link
                                                                    href="/profile"
                                                                    className="text-secondary text-decoration-underline fw-medium"
                                                                >
                                                                    Profile
                                                                </Link>{" "}
                                                                to add your
                                                                phone number
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mb-4">
                                                        <label className="form-label fw-semibold">
                                                            Delivery Address
                                                        </label>
                                                        <span className="text-danger">
                                                            *
                                                        </span>
                                                        <textarea
                                                            className="form-control py-2"
                                                            rows="3"
                                                            value={
                                                                auth.user
                                                                    .address ||
                                                                "Not set"
                                                            }
                                                            readOnly
                                                        />
                                                        {!auth.user.address && (
                                                            <div className="form-text text-secondary mt-1">
                                                                Click{" "}
                                                                <Link
                                                                    href="/profile"
                                                                    className="text-secondary text-decoration-underline fw-medium"
                                                                >
                                                                    Profile
                                                                </Link>{" "}
                                                                to add your
                                                                delivery address
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="form-text text-secondary mb-3">
                                                        Edit your info{" "}
                                                        <Link
                                                            href="/settings"
                                                            className="text-secondary text-decoration-underline fw-medium"
                                                        >
                                                            here
                                                        </Link>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label fw-semibold">
                                                            Special Instructions
                                                        </label>
                                                        <textarea
                                                            className="form-control py-2"
                                                            rows="3"
                                                            placeholder="Any special instructions for delivery?"
                                                            value={data.message}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "message",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 3: Payment */}
                                        {currentStep === 3 && (
                                            <div className="card border-0 shadow-sm mb-4">
                                                <div className="card-header bg-white border-bottom py-3">
                                                    <h4 className="mb-0">
                                                        Payment Details
                                                    </h4>
                                                </div>
                                                <div className="card-body">
                                                    {/* Payment Summary */}
                                                    <div className="mb-4 p-3 bg-light rounded">
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <span className="text-muted">
                                                                Subtotal:
                                                            </span>
                                                            <span className="fw-semibold">
                                                                ₱
                                                                {total.toLocaleString(
                                                                    "en-PH"
                                                                )}
                                                            </span>
                                                        </div>

                                                        {/* Dynamic Payment Amount Based on Type */}
                                                        {data.payment_type ===
                                                        "downpayment" ? (
                                                            <div className="d-flex justify-content-between mb-2">
                                                                <span className="text-muted">
                                                                    Down Payment
                                                                    (50%):
                                                                </span>
                                                                <span className="fw-semibold">
                                                                    ₱
                                                                    {(
                                                                        total *
                                                                        0.5
                                                                    ).toLocaleString(
                                                                        "en-PH"
                                                                    )}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="d-flex justify-content-between mb-2">
                                                                <span className="text-muted">
                                                                    Full
                                                                    Payment:
                                                                </span>
                                                                <span className="fw-semibold">
                                                                    ₱
                                                                    {total.toLocaleString(
                                                                        "en-PH"
                                                                    )}
                                                                </span>
                                                            </div>
                                                        )}

                                                        <hr className="my-2" />
                                                        <div className="d-flex justify-content-between fw-bold fs-5">
                                                            <span>
                                                                Total Due Now:
                                                            </span>
                                                            <span className="text-dark">
                                                                ₱
                                                                {data.payment_type ===
                                                                "downpayment"
                                                                    ? (
                                                                          total *
                                                                          0.5
                                                                      ).toLocaleString(
                                                                          "en-PH"
                                                                      )
                                                                    : total.toLocaleString(
                                                                          "en-PH"
                                                                      )}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Add payment type selection (down payment or full) */}
                                                    <div className="mb-4">
                                                        <h5 className="mb-3">
                                                            Payment Type
                                                        </h5>
                                                        <div
                                                            className="btn-group w-100"
                                                            role="group"
                                                        >
                                                            <button
                                                                type="button"
                                                                className={`btn ${
                                                                    data.payment_type ===
                                                                    "downpayment"
                                                                        ? "btn-dark" // Active style for down payment
                                                                        : "btn-outline-dark"
                                                                }`}
                                                                onClick={() => {
                                                                    setData(
                                                                        "payment_type",
                                                                        "downpayment"
                                                                    );
                                                                    setData(
                                                                        "down_payment_amount",
                                                                        total *
                                                                            0.5
                                                                    );
                                                                }}
                                                            >
                                                                50% Down Payment
                                                                (₱
                                                                {(
                                                                    total * 0.5
                                                                ).toLocaleString(
                                                                    "en-PH"
                                                                )}
                                                                )
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className={`btn ${
                                                                    data.payment_type ===
                                                                    "full"
                                                                        ? "btn-dark" // Active style for full payment
                                                                        : "btn-outline-dark"
                                                                }`}
                                                                onClick={() => {
                                                                    setData(
                                                                        "payment_type",
                                                                        "full"
                                                                    );
                                                                    setData(
                                                                        "down_payment_amount",
                                                                        total
                                                                    ); // Set down payment amount to total
                                                                }}
                                                            >
                                                                Full Payment (₱
                                                                {total.toLocaleString(
                                                                    "en-PH"
                                                                )}
                                                                )
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Payment Method Selection */}
                                                    <div className="mb-4">
                                                        <h5 className="mb-3">
                                                            Payment Method
                                                        </h5>
                                                        <div className="card border-0 shadow-sm">
                                                            {/* GCash Option */}
                                                            <div
                                                                className={`p-3 d-flex align-items-center ${
                                                                    data.payment_method ===
                                                                    "gcash"
                                                                        ? "border-dark bg-dark bg-opacity-10"
                                                                        : ""
                                                                }`}
                                                                style={{
                                                                    cursor: "pointer",
                                                                    borderLeft: `3px solid ${
                                                                        data.payment_method ===
                                                                        "gcash"
                                                                            ? "#0d6efd"
                                                                            : "transparent"
                                                                    }`,
                                                                }}
                                                                onClick={() =>
                                                                    setData(
                                                                        "payment_method",
                                                                        "gcash"
                                                                    )
                                                                }
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="payment_method"
                                                                    className="form-check-input me-3"
                                                                    value="gcash"
                                                                    checked={
                                                                        data.payment_method ===
                                                                        "gcash"
                                                                    }
                                                                    onChange={() =>
                                                                        setData(
                                                                            "payment_method",
                                                                            "gcash"
                                                                        )
                                                                    }
                                                                    hidden
                                                                />
                                                                <div className="d-flex align-items-center w-100">
                                                                    <div className="me-3">
                                                                        <img
                                                                            src="/img/gcash.png"
                                                                            alt="GCash"
                                                                            style={{
                                                                                width: "32px",
                                                                                height: "32px",
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className="flex-grow-1">
                                                                        <div className="fw-semibold">
                                                                            GCash
                                                                        </div>
                                                                        <small className="text-muted">
                                                                            Pay
                                                                            via
                                                                            GCash
                                                                            mobile
                                                                            wallet
                                                                        </small>
                                                                    </div>
                                                                    {data.payment_method ===
                                                                        "gcash" && (
                                                                        <i className="bi bi-check-circle-fill text-dark"></i>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <hr className="m-0" />

                                                            {/* In-Person Option */}
                                                            <div
                                                                className={`p-3 d-flex align-items-center ${
                                                                    data.payment_method ===
                                                                    "inperson"
                                                                        ? "border-dark bg-dark bg-opacity-10"
                                                                        : ""
                                                                }`}
                                                                style={{
                                                                    cursor: "pointer",
                                                                    borderLeft: `3px solid ${
                                                                        data.payment_method ===
                                                                        "inperson"
                                                                            ? "#0d6efd"
                                                                            : "transparent"
                                                                    }`,
                                                                }}
                                                                onClick={() =>
                                                                    setData(
                                                                        "payment_method",
                                                                        "inperson"
                                                                    )
                                                                }
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="payment_method"
                                                                    className="form-check-input me-3"
                                                                    value="inperson"
                                                                    checked={
                                                                        data.payment_method ===
                                                                        "inperson"
                                                                    }
                                                                    onChange={() =>
                                                                        setData(
                                                                            "payment_method",
                                                                            "inperson"
                                                                        )
                                                                    }
                                                                    hidden
                                                                />
                                                                <div className="d-flex align-items-center w-100">
                                                                    <div className="me-3">
                                                                        <i className="bi bi-shop fs-4 text-dark"></i>
                                                                    </div>
                                                                    <div className="flex-grow-1">
                                                                        <div className="fw-semibold">
                                                                            Pay
                                                                            In-Store
                                                                        </div>
                                                                        <small className="text-muted">
                                                                            Pay
                                                                            directly
                                                                            at
                                                                            our
                                                                            shop{" "}
                                                                            <Link
                                                                                href="/settings"
                                                                                className="text-dark text-decoration-underline"
                                                                            >
                                                                                [locations]
                                                                            </Link>
                                                                        </small>
                                                                    </div>
                                                                    {data.payment_method ===
                                                                        "inperson" && (
                                                                        <i className="bi bi-check-circle-fill text-dark"></i>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {paymentError && (
                                                        <div className="alert alert-danger">
                                                            <i className="bi bi-exclamation-circle me-2"></i>
                                                            {paymentError}
                                                        </div>
                                                    )}

                                                    <button
                                                        className="btn btn-dark w-100 py-3 fw-bold"
                                                        disabled={
                                                            processing ||
                                                            paymentProcessing
                                                        }
                                                    >
                                                        {(processing ||
                                                            paymentProcessing) && (
                                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                                        )}
                                                        {data.payment_method ===
                                                        "gcash"
                                                            ? `Pay ${
                                                                  data.payment_type ===
                                                                  "downpayment"
                                                                      ? "Down Payment"
                                                                      : "Now"
                                                              }`
                                                            : "Place Order"}
                                                    </button>

                                                    <p className="small text-muted mt-3 text-center">
                                                        By placing your order,
                                                        you agree to our{" "}
                                                        <Link
                                                            href="/terms"
                                                            className="text-decoration-none text-primary"
                                                        >
                                                            Terms of Service
                                                        </Link>{" "}
                                                        and{" "}
                                                        <Link
                                                            href="/privacy"
                                                            className="text-decoration-none text-primary"
                                                        >
                                                            Privacy Policy
                                                        </Link>
                                                        .
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Navigation buttons */}
                                        <div className="d-flex justify-content-between mt-4">
                                            {currentStep > 1 && (
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary px-4 py-2"
                                                    onClick={prevStep}
                                                >
                                                    Back
                                                </button>
                                            )}
                                            {currentStep < 3 ? (
                                                <button
                                                    type="button"
                                                    className="btn btn-dark ms-auto px-4 py-2"
                                                    onClick={nextStep}
                                                >
                                                    Continue
                                                </button>
                                            ) : (
                                                <div className="ms-auto"></div> // Spacer for alignment
                                            )}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <LogoutModal
                    showLogoutModal={showLogoutModal}
                    setShowLogoutModal={setShowLogoutModal}
                />
            </div>
        </div>
    );
};

export default Checkout;
