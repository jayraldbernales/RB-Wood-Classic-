import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

const LoginModal = ({
    showLoginModal,
    setShowLoginModal,
    setShowSignUpModal,
    setShowForgotPasswordModal,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    // Use the useForm hook to manage form state and submission
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onSuccess: () => {
                // Close the modal only on successful login
                setShowLoginModal(false);
            },
            onError: (errors) => {
                // Handle errors without closing the modal
                console.log(errors);
            },
            onFinish: () => {
                reset("password"); // Reset the password field
            },
        });
    };

    return (
        <>
            {showLoginModal && (
                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                    onClick={() => setShowLoginModal(false)} // Close modal when clicking outside
                >
                    <div
                        className="modal-dialog modal-dialog-centered"
                        style={{ maxWidth: "400px" }}
                    >
                        <div
                            className="modal-content rounded-4 shadow-lg border-0 p-4"
                            onClick={(e) => e.stopPropagation()} // Prevent click propagation inside modal
                        >
                            <div className="text-center text-dark mb-3">
                                <h2 className="fw-bold">LOG IN</h2>
                            </div>

                            <div className="modal-body p-0">
                                <form onSubmit={handleSubmit}>
                                    {/* Email Input */}
                                    <div className="mb-3">
                                        <label className="form-label text-dark fw-semibold text-start d-block">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control rounded-3 p-3 border"
                                            placeholder="Enter your email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            required
                                        />
                                    </div>

                                    {/* Password Input with Toggle */}
                                    <div className="mb-4">
                                        <label className="form-label text-dark fw-semibold text-start d-block">
                                            Password
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                className="form-control rounded-3 p-3 border"
                                                placeholder="Enter your password"
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData(
                                                        "password",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="position-absolute end-0 top-50 translate-middle-y me-3 border-0 bg-transparent"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                            >
                                                <i
                                                    className={`bi ${
                                                        showPassword
                                                            ? "bi-eye-slash"
                                                            : "bi-eye"
                                                    } text-muted`}
                                                ></i>
                                            </button>
                                        </div>
                                    </div>
                                    {errors.password && (
                                        <div className="text-danger mt-1">
                                            {errors.password}
                                        </div>
                                    )}
                                    {errors.email && (
                                        <div className="text-danger mt-1">
                                            {errors.email}
                                        </div>
                                    )}

                                    {/* Forgot Password Link */}
                                    <div className="mb-3 text-start">
                                        <a
                                            href="#"
                                            className="text-decoration-none text-secondary fw-semibold"
                                            onClick={() => {
                                                setShowLoginModal(false);
                                                setShowForgotPasswordModal(
                                                    true
                                                );
                                            }}
                                        >
                                            Forgot Password?
                                        </a>
                                    </div>

                                    {/* Login Button */}
                                    <button
                                        type="submit"
                                        className="btn btn-dark w-100 py-3 rounded-3 fw-semibold"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? "Logging in..."
                                            : "Log In"}
                                    </button>
                                </form>

                                {/* Register Link */}
                                <div className="text-center mt-4">
                                    <small className="text-secondary">
                                        New Customer?{" "}
                                        <a
                                            href="#"
                                            className="fw-semibold text-dark ms-1 text-decoration-none"
                                            onClick={() => {
                                                setShowLoginModal(false); // Close login modal
                                                setShowSignUpModal(true); // Open sign-up modal
                                            }}
                                        >
                                            Register
                                        </a>
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LoginModal;
