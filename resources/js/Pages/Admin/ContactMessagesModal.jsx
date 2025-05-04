import React, { useState, useEffect } from "react";
import axios from "axios";
import StatusModal from "../modals/StatusModal";

const ContactMessagesModal = ({ show, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [statusModal, setStatusModal] = useState({
        show: false,
        isSuccess: false,
        title: "",
        message: "",
    });

    useEffect(() => {
        if (show) {
            fetchMessages();
        }
    }, [show]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/admin/contact-messages");
            setMessages(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch messages. Please try again later.");
            setLoading(false);
        }
    };

    const handleMessageClick = (message) => {
        setSelectedMessage(message);
    };

    const handleBackToList = () => {
        setSelectedMessage(null);
    };

    const confirmDelete = (message) => {
        setMessageToDelete(message);
        setShowDeleteModal(true);
    };

    const handleDeleteMessage = async () => {
        if (!messageToDelete) return;

        try {
            setIsDeleting(true);
            await axios.delete(`/admin/contact-messages/${messageToDelete.id}`);
            setMessages(
                messages.filter((msg) => msg.id !== messageToDelete.id)
            );
            if (selectedMessage && selectedMessage.id === messageToDelete.id) {
                setSelectedMessage(null);
            }
            setStatusModal({
                show: true,
                isSuccess: true,
                title: "Success",
                message: "Message deleted successfully",
            });
        } catch (err) {
            setStatusModal({
                show: true,
                isSuccess: false,
                title: "Error",
                message: "Failed to delete message. Please try again.",
            });
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setMessageToDelete(null);
        }
    };

    const filteredMessages = messages.filter(
        (msg) =>
            msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!show) return null;

    return (
        <>
            {/* Status Modal */}
            <StatusModal
                show={statusModal.show}
                onHide={() => setStatusModal({ ...statusModal, show: false })}
                isSuccess={statusModal.isSuccess}
                title={statusModal.title}
                message={statusModal.message}
            />

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1060,
                    }}
                    onClick={() => setShowDeleteModal(false)}
                >
                    <div
                        className="modal-dialog modal-dialog-centered"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowDeleteModal(false)}
                                />
                            </div>
                            <div className="modal-body">
                                <p>
                                    Are you sure you want to delete this
                                    message? This action cannot be undone.
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDeleteMessage}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>
                                            <span className="ms-2">
                                                Deleting...
                                            </span>
                                        </>
                                    ) : (
                                        "Delete"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Messages Modal */}
            <div
                className="modal fade show"
                style={{
                    display: "block",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 1050,
                }}
                onClick={onClose}
            >
                <div
                    className="modal-dialog modal-dialog-centered modal-lg"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-content" style={{ height: "75vh" }}>
                        {/* Header */}
                        <div className="modal-header border-bottom-0">
                            <div className="d-flex align-items-center w-100">
                                {selectedMessage && (
                                    <button
                                        className="btn btn-link me-2 p-0"
                                        onClick={handleBackToList}
                                    >
                                        <i className="bi bi-arrow-left fs-4"></i>
                                    </button>
                                )}
                                <h5 className="modal-title mb-0 flex-grow-1">
                                    Landing Page Messages
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={onClose}
                                />
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="modal-body p-0 d-flex flex-column">
                            {loading ? (
                                <div className="d-flex justify-content-center align-items-center h-100">
                                    <div
                                        className="spinner-border text-primary"
                                        role="status"
                                    >
                                        <span className="visually-hidden">
                                            Loading...
                                        </span>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="alert alert-danger m-3">
                                    {error}
                                </div>
                            ) : selectedMessage ? (
                                <div className="d-flex flex-column h-100">
                                    {/* Message Header */}
                                    <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1 ms-3 text-start">
                                                <h5 className="mb-0">
                                                    {selectedMessage.name}
                                                </h5>
                                                <small className="text-muted">
                                                    {selectedMessage.email}
                                                </small>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <small className="text-muted me-3">
                                                {new Date(
                                                    selectedMessage.created_at
                                                ).toLocaleString()}
                                            </small>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() =>
                                                    confirmDelete(
                                                        selectedMessage
                                                    )
                                                }
                                                disabled={isDeleting}
                                            >
                                                {isDeleting ? (
                                                    <span
                                                        className="spinner-border spinner-border-sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                    ></span>
                                                ) : (
                                                    <i className="bi bi-trash"></i>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Message Content */}
                                    <div
                                        className="overflow-auto"
                                        style={{
                                            maxHeight: "50vh",
                                            overflowY: "auto",
                                        }}
                                    >
                                        <div className="d-flex justify-content-start mb-3">
                                            <div
                                                className="bg-white rounded-3 p-3 shadow-sm position-relative"
                                                style={{ maxWidth: "80%" }}
                                            >
                                                <p className="mb-0">
                                                    {selectedMessage.message}
                                                </p>
                                                <div className="text-end mt-2">
                                                    <small className="text-muted">
                                                        {new Date(
                                                            selectedMessage.created_at
                                                        ).toLocaleTimeString(
                                                            [],
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Search Bar */}
                                    <div className="px-3 pb-2">
                                        <div className="input-group">
                                            <span className="input-group-text bg-white">
                                                <i className="bi bi-search"></i>
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search messages..."
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Messages List */}
                                    <div
                                        className="overflow-auto"
                                        style={{
                                            maxHeight: "55vh",
                                            overflowY: "auto",
                                        }}
                                    >
                                        {filteredMessages.length === 0 ? (
                                            <div className="text-center py-5">
                                                <i className="bi bi-envelope-open fs-1 text-muted"></i>
                                                <p className="mt-2">
                                                    No messages found
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="list-group list-group-flush">
                                                {filteredMessages.map((msg) => (
                                                    <div
                                                        key={msg.id}
                                                        className={`list-group-item list-group-item-action border-0 d-flex justify-content-between align-items-center ${
                                                            selectedMessage?.id ===
                                                            msg.id
                                                                ? "bg-light"
                                                                : ""
                                                        }`}
                                                    >
                                                        <div
                                                            className="flex-grow-1 d-flex align-items-center"
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() =>
                                                                handleMessageClick(
                                                                    msg
                                                                )
                                                            }
                                                        >
                                                            <div className="me-3">
                                                                <div
                                                                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                                                    style={{
                                                                        width: "40px",
                                                                        height: "40px",
                                                                    }}
                                                                >
                                                                    {msg.name
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()}
                                                                </div>
                                                            </div>
                                                            <div className="flex-grow-1">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <h6 className="mb-0">
                                                                        {
                                                                            msg.name
                                                                        }
                                                                    </h6>
                                                                    <small className="text-muted">
                                                                        {new Date(
                                                                            msg.created_at
                                                                        ).toLocaleDateString()}
                                                                    </small>
                                                                </div>
                                                                <p
                                                                    className="mb-0 text-muted text-truncate"
                                                                    style={{
                                                                        maxWidth:
                                                                            "400px",
                                                                        textAlign:
                                                                            "left",
                                                                    }}
                                                                >
                                                                    {
                                                                        msg.message
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactMessagesModal;
