import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

const ForgotPasswordModal = ({
    showForgotPasswordModal,
    setShowForgotPasswordModal,
}) => {
    const [success, setSuccess] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("password.email"), {
            onSuccess: () => {
                setSuccess(true);
            },
        });
    };

    return (
        <>
            {showForgotPasswordModal && (
                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                    onClick={() => {
                        setShowForgotPasswordModal(false);
                        setSuccess(false);
                    }}
                >
                    <div
                        className="modal-dialog modal-dialog-centered"
                        style={{ maxWidth: "400px" }}
                    >
                        <div
                            className="modal-content rounded-4 shadow-lg border-0 p-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {success ? (
                                <div className="text-center">
                                    <div className="mb-3">
                                        <i
                                            className="bi bi-check-circle-fill text-success mb-3"
                                            style={{ fontSize: "50px" }}
                                        ></i>
                                        <h2 className="fw-bold text-success">
                                            Email Sent!
                                        </h2>
                                    </div>
                                    <p className="text-muted">
                                        We’ve sent a secure link to reset your
                                        password. Check your inbox (and spam
                                        folder) to continue.
                                    </p>
                                    <button
                                        className="btn btn-dark w-100 py-3 rounded-3 fw-semibold mt-4"
                                        onClick={() => {
                                            setShowForgotPasswordModal(false);
                                            setSuccess(false);
                                        }}
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="text-center text-dark mb-3">
                                        <h2 className="fw-bold">
                                            Forgot Password
                                        </h2>
                                        <p className="text-muted small">
                                            Enter your email and we'll send you
                                            a reset link.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label text-dark fw-semibold">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                className={`form-control rounded-3 p-3 border ${
                                                    errors.email
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                placeholder="Enter your email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            {errors.email && (
                                                <div className="invalid-feedback">
                                                    {errors.email}
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-dark w-100 py-3 rounded-3 fw-semibold"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? "Sending..."
                                                : "Send Reset Link"}
                                        </button>

                                        <div className="text-center mt-4">
                                            <small className="text-secondary">
                                                Remember your password?{" "}
                                                <a
                                                    href="#"
                                                    className="fw-semibold text-dark ms-1 text-decoration-none"
                                                    onClick={() =>
                                                        setShowForgotPasswordModal(
                                                            false
                                                        )
                                                    }
                                                >
                                                    Back to Login
                                                </a>
                                            </small>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ForgotPasswordModal;
