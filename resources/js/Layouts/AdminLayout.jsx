import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminNavbar from "@/Pages/Admin/AdminNavbar";
import AdminSidebar from "@/Pages/Admin/AdminSidebar";

export default function AdminLayout({ children, title }) {
    const [sidebarOpen, setSidebarOpen] = React.useState(true);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className={`d-flex ${sidebarOpen ? "sidebar-open" : ""}`}>
            {/* Sidebar */}
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            {/* Main Content */}
            <div
                className="flex-grow-1"
                style={{
                    marginLeft: sidebarOpen ? "220px" : "0",
                    transition: "margin-left 0.3s ease",
                    minHeight: "100vh",
                    background: "#F6F4F5",
                }}
            >
                <Head title={title} />

                {/* Navbar */}
                <AdminNavbar toggleSidebar={toggleSidebar} />

                {/* Page Content */}
                <div style={{ paddingTop: "80px" }}>{children}</div>
            </div>
        </div>
    );
}
