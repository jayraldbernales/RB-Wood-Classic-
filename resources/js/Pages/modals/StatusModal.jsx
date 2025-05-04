import React, { useEffect } from "react";

const StatusModal = ({ show, onHide, isSuccess, title, message }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onHide();
            }, 3000); // Auto-hide after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [show, onHide]);

    if (!show) return null;

    return (
        <div
            className={`position-fixed top-0 end-0 m-3 p-3 rounded shadow-sm ${
                isSuccess ? "bg-success" : "bg-danger"
            } text-white`}
            style={{
                width: "300px",
                zIndex: 9999,
                animation: "fadeIn 0.3s ease-in-out",
                cursor: "pointer",
            }}
            onClick={onHide}
        >
            <div className="d-flex justify-content-between align-items-start">
                <div>
                    <h6 className="mb-1 fw-bold">{title}</h6>
                    <p className="mb-0 small">{message}</p>
                </div>
                <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={onHide}
                    aria-label="Close"
                ></button>
            </div>
        </div>
    );
};

export default StatusModal;
