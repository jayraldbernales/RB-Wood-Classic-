import StatusModal from "@/Pages/modals/StatusModal";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusModalProps, setStatusModalProps] = useState({
        isSuccess: true,
        title: "",
        message: "",
    });

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            phone_number: user.phone_number || "",
            address: user.address || "",
            gender:
                user.gender?.charAt(0).toUpperCase() +
                    user.gender?.slice(1).toLowerCase() || "",
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route("profile.update"), {
            onSuccess: () => {
                setStatusModalProps({
                    isSuccess: true,
                    title: "Success!",
                    message: "Profile updated successfully",
                });
                setShowStatusModal(true);
            },
            onError: () => {
                setStatusModalProps({
                    isSuccess: false,
                    title: "Error!",
                    message: "Failed to update profile",
                });
                setShowStatusModal(true);
            },
        });
    };

    return (
        <div className="container" style={{ maxWidth: "1200px" }}>
            {/* Status Modal */}
            <StatusModal
                show={showStatusModal}
                onHide={() => setShowStatusModal(false)}
                isSuccess={statusModalProps.isSuccess}
                title={statusModalProps.title}
                message={statusModalProps.message}
            />

            <div className="card shadow-sm">
                <div className="card-body">
                    <form onSubmit={submit}>
                        <div className="row g-3">
                            {/* Heading with Consistent Style */}
                            <h2 className="text-dark fw-bold border-bottom pb-2 mb-4">
                                <i className="bi bi-person-gear me-2"></i>{" "}
                                Personal Information
                            </h2>
                            {/* Name Field */}
                            <div className="col-md-6">
                                <label
                                    htmlFor="name"
                                    className="form-label fw-medium text-muted"
                                >
                                    Full Name{" "}
                                    <span className="text-danger">*</span>
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0">
                                        <i className="bi bi-person text-muted"></i>
                                    </span>
                                    <input
                                        id="name"
                                        type="text"
                                        className={`form-control border-start-0 ${
                                            errors.name ? "is-invalid" : ""
                                        }`}
                                        style={{
                                            boxShadow: "none",
                                            transition: "all 0.2s ease",
                                            paddingLeft: "0.5rem",
                                        }}
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        required
                                        onFocus={(e) => {
                                            e.target.style.borderColor =
                                                "#6c757d";
                                            e.target.style.boxShadow =
                                                "0 0 0 0.2rem rgba(108, 117, 125, 0.1)";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor =
                                                errors.name
                                                    ? "#dc3545"
                                                    : "#dee2e6";
                                            e.target.style.boxShadow = "none";
                                        }}
                                    />
                                </div>
                                {errors.name && (
                                    <div className="invalid-feedback d-block">
                                        {errors.name}
                                    </div>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="col-md-6">
                                <label
                                    htmlFor="email"
                                    className="form-label fw-medium text-muted"
                                >
                                    Email <span className="text-danger">*</span>
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0">
                                        <i className="bi bi-envelope text-muted"></i>
                                    </span>
                                    <input
                                        id="email"
                                        type="email"
                                        className={`form-control border-start-0 ${
                                            errors.email ? "is-invalid" : ""
                                        }`}
                                        style={{
                                            boxShadow: "none",
                                            transition: "all 0.2s ease",
                                            paddingLeft: "0.5rem",
                                        }}
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        required
                                        onFocus={(e) => {
                                            e.target.style.borderColor =
                                                "#6c757d";
                                            e.target.style.boxShadow =
                                                "0 0 0 0.2rem rgba(108, 117, 125, 0.1)";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor =
                                                errors.email
                                                    ? "#dc3545"
                                                    : "#dee2e6";
                                            e.target.style.boxShadow = "none";
                                        }}
                                    />
                                </div>
                                {errors.email && (
                                    <div className="invalid-feedback d-block">
                                        {errors.email}
                                    </div>
                                )}
                            </div>

                            {/* Phone Number Field */}
                            <div className="col-md-6">
                                <label
                                    htmlFor="phone_number"
                                    className="form-label fw-medium text-muted"
                                >
                                    Phone Number{" "}
                                    <span className="text-danger">*</span>
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0">
                                        <i className="bi bi-telephone text-muted"></i>
                                    </span>
                                    <input
                                        id="phone_number"
                                        type="tel"
                                        className={`form-control border-start-0 ${
                                            errors.phone_number
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        style={{
                                            boxShadow: "none",
                                            transition: "all 0.2s ease",
                                            paddingLeft: "0.5rem",
                                        }}
                                        value={data.phone_number}
                                        onChange={(e) =>
                                            setData(
                                                "phone_number",
                                                e.target.value
                                            )
                                        }
                                        onFocus={(e) => {
                                            e.target.style.borderColor =
                                                "#6c757d";
                                            e.target.style.boxShadow =
                                                "0 0 0 0.2rem rgba(108, 117, 125, 0.1)";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor =
                                                errors.phone_number
                                                    ? "#dc3545"
                                                    : "#dee2e6";
                                            e.target.style.boxShadow = "none";
                                        }}
                                    />
                                </div>
                                {errors.phone_number && (
                                    <div className="invalid-feedback d-block">
                                        {errors.phone_number}
                                    </div>
                                )}
                            </div>

                            {/* Gender Field */}
                            <div className="col-md-6">
                                <label
                                    htmlFor="gender"
                                    className="form-label fw-medium text-muted"
                                >
                                    Gender{" "}
                                    <span className="text-danger">*</span>
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0">
                                        <i className="bi bi-gender-ambiguous text-muted"></i>
                                    </span>
                                    <select
                                        id="gender"
                                        className={`form-select border-start-0 ${
                                            errors.gender ? "is-invalid" : ""
                                        }`}
                                        style={{
                                            boxShadow: "none",
                                            transition: "all 0.2s ease",
                                            paddingLeft: "0.5rem",
                                        }}
                                        value={data.gender}
                                        onChange={(e) =>
                                            setData("gender", e.target.value)
                                        }
                                        onFocus={(e) => {
                                            e.target.style.borderColor =
                                                "#6c757d";
                                            e.target.style.boxShadow =
                                                "0 0 0 0.2rem rgba(108, 117, 125, 0.1)";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor =
                                                errors.gender
                                                    ? "#dc3545"
                                                    : "#dee2e6";
                                            e.target.style.boxShadow = "none";
                                        }}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                {errors.gender && (
                                    <div className="invalid-feedback d-block">
                                        {errors.gender}
                                    </div>
                                )}
                            </div>

                            {/* Address Field */}
                            <div className="col-12">
                                <label
                                    htmlFor="address"
                                    className="form-label fw-medium text-muted"
                                >
                                    Address (Purok 1, Cawayanan, Mabini, Bohol){" "}
                                    <span className="text-danger">*</span>
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0 align-items-start pt-2">
                                        <i className="bi bi-house text-muted"></i>
                                    </span>
                                    <textarea
                                        id="address"
                                        className={`form-control border-start-0 ${
                                            errors.address ? "is-invalid" : ""
                                        }`}
                                        style={{
                                            boxShadow: "none",
                                            transition: "all 0.2s ease",
                                            paddingLeft: "0.5rem",
                                            minHeight: "100px",
                                        }}
                                        rows="3"
                                        value={data.address}
                                        onChange={(e) =>
                                            setData("address", e.target.value)
                                        }
                                        onFocus={(e) => {
                                            e.target.style.borderColor =
                                                "#6c757d";
                                            e.target.style.boxShadow =
                                                "0 0 0 0.2rem rgba(108, 117, 125, 0.1)";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor =
                                                errors.address
                                                    ? "#dc3545"
                                                    : "#dee2e6";
                                            e.target.style.boxShadow = "none";
                                        }}
                                    ></textarea>
                                </div>
                                {errors.address && (
                                    <div className="invalid-feedback d-block">
                                        {errors.address}
                                    </div>
                                )}
                            </div>

                            {/* Email Verification Notice */}
                            {mustVerifyEmail &&
                                user.email_verified_at === null && (
                                    <div className="col-12">
                                        <div className="alert alert-warning border-0 shadow-sm">
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                                <div>
                                                    <p className="mb-1">
                                                        Your email address is
                                                        unverified.
                                                    </p>
                                                    <Link
                                                        href={route(
                                                            "verification.send"
                                                        )}
                                                        method="post"
                                                        as="button"
                                                        className="btn btn-link p-0 text-warning"
                                                    >
                                                        Click here to re-send
                                                        the verification email.
                                                    </Link>
                                                    {status ===
                                                        "verification-link-sent" && (
                                                        <div className="text-success mt-1">
                                                            A new verification
                                                            link has been sent
                                                            to your email
                                                            address.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {/* Form Actions */}
                            <div className="col-12 mt-4">
                                <div className="d-flex justify-content-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="btn btn-dark shadow-sm px-4 py-2"
                                        style={{
                                            transition: "all 0.2s ease",
                                            border: "1px solid rgba(0,0,0,0.1)",
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.transform =
                                                "translateY(-1px)";
                                            e.target.style.boxShadow =
                                                "0 4px 6px rgba(0,0,0,0.1)";
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.transform =
                                                "translateY(0)";
                                            e.target.style.boxShadow =
                                                "0 2px 4px rgba(0,0,0,0.1)";
                                        }}
                                    >
                                        {processing ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-save me-2"></i>
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
