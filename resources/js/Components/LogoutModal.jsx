import React from "react";
import LogOutButton from "@/Components/LogOutButton";

const LogoutModal = ({ showLogoutModal, setShowLogoutModal }) => {
    return (
        <>
            {showLogoutModal && (
                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                    onClick={() => setShowLogoutModal(false)} // Close modal when clicking outside
                >
                    <div
                        className="modal-dialog modal-dialog-centered"
                        style={{ maxWidth: "400px" }} // Adjust the modal width
                    >
                        <div
                            className="modal-content bg-white" // White background for the modal
                            onClick={(e) => e.stopPropagation()} // Prevent click propagation inside modal
                        >
                            {/* Modal Header */}
                            <div className="modal-header border-bottom">
                                <h5 className="modal-title fw-bold">
                                    Confirm Logout
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowLogoutModal(false)}
                                    aria-label="Close"
                                ></button>
                            </div>

                            {/* Modal Body */}
                            <div className="modal-body">
                                <p className="mb-0">
                                    Are you sure you want to log out?
                                </p>
                            </div>

                            {/* Modal Footer */}
                            <div className="modal-footer border-top">
                                <button
                                    type="button"
                                    className="btn btn-secondary rounded-pill px-4"
                                    onClick={() => setShowLogoutModal(false)}
                                >
                                    Cancel
                                </button>
                                <LogOutButton
                                    onLogout={() => setShowLogoutModal(false)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LogoutModal;
