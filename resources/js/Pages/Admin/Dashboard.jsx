import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import LogoutModal from "@/Components/LogoutModal";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [dashboardStats, setDashboardStats] = useState({
        today_orders: 0,
        monthly_orders: 0,
        year_orders: 0,
        pending_deliveries: 0,
        recent_orders: [],
        chart_data: {
            labels: [],
            data: [],
        },
    });

    useEffect(() => {
        AOS.init();
        fetchDashboardStats();

        const interval = setInterval(() => {
            fetchDashboardStats();
        }, 300000); // Refresh every 5 minutes

        return () => clearInterval(interval);
    }, []);

    const fetchDashboardStats = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get("/admin/dashboard-stats");
            setDashboardStats(response.data);
        } catch (error) {
            console.error("Failed to fetch dashboard stats:", error);
            setError("Failed to load dashboard data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const chartData = {
        labels: dashboardStats.chart_data?.labels || [],
        datasets: [
            {
                label: "Orders",
                data: dashboardStats.chart_data?.data || [],
                borderColor: "#a07e45",
                backgroundColor: "rgba(201, 166, 107, 0.1)",
                tension: 0.4,
                fill: true,
                borderWidth: 3,
                pointBackgroundColor: "#a07e45",
                pointBorderColor: "#fff",
                pointHoverRadius: 7,
                pointRadius: 5,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "#5a4a3a",
                titleColor: "#f8f9fa",
                bodyColor: "#e9ecef",
                titleFont: { size: 14 },
                bodyFont: { size: 12 },
                padding: 12,
                usePointStyle: true,
                callbacks: {
                    label: function (context) {
                        return `Orders: ${context.parsed.y}`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { display: true, color: "rgba(160, 126, 69, 0.1)" },
                ticks: {
                    color: "#5a4a3a",
                    callback: function (value) {
                        if (Number.isInteger(value)) {
                            return value;
                        }
                    },
                },
                title: {
                    display: true,
                    text: "Number of Orders",
                    color: "#5a4a3a",
                },
            },
            x: {
                grid: { display: false },
                ticks: { color: "#5a4a3a" },
            },
        },
        elements: {
            line: {
                cubicInterpolationMode: "monotone",
            },
        },
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className={`d-flex ${sidebarOpen ? "sidebar-open" : ""}`}>
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            <div
                className="content flex-grow-1"
                style={{
                    marginLeft: sidebarOpen ? "220px" : "0",
                    transition: "margin-left 0.3s ease",
                    overflowY: "auto",
                }}
            >
                <div
                    className="position-relative min-vh-100 d-flex align-items-center text-center"
                    style={{ background: "#F6F4F5" }}
                >
                    <AdminNavbar
                        toggleSidebar={toggleSidebar}
                        setShowLogoutModal={setShowLogoutModal}
                    />

                    <div
                        className="container px-4 py-3"
                        style={{
                            maxWidth: "1200px",
                            paddingBottom: "40px",
                            marginTop: "80px",
                        }}
                    >
                        {/* Info Cards */}
                        <div className="row g-4 mb-4">
                            {[
                                {
                                    title: "Today's Orders",
                                    value: dashboardStats.today_orders,
                                    icon: "bi-cart-check",
                                    color: "#a07e45",
                                },
                                {
                                    title: "Monthly Orders",
                                    value: dashboardStats.monthly_orders,
                                    icon: "bi-calendar-month",
                                    color: "#a07e45",
                                },
                                {
                                    title: "Year Orders",
                                    value: dashboardStats.year_orders,
                                    icon: "bi-graph-up-arrow",
                                    color: "#a07e45",
                                },
                                {
                                    title: "Pending Deliveries",
                                    value: dashboardStats.pending_deliveries,
                                    icon: "bi-truck",
                                    color: "#a07e45",
                                },
                            ].map((item, index) => (
                                <div className="col-md-3" key={index}>
                                    <div
                                        className="card border-0 h-100"
                                        style={{
                                            borderRadius: "16px",
                                            background: "white",
                                            boxShadow:
                                                "0 6px 12px rgba(0, 0, 0, 0.1)",
                                            border: "1px solid rgba(201, 166, 107, 0.15)",
                                            transition:
                                                "transform 0.2s ease, box-shadow 0.2s ease",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.transform =
                                                "translateY(-4px)")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.transform =
                                                "translateY(0)")
                                        }
                                    >
                                        <div className="card-body p-4 d-flex align-items-center justify-content-between">
                                            <div>
                                                <p
                                                    className="mb-2"
                                                    style={{
                                                        color: "#8B5D33",
                                                        fontWeight: "600",
                                                        letterSpacing: "0.5px",
                                                        textTransform:
                                                            "uppercase",
                                                        fontSize: "0.85rem",
                                                        opacity: "0.85",
                                                    }}
                                                >
                                                    {item.title}
                                                </p>
                                                <h3
                                                    className="mb-0"
                                                    style={{
                                                        color: "#3E2D23",
                                                        fontWeight: "700",
                                                        fontSize: "1.8rem",
                                                    }}
                                                >
                                                    {item.value}
                                                </h3>
                                            </div>
                                            <div
                                                className="d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: "52px",
                                                    height: "52px",
                                                    borderRadius: "14px",
                                                    background: `${item.color}15`,
                                                    color: item.color,
                                                    fontSize: "1.5rem",
                                                    display: "flex",
                                                    boxShadow:
                                                        "0 3px 6px rgba(0, 0, 0, 0.1)",
                                                }}
                                            >
                                                <i
                                                    className={`bi ${item.icon}`}
                                                ></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="row g-4">
                            {/* Line Chart */}
                            <div className="col-md-8">
                                <div
                                    className="card border-0 h-100"
                                    style={{
                                        borderRadius: "12px",
                                        background: "white",
                                        boxShadow:
                                            "0 4px 12px rgba(0, 0, 0, 0.08)",
                                        border: "1px solid rgba(201, 166, 107, 0.2)",
                                    }}
                                >
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <h5
                                                className="mb-0"
                                                style={{
                                                    color: "#5a4a3a",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                Order Performance
                                            </h5>
                                            <div
                                                className="bg-light px-3 py-1 rounded"
                                                style={{
                                                    background:
                                                        "rgba(201, 166, 107, 0.1)",
                                                    color: "#a07e45",
                                                    fontSize: "0.85rem",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                Last 7 Months
                                            </div>
                                        </div>
                                        <div style={{ height: "300px" }}>
                                            {isLoading ? (
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
                                                <div className="d-flex justify-content-center align-items-center h-100 text-danger">
                                                    {error}
                                                </div>
                                            ) : dashboardStats.chart_data.data
                                                  .length === 0 ? (
                                                <div className="d-flex justify-content-center align-items-center h-100 text-muted">
                                                    No order data available
                                                </div>
                                            ) : (
                                                <Line
                                                    data={chartData}
                                                    options={chartOptions}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Orders */}
                            <div className="col-md-4">
                                <div
                                    className="card border-0 h-100"
                                    style={{
                                        borderRadius: "12px",
                                        background: "white",
                                        boxShadow:
                                            "0 4px 12px rgba(0, 0, 0, 0.08)",
                                        border: "1px solid rgba(201, 166, 107, 0.2)",
                                    }}
                                >
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <h5
                                                className="mb-0"
                                                style={{
                                                    color: "#5a4a3a",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                Recent Orders
                                            </h5>
                                            <i
                                                className="bi bi-clock-history"
                                                style={{ color: "#a07e45" }}
                                            ></i>
                                        </div>

                                        <div className="list-group list-group-flush">
                                            {isLoading ? (
                                                <div className="d-flex justify-content-center align-items-center py-4">
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
                                                <div className="text-center py-4 text-danger">
                                                    {error}
                                                </div>
                                            ) : dashboardStats.recent_orders
                                                  ?.length === 0 ? (
                                                <div className="text-center py-4 text-muted">
                                                    No recent orders
                                                </div>
                                            ) : (
                                                dashboardStats.recent_orders?.map(
                                                    (order, i) => (
                                                        <div
                                                            key={i}
                                                            className="list-group-item border-0 px-0 py-3 d-flex justify-content-between align-items-center"
                                                            style={{
                                                                background:
                                                                    "transparent",
                                                            }}
                                                        >
                                                            <div>
                                                                <div className="d-flex align-items-center mb-1">
                                                                    <div
                                                                        className="me-3 rounded-circle d-flex align-items-center justify-content-center"
                                                                        style={{
                                                                            width: "36px",
                                                                            height: "36px",
                                                                            background:
                                                                                "rgba(201, 166, 107, 0.1)",
                                                                            color: "#a07e45",
                                                                        }}
                                                                    >
                                                                        <i className="bi bi-receipt"></i>
                                                                    </div>
                                                                    <div>
                                                                        <h6
                                                                            className="mb-0"
                                                                            style={{
                                                                                color: "#5a4a3a",
                                                                                fontWeight:
                                                                                    "500",
                                                                            }}
                                                                        >
                                                                            Order
                                                                            #
                                                                            {
                                                                                order.id
                                                                            }
                                                                        </h6>
                                                                        <small className="text-muted">
                                                                            {
                                                                                order.time
                                                                            }
                                                                        </small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-end">
                                                                <div
                                                                    style={{
                                                                        color: "#5a4a3a",
                                                                        fontWeight:
                                                                            "600",
                                                                    }}
                                                                >
                                                                    ₱
                                                                    {(
                                                                        Number(
                                                                            order?.amount
                                                                        ) || 0
                                                                    ).toLocaleString(
                                                                        undefined,
                                                                        {
                                                                            minimumFractionDigits: 2,
                                                                            maximumFractionDigits: 2,
                                                                        }
                                                                    )}
                                                                </div>
                                                                <span
                                                                    className="badge"
                                                                    style={{
                                                                        background:
                                                                            order.status ===
                                                                            "pending"
                                                                                ? "rgba(13, 110, 253, 0.1)"
                                                                                : order.status ===
                                                                                  "processing"
                                                                                ? "rgba(255, 193, 7, 0.1)"
                                                                                : order.status ===
                                                                                  "completed"
                                                                                ? "rgba(25, 135, 84, 0.1)"
                                                                                : order.status ===
                                                                                  "cancelled"
                                                                                ? "rgba(220, 53, 69, 0.1)"
                                                                                : "rgba(108, 117, 125, 0.1)",
                                                                        color:
                                                                            order.status ===
                                                                            "pending"
                                                                                ? "#0d6efd"
                                                                                : order.status ===
                                                                                  "processing"
                                                                                ? "#ffc107"
                                                                                : order.status ===
                                                                                  "completed"
                                                                                ? "#198754"
                                                                                : order.status ===
                                                                                  "cancelled"
                                                                                ? "#dc3545"
                                                                                : "#6c757d",
                                                                        fontSize:
                                                                            "0.75rem",
                                                                        fontWeight:
                                                                            "500",
                                                                    }}
                                                                >
                                                                    {order.status
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase() +
                                                                        order.status.slice(
                                                                            1
                                                                        )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                )
                                            )}
                                        </div>

                                        <div className="text-center mt-3">
                                            <a
                                                href="/admin/orders"
                                                className="btn btn-sm"
                                                style={{
                                                    background:
                                                        "rgba(201, 166, 107, 0.1)",
                                                    color: "#a07e45",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                View All Orders
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <LogoutModal
                showLogoutModal={showLogoutModal}
                setShowLogoutModal={setShowLogoutModal}
            />
        </div>
    );
}
