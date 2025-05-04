import React from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import Sidebar from "@/Components/Sidebar";

const Layout = ({ children, title }) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className={`d-flex ${sidebarOpen ? "sidebar-open" : ""}`}>
            <Head title={title} />

            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <div
                className="content flex-grow-1"
                style={{
                    marginLeft: sidebarOpen ? "220px" : "0",
                    transition: "margin-left 0.3s ease",
                    backgroundColor: "#F8F9FA",
                    minHeight: "100vh",
                }}
            >
                {/* Navbar */}
                <Navbar toggleSidebar={toggleSidebar} />

                {/* Page Content */}
                <div
                    className="position-relative"
                    style={{ paddingTop: "50px" }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
