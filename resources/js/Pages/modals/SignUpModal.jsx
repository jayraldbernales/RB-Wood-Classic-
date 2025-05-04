import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

const SignUpModal = ({
    showSignUpModal,
    setShowSignUpModal,
    setShowLoginModal,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Use the useForm hook to manage form state and submission
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("register"), {
            onSuccess: () => {
                // Display a success message
                setSuccessMessage("Registration successful! Please log in.");

                // Clear the form
                reset();

                // Close the modal after a delay (optional)
                setTimeout(() => {
                    setShowSignUpModal(false);
                }, 2000); // Close after 2 seconds
            },
            onError: (errors) => {
                // Handle validation errors (if any)
                console.log(errors);
            },
        });
    };

    return (
        <>
            {showSignUpModal && (
                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                    onClick={() => setShowSignUpModal(false)} // Close modal when clicking outside
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
                                <h2 className="fw-bold">SIGN UP</h2>
                            </div>

                            <div className="modal-body p-0">
                                <form onSubmit={handleSubmit}>
                                    {/* Full Name Input */}
                                    <div className="mb-3">
                                        <label className="form-label text-dark fw-semibold text-start d-block">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3 p-3 border"
                                            placeholder="Full Name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            required
                                        />
                                    </div>

                                    {/* Email Input */}
                                    <div className="mb-3">
                                        <label className="form-label text-dark fw-semibold text-start d-block">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control rounded-3 p-3 border"
                                            placeholder="Email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            required
                                        />
                                    </div>

                                    {/* Password Input */}
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
                                                placeholder="Create a password"
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
                                                className="position-absolute end-0 top-50 translate-middle-y me-3 border-0 bg-transparent"
                                                type="button"
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

                                    {/* Confirm Password Input */}
                                    <div className="mb-4">
                                        <label className="form-label text-dark fw-semibold text-start d-block">
                                            Confirm Password
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type="password"
                                                className="form-control rounded-3 p-3 border"
                                                placeholder="Confirm password"
                                                value={
                                                    data.password_confirmation
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "password_confirmation",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            <button
                                                key="togglePasswordButton"
                                                className="position-absolute end-0 top-50 translate-middle-y me-3 border-0 bg-transparent"
                                                type="button"
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
                                        {errors.name && (
                                            <div className="text-danger mt-1">
                                                {errors.name}
                                            </div>
                                        )}
                                        {errors.password_confirmation && (
                                            <div className="text-danger mt-1">
                                                {errors.password_confirmation}
                                            </div>
                                        )}
                                    </div>

                                    {/* Display success message */}
                                    {successMessage && (
                                        <div className="alert alert-success mb-3">
                                            {successMessage}
                                        </div>
                                    )}

                                    {/* Sign Up Button */}
                                    <button
                                        type="submit"
                                        className="btn btn-dark w-100 py-3 rounded-3 fw-semibold"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? "Signing up..."
                                            : "Sign Up"}
                                    </button>
                                </form>

                                {/* Login Link */}
                                <div className="text-center mt-4">
                                    <small className="text-secondary">
                                        Already have an account?{" "}
                                        <a
                                            href="#"
                                            className="fw-semibold text-dark ms-1 text-decoration-none"
                                            onClick={() => {
                                                setShowSignUpModal(false); // Close sign-up modal
                                                setShowLoginModal(true); // Open login modal
                                            }}
                                        >
                                            Log In
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

export default SignUpModal;
