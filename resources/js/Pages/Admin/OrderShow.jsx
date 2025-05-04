import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Card, Badge, Button, Table } from "react-bootstrap";

export default function OrderShow({ order }) {
    // Status badge styling
    const getStatusBadge = (status) => {
        const statusColors = {
            pending: { bg: "rgba(13, 110, 253, 0.1)", text: "#0d6efd" },
            processing: { bg: "rgba(255, 193, 7, 0.1)", text: "#ffc107" },
            completed: { bg: "rgba(25, 135, 84, 0.1)", text: "#198754" },
            cancelled: { bg: "rgba(220, 53, 69, 0.1)", text: "#dc3545" },
        };

        return (
            <Badge
                style={{
                    backgroundColor: statusColors[status]?.bg || "#e9ecef",
                    color: statusColors[status]?.text || "#495057",
                    fontWeight: "500",
                    padding: "0.5em 0.8em",
                    textTransform: "capitalize",
                }}
            >
                {status}
            </Badge>
        );
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(amount);
    };

    return (
        <AdminLayout>
            <Head title={`Order #${order.id}`} />

            <div className="container-fluid px-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-semibold" style={{ color: "#5a4a3a" }}>
                        Order #${order.id}
                    </h2>
                    <Button
                        as={Link}
                        href={route("admin.orders.index")}
                        variant="outline-secondary"
                        style={{
                            borderColor: "rgba(201, 166, 107, 0.5)",
                            color: "#5a4a3a",
                        }}
                    >
                        <i className="bi bi-arrow-left me-1"></i> Back to Orders
                    </Button>
                </div>

                <div className="row">
                    <div className="col-md-8">
                        {/* Order Items */}
                        <Card className="mb-4 border-0 shadow-sm">
                            <Card.Header
                                style={{
                                    backgroundColor:
                                        "rgba(201, 166, 107, 0.05)",
                                    borderBottom:
                                        "1px solid rgba(201, 166, 107, 0.2)",
                                }}
                            >
                                <h5
                                    className="mb-0"
                                    style={{ color: "#5a4a3a" }}
                                >
                                    Order Items
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <Table hover className="mb-0">
                                    <thead>
                                        <tr>
                                            <th style={{ color: "#5a4a3a" }}>
                                                Product
                                            </th>
                                            <th style={{ color: "#5a4a3a" }}>
                                                Price
                                            </th>
                                            <th style={{ color: "#5a4a3a" }}>
                                                Quantity
                                            </th>
                                            <th style={{ color: "#5a4a3a" }}>
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.order_items.map((item) => (
                                            <tr key={item.id}>
                                                <td
                                                    style={{ color: "#5a4a3a" }}
                                                >
                                                    <div className="d-flex align-items-center">
                                                        {item.product.images
                                                            ?.length > 0 && (
                                                            <img
                                                                src={`/storage/${item.product.images[0].image}`}
                                                                alt={
                                                                    item.product
                                                                        .name
                                                                }
                                                                style={{
                                                                    width: "50px",
                                                                    height: "50px",
                                                                    objectFit:
                                                                        "cover",
                                                                    marginRight:
                                                                        "10px",
                                                                }}
                                                            />
                                                        )}
                                                        <div>
                                                            <div
                                                                style={{
                                                                    fontWeight:
                                                                        "500",
                                                                }}
                                                            >
                                                                {
                                                                    item.product
                                                                        .name
                                                                }
                                                            </div>
                                                            <div className="text-muted small">
                                                                {
                                                                    item.product
                                                                        .category
                                                                        .name
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td
                                                    style={{ color: "#5a4a3a" }}
                                                >
                                                    {formatCurrency(item.price)}
                                                </td>
                                                <td
                                                    style={{ color: "#5a4a3a" }}
                                                >
                                                    {item.quantity}
                                                </td>
                                                <td
                                                    style={{
                                                        color: "#5a4a3a",
                                                        fontWeight: "500",
                                                    }}
                                                >
                                                    {formatCurrency(
                                                        item.price *
                                                            item.quantity
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td
                                                colSpan="3"
                                                style={{
                                                    textAlign: "right",
                                                    fontWeight: "500",
                                                    color: "#5a4a3a",
                                                }}
                                            >
                                                Subtotal:
                                            </td>
                                            <td
                                                style={{
                                                    fontWeight: "500",
                                                    color: "#5a4a3a",
                                                }}
                                            >
                                                {formatCurrency(
                                                    order.total_amount
                                                )}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </Table>
                            </Card.Body>
                        </Card>
                    </div>

                    <div className="col-md-4">
                        {/* Order Summary */}
                        <Card className="mb-4 border-0 shadow-sm">
                            <Card.Header
                                style={{
                                    backgroundColor:
                                        "rgba(201, 166, 107, 0.05)",
                                    borderBottom:
                                        "1px solid rgba(201, 166, 107, 0.2)",
                                }}
                            >
                                <h5
                                    className="mb-0"
                                    style={{ color: "#5a4a3a" }}
                                >
                                    Order Summary
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="mb-3">
                                    <div className="small text-muted">
                                        Order Status
                                    </div>
                                    <div>{getStatusBadge(order.status)}</div>
                                </div>
                                <div className="mb-3">
                                    <div className="small text-muted">
                                        Payment Status
                                    </div>
                                    <div
                                        style={{ textTransform: "capitalize" }}
                                    >
                                        {order.payment_status || "N/A"}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="small text-muted">
                                        Payment Method
                                    </div>
                                    <div>{order.payment_method || "N/A"}</div>
                                </div>
                                <div className="mb-3">
                                    <div className="small text-muted">
                                        Order Date
                                    </div>
                                    <div>
                                        {new Date(
                                            order.created_at
                                        ).toLocaleString()}
                                    </div>
                                </div>
                                {order.message && (
                                    <div className="mb-3">
                                        <div className="small text-muted">
                                            Customer Message
                                        </div>
                                        <div>{order.message}</div>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>

                        {/* Customer Information */}
                        <Card className="border-0 shadow-sm">
                            <Card.Header
                                style={{
                                    backgroundColor:
                                        "rgba(201, 166, 107, 0.05)",
                                    borderBottom:
                                        "1px solid rgba(201, 166, 107, 0.2)",
                                }}
                            >
                                <h5
                                    className="mb-0"
                                    style={{ color: "#5a4a3a" }}
                                >
                                    Customer Information
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="mb-2">
                                    <div className="small text-muted">Name</div>
                                    <div>{order.user.name}</div>
                                </div>
                                {order.user.email && (
                                    <div className="mb-2">
                                        <div className="small text-muted">
                                            Email
                                        </div>
                                        <div>{order.user.email}</div>
                                    </div>
                                )}
                                {order.user.phone_number && (
                                    <div className="mb-2">
                                        <div className="small text-muted">
                                            Phone
                                        </div>
                                        <div>{order.user.phone_number}</div>
                                    </div>
                                )}
                                {order.user.address && (
                                    <div className="mb-2">
                                        <div className="small text-muted">
                                            Address
                                        </div>
                                        <div>{order.user.address}</div>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
