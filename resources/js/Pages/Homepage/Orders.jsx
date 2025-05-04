import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Head, Link } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import Navbar from "@/Components/Navbar";
import LogoutModal from "@/Components/LogoutModal";
import OrderDetailsModal from "../modals/OrderDetailsModal";
import StatusModal from "../modals/StatusModal";

export default function Orders({ auth, orders }) {
    useEffect(() => {
        AOS.init();
    }, []);

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const [statusFilter, setStatusFilter] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

    const [statusModalData, setStatusModalData] = useState({
        isSuccess: false,
        title: "",
        message: "",
    });

    const handleCancelSuccess = () => {
        setStatusModalData({
            isSuccess: true,
            title: "Cancelled",
            message: "Your order has been cancelled",
        });
        setShowStatusModal(true);
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
        setShowModal(false);
    };

    // Format date function with conditional display
    const formatDate = (dateString, showTime = false) => {
        if (!dateString) return "N/A";

        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
            ...(showTime && { hour: "2-digit", minute: "2-digit" }),
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Get status color with additional styling
    const getStatusColor = (status) => {
        const statusStyles = {
            completed: {
                bg: "bg-success",
                text: "text-white",
                icon: "bi-check-circle-fill",
            },
            ongoing: {
                bg: "bg-warning",
                text: "text-dark",
                icon: "bi-arrow-repeat",
            },
            pending: {
                bg: "bg-secondary",
                text: "text-white",
                icon: "bi-clock-fill",
            },
            cancelled: {
                bg: "bg-danger",
                text: "text-white",
                icon: "bi-x-circle-fill",
            },
            shipped: {
                bg: "bg-info",
                text: "text-white",
                icon: "bi-truck",
            },
            default: {
                bg: "bg-secondary",
                text: "text-white",
                icon: "bi-question-circle-fill",
            },
        };

        return statusStyles[status.toLowerCase()] || statusStyles.default;
    };

    // Filter orders based on status
    const filteredOrders = orders.filter((order) => {
        if (statusFilter === "") {
            return order.status.toLowerCase() !== "cancelled"; // Exclude cancelled orders
        } else {
            return order.status.toLowerCase() === statusFilter.toLowerCase();
        }
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const currentOrders = filteredOrders.slice(
        (currentPage - 1) * ordersPerPage,
        currentPage * ordersPerPage
    );

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div
            className={`d-flex ${sidebarOpen ? "sidebar-open" : ""}`}
            style={{ overflow: "hidden" }}
        >
            <Head title="My Orders" />

            <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div
                className="content flex-grow-1"
                style={{
                    marginLeft: sidebarOpen ? "220px" : "0",
                    transition: "margin-left 0.3s ease",
                    backgroundColor: "#F8F9FA",
                    minHeight: "100vh",
                }}
            >
                <div
                    className="position-relative"
                    style={{ paddingTop: "50px" }}
                >
                    <Navbar
                        toggleSidebar={toggleSidebar}
                        setShowLogoutModal={setShowLogoutModal}
                    />

                    <div
                        className="px-4 py-5 mt-2"
                        style={{
                            maxWidth: "1220px",
                            margin: "0 auto",
                        }}
                    >
                        <div className="row">
                            <div className="col-12">
                                <div className="card border-0 shadow-sm mb-4">
                                    <div className="card-header bg-white border-bottom py-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
                                        <h4 className="mb-0">My Orders</h4>

                                        <div className="d-flex align-items-center">
                                            <label
                                                htmlFor="statusFilter"
                                                className="me-2 mb-0 fw-semibold"
                                            >
                                                Filter:
                                            </label>
                                            <select
                                                id="statusFilter"
                                                className="form-select form-select-sm"
                                                style={{ width: "110px" }}
                                                value={statusFilter}
                                                onChange={(e) =>
                                                    setStatusFilter(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">All</option>
                                                <option value="pending">
                                                    Pending
                                                </option>
                                                <option value="ongoing">
                                                    Ongoing
                                                </option>
                                                <option value="shipped">
                                                    Shipped
                                                </option>
                                                <option value="completed">
                                                    Completed
                                                </option>
                                                <option value="cancelled">
                                                    Cancelled
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="card-body p-0">
                                        {filteredOrders.length === 0 ? (
                                            <div className="text-center py-5">
                                                <i className="bi bi-box-seam display-4 text-muted mb-3"></i>
                                                <h5 className="mb-2">
                                                    No orders found
                                                </h5>
                                                <p className="text-muted mb-4">
                                                    You haven't placed any
                                                    orders yet.
                                                </p>
                                                <Link
                                                    href="/products"
                                                    className="btn btn-dark px-4"
                                                >
                                                    Browse Products
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="table-responsive">
                                                <table className="table table-hover align-middle mb-0">
                                                    <thead className="bg-white border-bottom text-uppercase small text-muted">
                                                        <tr>
                                                            <th></th>
                                                            <th>Order #</th>
                                                            <th>Items</th>
                                                            <th>
                                                                Estimated
                                                                Completion
                                                            </th>
                                                            <th>Status</th>
                                                            <th>Payment</th>
                                                            <th>Total</th>
                                                            <th>Balance</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentOrders.map(
                                                            (order) => {
                                                                const statusStyle =
                                                                    getStatusColor(
                                                                        order.status
                                                                    );

                                                                return (
                                                                    <tr
                                                                        key={
                                                                            order.id
                                                                        }
                                                                        className="align-middle"
                                                                    >
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
                                                                        <td className="fw-semibold">
                                                                            #
                                                                            {
                                                                                order.id
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            <span className="badge bg-light text-dark rounded-pill px-3">
                                                                                {
                                                                                    order
                                                                                        .items
                                                                                        .length
                                                                                }
                                                                                {order
                                                                                    .items
                                                                                    .length ===
                                                                                1
                                                                                    ? "item"
                                                                                    : "items"}
                                                                            </span>
                                                                        </td>
                                                                        <td>
                                                                            <div className="d-flex flex-column">
                                                                                <small className="text-muted">
                                                                                    Estimate:
                                                                                </small>
                                                                                <span>
                                                                                    {order.estimated_completion_date
                                                                                        ? formatDate(
                                                                                              order.estimated_completion_date
                                                                                          )
                                                                                        : "-"}
                                                                                </span>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <span
                                                                                className={`badge rounded-pill px-3 py-2 fw-medium ${statusStyle.bg} ${statusStyle.text}`}
                                                                            >
                                                                                <i
                                                                                    className={`bi ${statusStyle.icon} me-1`}
                                                                                ></i>
                                                                                {
                                                                                    order.status
                                                                                }
                                                                            </span>
                                                                        </td>
                                                                        <td>
                                                                            <span
                                                                                className={`badge rounded-pill px-3 ${
                                                                                    order.payment_status ===
                                                                                    "paid"
                                                                                        ? "bg-success text-white" // Green for fully paid
                                                                                        : order.payment_status ===
                                                                                          "partially_paid"
                                                                                        ? "bg-warning text-dark" // Yellow for partially paid
                                                                                        : order.payment_status ===
                                                                                              "unpaid" ||
                                                                                          order.payment_status ===
                                                                                              "pending_payment"
                                                                                        ? "bg-secondary text-white" // Gray for unpaid or pending
                                                                                        : "bg-dark text-white" // Default fallback
                                                                                }`}
                                                                            >
                                                                                {order.payment_status ===
                                                                                "paid"
                                                                                    ? "Paid"
                                                                                    : order.payment_status ===
                                                                                      "partially_paid"
                                                                                    ? "Partially Paid"
                                                                                    : order.payment_status ===
                                                                                          "unpaid" ||
                                                                                      order.payment_status ===
                                                                                          "pending_payment"
                                                                                    ? "Unpaid"
                                                                                    : "Unknown"}
                                                                            </span>
                                                                        </td>
                                                                        <td className="fw-semibold text-dark">
                                                                            ₱
                                                                            {Number(
                                                                                order.total_amount
                                                                            ).toLocaleString(
                                                                                "en-PH"
                                                                            )}
                                                                        </td>
                                                                        <td className="fw-semibold text-dark">
                                                                            {order.payment_status ===
                                                                                "unpaid" ||
                                                                            order.payment_status ===
                                                                                "pending_payment" ? (
                                                                                <>
                                                                                    ₱
                                                                                    {Number(
                                                                                        order.total_amount
                                                                                    ).toLocaleString(
                                                                                        "en-PH"
                                                                                    )}
                                                                                </>
                                                                            ) : order.payment_status ===
                                                                              "partially_paid" ? (
                                                                                <>
                                                                                    ₱
                                                                                    {Number(
                                                                                        order.total_amount /
                                                                                            2
                                                                                    ).toLocaleString(
                                                                                        "en-PH"
                                                                                    )}
                                                                                </>
                                                                            ) : Number(
                                                                                  order.total_amount -
                                                                                      (order.down_payment_amount ||
                                                                                          0)
                                                                              ) ===
                                                                              0 ? (
                                                                                <span className="text-success fw-bold d-flex align-items-center gap-1">
                                                                                    <i className="bi bi-check-circle-fill"></i>
                                                                                </span>
                                                                            ) : (
                                                                                <>
                                                                                    ₱
                                                                                    {Number(
                                                                                        order.total_amount -
                                                                                            (order.down_payment_amount ||
                                                                                                0)
                                                                                    ).toLocaleString(
                                                                                        "en-PH"
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                    {filteredOrders.length > 0 && (
                                        <div className="card-footer bg-white border-top py-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="text-muted small">
                                                    Showing{" "}
                                                    {currentOrders.length} of{" "}
                                                    {filteredOrders.length}{" "}
                                                    orders
                                                </div>
                                                <nav aria-label="Page navigation">
                                                    <ul className="pagination pagination-sm mb-0">
                                                        <li
                                                            className={`page-item ${
                                                                currentPage ===
                                                                1
                                                                    ? "disabled"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <a
                                                                className="page-link"
                                                                onClick={() =>
                                                                    handlePageChange(
                                                                        currentPage -
                                                                            1
                                                                    )
                                                                }
                                                            >
                                                                Previous
                                                            </a>
                                                        </li>
                                                        {Array.from(
                                                            {
                                                                length: totalPages,
                                                            },
                                                            (_, index) => (
                                                                <li
                                                                    key={
                                                                        index +
                                                                        1
                                                                    }
                                                                    className={`page-item ${
                                                                        currentPage ===
                                                                        index +
                                                                            1
                                                                            ? "active"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    <a
                                                                        className="page-link"
                                                                        onClick={() =>
                                                                            handlePageChange(
                                                                                index +
                                                                                    1
                                                                            )
                                                                        }
                                                                    >
                                                                        {index +
                                                                            1}
                                                                    </a>
                                                                </li>
                                                            )
                                                        )}
                                                        <li
                                                            className={`page-item ${
                                                                currentPage ===
                                                                totalPages
                                                                    ? "disabled"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <a
                                                                className="page-link"
                                                                onClick={() =>
                                                                    handlePageChange(
                                                                        currentPage +
                                                                            1
                                                                    )
                                                                }
                                                            >
                                                                Next
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Component */}
            <OrderDetailsModal
                order={selectedOrder}
                onClose={handleCloseModal}
                show={showModal}
                onCancelSuccess={handleCancelSuccess} // Pass the success handler
            />

            <StatusModal
                show={showStatusModal}
                onHide={() => setShowStatusModal(false)}
                isSuccess={statusModalData.isSuccess}
                title={statusModalData.title}
                message={statusModalData.message}
            />

            <LogoutModal
                showLogoutModal={showLogoutModal}
                setShowLogoutModal={setShowLogoutModal}
            />
        </div>
    );
}
