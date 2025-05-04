import React from "react";
import { Link } from "@inertiajs/react";

export default function CheckoutLayout({ children, step }) {
    const steps = [
        { number: 1, name: "Information" },
        { number: 2, name: "Payment" },
        { number: 3, name: "Confirmation" },
    ];

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    {/* Checkout Progress */}
                    <div className="mb-4">
                        <div className="d-flex justify-content-between">
                            {steps.map((s) => (
                                <div
                                    key={s.number}
                                    className={`step ${
                                        step === s.number ? "active" : ""
                                    }`}
                                >
                                    <div className="step-number">
                                        {s.number}
                                    </div>
                                    <div className="step-name">{s.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {children}

                    <div className="mt-4 text-center">
                        <Link href="/" className="btn btn-outline-secondary">
                            ← Return to Shop
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
