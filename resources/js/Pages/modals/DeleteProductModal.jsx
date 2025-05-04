import React from "react";

const DeleteProductModal = ({ show, handleClose, handleConfirm }) => {
    if (!show) return null; // Prevents rendering when not shown

    return (
        <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Confirm Delete</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to delete this?</p>
                        <button
                            className="btn btn-danger w-100"
                            onClick={handleConfirm}
                        >
                            Yes, Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteProductModal;
