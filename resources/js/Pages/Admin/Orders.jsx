import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import AOS from "aos";
import "aos/dist/aos.css";
import LogoutModal from "@/Components/LogoutModal";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import {
    Table,
    Form,
    Button,
    Badge,
    Pagination,
    Dropdown,
    Modal,
} from "react-bootstrap";
import OrderDetailsModal from "./OrderDetailsModal";
import OrderEditModal from "./OrderEdit";
import StatusModal from "../modals/StatusModal";

export default function Orders({ orders: initialOrders }) {
    // Accept orders as a prop
    useEffect(() => {
        AOS.init();
    }, []);

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortConfig, setSortConfig] = useState({
        key: "date",
        direction: "desc",
    });
    const [orders, setOrders] = useState(initialOrders); // Initialize orders from props

    const [isDeleting, setIsDeleting] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

    // Add this function to handle viewing an order
    const handleViewOrder = (order) => {
        setSelectedOrderDetails(order);
        setShowViewModal(true);
    };

    // SHow status modal
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusModalProps, setStatusModalProps] = useState({
        isSuccess: true,
        title: "",
        message: "",
    });

    // Function to show status modal
    const handleShowStatusModal = (isSuccess, title, message) => {
        setStatusModalProps({ isSuccess, title, message });
        setShowStatusModal(true);
    };

    // Add these functions to your component
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedOrderForEdit, setSelectedOrderForEdit] = useState(null);

    const handleEditClick = (order) => {
        setSelectedOrderForEdit(order);
        setShowEditModal(true);
    };

    const handleDeleteOrder = (order) => {
        setSelectedOrder(order); // Set the selected order for the modal
        setShowDeleteModal(true); // Show the modal
    };

    // Filter and sort orders
    const filteredOrders = orders
        .filter(
            (order) =>
                (statusFilter === "All" || order.status === statusFilter) &&
                (order.id.toString().includes(searchTerm) ||
                    order.user.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => {
            // Handle date fields differently
            if (
                sortConfig.key.includes("date") ||
                sortConfig.key.includes("start_date") ||
                sortConfig.key.includes("completion_date")
            ) {
                const dateA = new Date(a[sortConfig.key] || 0);
                const dateB = new Date(b[sortConfig.key] || 0);
                return sortConfig.direction === "asc"
                    ? dateA - dateB
                    : dateB - dateA;
            }

            // Default comparison for other fields
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });

    // Pagination
    const ordersPerPage = 5;
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const currentOrders = filteredOrders.slice(
        (currentPage - 1) * ordersPerPage,
        currentPage * ordersPerPage
    );

    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Get status color with additional styling
    const formatPaymentStatus = (status) => {
        const statusMap = {
            paid: "Paid",
            partially_paid: "Partially Paid",
            unpaid: "Unpaid",
            pending_payment: "Pending Payment",
            failed: "Failed",
        };
        return statusMap[status] || status;
    };

    const formatStatus = (status) => {
        const statusMap = {
            completed: "Completed",
            processing: "Processing",
            pending: "Pending",
            cancelled: "Cancelled",
            ongoing: "Ongoing",
        };
        return statusMap[status] || status;
    };

    const getStatusColor = (status) => {
        const statusStyles = {
            completed: {
                bg: "bg-success",
                text: "text-white",
            },
            processing: {
                bg: "bg-info",
                text: "text-white",
            },
            pending: {
                bg: "bg-warning",
                text: "text-dark",
            },
            cancelled: {
                bg: "bg-danger",
                text: "text-white",
            },
            ongoing: {
                bg: "bg-primary",
                text: "text-white",
            },
            default: {
                bg: "bg-secondary",
                text: "text-white",
            },
        };

        return statusStyles[status.toLowerCase()] || statusStyles.default;
    };

    const getPaymentStatusColor = (status) => {
        const statusStyles = {
            paid: {
                bg: "bg-success",
                text: "text-white",
            },
            partially_paid: {
                bg: "bg-primary",
                text: "text-white",
            },
            unpaid: {
                bg: "bg-secondary",
                text: "text-white",
            },
            pending_payment: {
                bg: "bg-warning",
                text: "text-dark",
            },
            failed: {
                bg: "bg-danger",
                text: "text-white",
            },
            default: {
                bg: "bg-secondary",
                text: "text-white",
            },
        };
        return statusStyles[status.toLowerCase()] || statusStyles.default;
    };

    return (
        <div className={`d-flex ${sidebarOpen ? "sidebar-open " : ""}`}>
            {/* Sidebar */}
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                activePage="orders"
            />
            {/* Main Content */}
            <div
                className="content flex-grow-1"
                style={{
                    marginLeft: sidebarOpen ? "220px" : "0",
                    transition: "margin-left 0.3s ease",
                    overflowY: "auto",
                }}
            >
                {/* Hero Section */}
                <div
                    className="position-relative min-vh-100 d-flex text-center"
                    style={{ background: "#F6F4F5" }}
                >
                    {/* Navbar Component */}
                    <AdminNavbar
                        toggleSidebar={toggleSidebar}
                        setShowLogoutModal={setShowLogoutModal}
                    />

                    {/* Orders Content */}
                    <div
                        className="container px-4 py-3"
                        style={{
                            maxWidth: "1200px",
                            paddingBottom: "40px",
                            marginTop: "100px",
                        }}
                    >
                        {/* Page Header */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 style={{ fontWeight: "600" }}>
                                Orders Management
                            </h2>
                        </div>

                        {/* Filters and Search */}
                        <div
                            className="card border-0 mb-4"
                            style={{
                                borderRadius: "12px",
                                background: "white",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                                border: "1px solid rgba(201, 166, 107, 0.2)",
                            }}
                        >
                            <div className="card-body p-3">
                                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                    {/* Search Input */}
                                    <div className="col-md-6">
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-end-0">
                                                <i
                                                    className="bi bi-search"
                                                    style={{ color: "#a07e45" }}
                                                ></i>
                                            </span>
                                            <Form.Control
                                                type="text"
                                                placeholder="Search by order ID or customer"
                                                value={searchTerm}
                                                onChange={(e) =>
                                                    setSearchTerm(
                                                        e.target.value
                                                    )
                                                }
                                                style={{ borderLeft: "0" }}
                                            />
                                        </div>
                                    </div>

                                    {/* Status Filter */}
                                    <div className="col-md-2 ms-auto">
                                        <Form.Select
                                            value={statusFilter}
                                            onChange={(e) =>
                                                setStatusFilter(e.target.value)
                                            }
                                            style={{ color: "#5a4a3a" }}
                                        >
                                            <option value="All">All</option>
                                            <option value="pending">
                                                Pending
                                            </option>
                                            <option value="ongoing">
                                                Ongoing
                                            </option>
                                            <option value="processing">
                                                Processing
                                            </option>
                                            <option value="shipped">
                                                Shipped
                                            </option>
                                            <option value="delivered">
                                                Delivered
                                            </option>
                                            <option value="cancelled">
                                                Cancelled
                                            </option>
                                        </Form.Select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Orders Table */}
                        <div
                            className="card border-0"
                            style={{
                                borderRadius: "12px",
                                background: "white",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                                border: "1px solid rgba(201, 166, 107, 0.2)",
                            }}
                        >
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <Table hover className="mb-0">
                                        <thead
                                            style={{
                                                backgroundColor:
                                                    "rgba(201, 166, 107, 0.05)",
                                            }}
                                        >
                                            <tr>
                                                <th></th>
                                                <th
                                                    style={{
                                                        color: "#5a4a3a",
                                                        fontWeight: "600",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                        requestSort("id")
                                                    }
                                                >
                                                    Order ID
                                                    {sortConfig.key ===
                                                        "id" && (
                                                        <span className="ms-1">
                                                            {sortConfig.direction ===
                                                            "asc"
                                                                ? "↑"
                                                                : "↓"}
                                                        </span>
                                                    )}
                                                </th>
                                                <th
                                                    style={{
                                                        color: "#5a4a3a",
                                                        fontWeight: "600",
                                                    }}
                                                    onClick={() =>
                                                        requestSort("customer")
                                                    }
                                                >
                                                    Customer
                                                    {sortConfig.key ===
                                                        "customer" && (
                                                        <span className="ms-1">
                                                            {sortConfig.direction ===
                                                            "asc"
                                                                ? "↑"
                                                                : "↓"}
                                                        </span>
                                                    )}
                                                </th>
                                                <th
                                                    style={{
                                                        color: "#5a4a3a",
                                                        fontWeight: "600",
                                                        cursor: "pointer", // Add pointer cursor to indicate it's clickable
                                                    }}
                                                    onClick={() =>
                                                        requestSort(
                                                            "created_at"
                                                        )
                                                    } // Sort by created_at
                                                >
                                                    Date
                                                    {sortConfig.key ===
                                                        "created_at" && (
                                                        <span className="ms-1">
                                                            {sortConfig.direction ===
                                                            "asc"
                                                                ? "↑"
                                                                : "↓"}
                                                        </span>
                                                    )}
                                                </th>

                                                <th
                                                    style={{
                                                        color: "#5a4a3a",
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    Payment Status
                                                </th>
                                                <th
                                                    style={{
                                                        color: "#5a4a3a",
                                                        fontWeight: "600",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                        requestSort(
                                                            "start_date"
                                                        )
                                                    }
                                                >
                                                    Started
                                                    {sortConfig.key ===
                                                        "start_date" && (
                                                        <span className="ms-1">
                                                            {sortConfig.direction ===
                                                            "asc"
                                                                ? "↑"
                                                                : "↓"}
                                                        </span>
                                                    )}
                                                </th>
                                                <th
                                                    style={{
                                                        color: "#5a4a3a",
                                                        fontWeight: "600",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                        requestSort(
                                                            "estimated_completion_date"
                                                        )
                                                    }
                                                >
                                                    Estimated Completion
                                                    {sortConfig.key ===
                                                        "estimated_completion_date" && (
                                                        <span className="ms-1">
                                                            {sortConfig.direction ===
                                                            "asc"
                                                                ? "↑"
                                                                : "↓"}
                                                        </span>
                                                    )}
                                                </th>

                                                <th
                                                    style={{
                                                        color: "#5a4a3a",
                                                        fontWeight: "600",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                        requestSort(
                                                            "actual_completion_date"
                                                        )
                                                    }
                                                >
                                                    Completed
                                                    {sortConfig.key ===
                                                        "actual_completion_date" && (
                                                        <span className="ms-1">
                                                            {sortConfig.direction ===
                                                            "asc"
                                                                ? "↑"
                                                                : "↓"}
                                                        </span>
                                                    )}
                                                </th>
                                                <th
                                                    style={{
                                                        color: "#5a4a3a",
                                                        fontWeight: "600",
                                                    }}
                                                    onClick={() =>
                                                        requestSort("status")
                                                    }
                                                >
                                                    Status
                                                    {sortConfig.key ===
                                                        "status" && (
                                                        <span className="ms-1">
                                                            {sortConfig.direction ===
                                                            "asc"
                                                                ? "↑"
                                                                : "↓"}
                                                        </span>
                                                    )}
                                                </th>
                                                <th
                                                    style={{
                                                        color: "#5a4a3a",
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentOrders.length > 0 ? (
                                                currentOrders.map((order) => (
                                                    <tr key={order.id}>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-outline-secondary"
                                                                onClick={() =>
                                                                    handleViewOrder(
                                                                        order
                                                                    )
                                                                }
                                                            >
                                                                <i className="bi bi-eye"></i>
                                                            </button>
                                                        </td>
                                                        <td
                                                            style={{
                                                                color: "#5a4a3a",
                                                                fontWeight:
                                                                    "500",
                                                            }}
                                                        >
                                                            #{order.id}
                                                        </td>
                                                        <td
                                                            style={{
                                                                color: "#5a4a3a",
                                                            }}
                                                        >
                                                            {order.user.name}
                                                        </td>
                                                        <td
                                                            style={{
                                                                color: "#5a4a3a",
                                                            }}
                                                        >
                                                            {new Date(
                                                                order.created_at
                                                            ).toLocaleDateString()}
                                                        </td>

                                                        <td>
                                                            <Badge
                                                                className={`${
                                                                    getPaymentStatusColor(
                                                                        order.payment_status
                                                                    ).bg
                                                                } ${
                                                                    getPaymentStatusColor(
                                                                        order.payment_status
                                                                    ).text
                                                                }`}
                                                                style={{
                                                                    fontWeight:
                                                                        "500",
                                                                    padding:
                                                                        "0.5em 0.8em",
                                                                }}
                                                            >
                                                                <i
                                                                    className={`bi ${
                                                                        getPaymentStatusColor(
                                                                            order.payment_status
                                                                        ).icon
                                                                    } me-1`}
                                                                ></i>
                                                                {formatPaymentStatus(
                                                                    order.payment_status
                                                                )}
                                                            </Badge>
                                                        </td>
                                                        <td
                                                            style={{
                                                                color: "#5a4a3a",
                                                            }}
                                                        >
                                                            {order.start_date ||
                                                                "-"}
                                                        </td>

                                                        <td
                                                            style={{
                                                                color: "#5a4a3a",
                                                            }}
                                                        >
                                                            {order.estimated_completion_date ||
                                                                "-"}
                                                        </td>
                                                        <td
                                                            style={{
                                                                color: "#5a4a3a",
                                                            }}
                                                        >
                                                            {order.actual_completion_date ||
                                                                "-"}
                                                        </td>
                                                        <td>
                                                            <Badge
                                                                className={`${
                                                                    getStatusColor(
                                                                        order.status
                                                                    ).bg
                                                                } ${
                                                                    getStatusColor(
                                                                        order.status
                                                                    ).text
                                                                }`}
                                                                style={{
                                                                    fontWeight:
                                                                        "500",
                                                                    padding:
                                                                        "0.5em 0.8em",
                                                                }}
                                                            >
                                                                <i
                                                                    className={`bi ${
                                                                        getStatusColor(
                                                                            order.status
                                                                        ).icon
                                                                    } me-1`}
                                                                ></i>
                                                                {formatStatus(
                                                                    order.status
                                                                )}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <Dropdown>
                                                                <Dropdown.Toggle
                                                                    variant="link"
                                                                    id="dropdown-actions"
                                                                    className="custom-dropdown-toggle" // Add a custom class
                                                                    style={{
                                                                        color: "#5a4a3a",
                                                                    }}
                                                                >
                                                                    <i className="bi bi-three-dots-vertical"></i>
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item
                                                                        onClick={() =>
                                                                            handleEditClick(
                                                                                order
                                                                            )
                                                                        }
                                                                    >
                                                                        <i className="bi bi-pencil me-2"></i>{" "}
                                                                        Edit
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item
                                                                        onClick={() =>
                                                                            handleDeleteOrder(
                                                                                order
                                                                            )
                                                                        }
                                                                        className="text-danger"
                                                                    >
                                                                        <i className="bi bi-trash me-2"></i>{" "}
                                                                        Delete
                                                                    </Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="8"
                                                        className="text-center py-4"
                                                        style={{
                                                            color: "#5a4a3a",
                                                        }}
                                                    >
                                                        No orders found matching
                                                        your criteria
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="d-flex justify-content-between align-items-center p-3 border-top">
                                        <div style={{ color: "#5a4a3a" }}>
                                            Showing{" "}
                                            {(currentPage - 1) * ordersPerPage +
                                                1}{" "}
                                            to{" "}
                                            {Math.min(
                                                currentPage * ordersPerPage,
                                                filteredOrders.length
                                            )}{" "}
                                            of {filteredOrders.length} orders
                                        </div>
                                        <Pagination>
                                            <Pagination.Prev
                                                onClick={() =>
                                                    setCurrentPage(
                                                        Math.max(
                                                            1,
                                                            currentPage - 1
                                                        )
                                                    )
                                                }
                                                disabled={currentPage === 1}
                                            />
                                            {Array.from(
                                                { length: totalPages },
                                                (_, i) => i + 1
                                            ).map((page) => (
                                                <Pagination.Item
                                                    key={page}
                                                    active={
                                                        page === currentPage
                                                    }
                                                    onClick={() =>
                                                        setCurrentPage(page)
                                                    }
                                                    style={{
                                                        backgroundColor:
                                                            page === currentPage
                                                                ? "#a07e45"
                                                                : "transparent",
                                                        borderColor:
                                                            page === currentPage
                                                                ? "#a07e45"
                                                                : "#dee2e6",
                                                        color:
                                                            page === currentPage
                                                                ? "white"
                                                                : "#5a4a3a",
                                                    }}
                                                >
                                                    {page}
                                                </Pagination.Item>
                                            ))}
                                            <Pagination.Next
                                                onClick={() =>
                                                    setCurrentPage(
                                                        Math.min(
                                                            totalPages,
                                                            currentPage + 1
                                                        )
                                                    )
                                                }
                                                disabled={
                                                    currentPage === totalPages
                                                }
                                            />
                                        </Pagination>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Order Details Modal */}
            <OrderDetailsModal
                show={showViewModal}
                onHide={() => setShowViewModal(false)}
                order={selectedOrderDetails}
                getStatusColor={getStatusColor}
            />

            <StatusModal
                show={showStatusModal}
                onHide={() => setShowStatusModal(false)}
                isSuccess={statusModalProps.isSuccess}
                title={statusModalProps.title}
                message={statusModalProps.message}
            />

            {/* Logout Confirmation Modal */}
            <LogoutModal
                showLogoutModal={showLogoutModal}
                setShowLogoutModal={setShowLogoutModal}
            />

            {/* Order Edit Modal */}
            {selectedOrderForEdit && (
                <OrderEditModal
                    order={selectedOrderForEdit}
                    show={showEditModal}
                    onHide={() => setShowEditModal(false)}
                    onSuccess={(updatedOrder) => {
                        // 1. Update local state
                        setOrders(
                            orders.map((order) =>
                                order.id === updatedOrder.id
                                    ? updatedOrder
                                    : order
                            )
                        );

                        // 2. Show success message
                        handleShowStatusModal(
                            true,
                            "Success",
                            "Order updated successfully!"
                        );

                        // 3. Close edit modal
                        setShowEditModal(false);
                    }}
                    onError={(errors) => {
                        // Show error message
                        handleShowStatusModal(
                            false,
                            "Error",
                            "Failed to update order. Please try again."
                        );
                    }}
                />
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete order #{selectedOrder?.id}?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowDeleteModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            if (selectedOrder) {
                                setIsDeleting(true); // Set loading state to true
                                router.delete(
                                    route("admin.orders.destroy", {
                                        id: selectedOrder.id,
                                    }),
                                    {
                                        preserveScroll: true,
                                        onSuccess: () => {
                                            setOrders(
                                                orders.filter(
                                                    (order) =>
                                                        order.id !==
                                                        selectedOrder.id
                                                )
                                            );
                                            setShowDeleteModal(false);
                                            setSelectedOrder(null);
                                            setIsDeleting(false); // Reset loading state

                                            // Show success message
                                            handleShowStatusModal(
                                                true,
                                                "Success",
                                                "Order deleted successfully!"
                                            );
                                        },
                                        onError: () => {
                                            setIsDeleting(false); // Reset loading state
                                            // Show error message
                                            handleShowStatusModal(
                                                false,
                                                "Error",
                                                "Failed to delete order. Please try again."
                                            );
                                        },
                                    }
                                );
                            }
                        }}
                        disabled={isDeleting} // Disable button if deleting
                    >
                        {isDeleting ? "Deleting..." : "Delete Order"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
