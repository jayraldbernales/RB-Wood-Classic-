import React from "react";
import { router } from "@inertiajs/react"; // Import router directly
import { Button, Form, Modal } from "react-bootstrap";

const OrderEditModal = ({ order, show, onHide, onSuccess }) => {
    const [formData, setFormData] = React.useState({
        status: order?.status || "",
        payment_status: order?.payment_status || "",
        start_date: order?.start_date || "",
        estimated_completion_date: order?.estimated_completion_date || "",
        actual_completion_date: order?.actual_completion_date || "",
    });

    const [processing, setProcessing] = React.useState(false);
    const [errors, setErrors] = React.useState({});

    // In OrderEditModal.jsx
    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.put(`/admin/orders/${order.id}`, formData, {
            preserveScroll: true,
            onSuccess: (page) => {
                const updatedOrder = page.props.orders.find(
                    (o) => o.id === order.id
                );
                onSuccess(updatedOrder);
                onHide();
                setProcessing(false);
            },
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
                if (onError) onError(errors); // Call the onError callback
            },
        });
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when field changes
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton className="bg-light">
                <Modal.Title>Edit Order #{order?.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <Form.Group>
                                <Form.Label>Payment Status</Form.Label>
                                <Form.Select
                                    value={formData.payment_status}
                                    onChange={(e) =>
                                        handleChange(
                                            "payment_status",
                                            e.target.value
                                        )
                                    }
                                    className={
                                        errors.payment_status && "is-invalid"
                                    }
                                >
                                    <option value="unpaid">Unpaid</option>
                                    <option value="partially_paid">
                                        Partially Paid
                                    </option>
                                    <option value="paid">Paid</option>
                                    <option value="failed">Failed</option>
                                </Form.Select>
                                {errors.payment_status && (
                                    <div className="invalid-feedback">
                                        {errors.payment_status}
                                    </div>
                                )}
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group>
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    value={formData.status}
                                    onChange={(e) =>
                                        handleChange("status", e.target.value)
                                    }
                                    className={errors.status && "is-invalid"}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="processing">
                                        Processing
                                    </option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </Form.Select>
                                {errors.status && (
                                    <div className="invalid-feedback">
                                        {errors.status}
                                    </div>
                                )}
                            </Form.Group>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-4">
                            <Form.Group>
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) =>
                                        handleChange(
                                            "start_date",
                                            e.target.value
                                        )
                                    }
                                    className={
                                        errors.start_date && "is-invalid"
                                    }
                                />
                                {errors.start_date && (
                                    <div className="invalid-feedback">
                                        {errors.start_date}
                                    </div>
                                )}
                            </Form.Group>
                        </div>
                        <div className="col-md-4">
                            <Form.Group>
                                <Form.Label>Estimated Completion</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={formData.estimated_completion_date}
                                    onChange={(e) =>
                                        handleChange(
                                            "estimated_completion_date",
                                            e.target.value
                                        )
                                    }
                                    className={
                                        errors.estimated_completion_date &&
                                        "is-invalid"
                                    }
                                />
                                {errors.estimated_completion_date && (
                                    <div className="invalid-feedback">
                                        {errors.estimated_completion_date}
                                    </div>
                                )}
                            </Form.Group>
                        </div>
                        <div className="col-md-4">
                            <Form.Group>
                                <Form.Label>Actual Completion</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={formData.actual_completion_date}
                                    onChange={(e) =>
                                        handleChange(
                                            "actual_completion_date",
                                            e.target.value
                                        )
                                    }
                                    className={
                                        errors.actual_completion_date &&
                                        "is-invalid"
                                    }
                                />
                                {errors.actual_completion_date && (
                                    <div className="invalid-feedback">
                                        {errors.actual_completion_date}
                                    </div>
                                )}
                            </Form.Group>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end pt-3 border-top">
                        <Button
                            variant="outline-secondary"
                            className="me-2"
                            onClick={onHide}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="dark"
                            disabled={processing}
                        >
                            {processing ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default OrderEditModal;
