import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import LogoutModal from "@/Components/LogoutModal";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

export default function Dashboard() {
    useEffect(() => {
        AOS.init();
    }, []);

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div
            className={`d-flex ${sidebarOpen ? "sidebar-open" : ""}`}
            style={{ overflow: "hidden" }}
        >
            {/* Sidebar */}
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            {/* Main Content */}
            <div
                className="content flex-grow-1"
                style={{
                    marginLeft: sidebarOpen ? "220px" : "0",
                    transition: "margin-left 0.3s ease",
                    overflow: "hidden",
                }}
            >
                {/* Hero Section */}
                <div
                    className="position-relative vh-100 d-flex align-items-center text-white text-center"
                    style={{ background: "#F6F4F5" }}
                >
                    {/* Navbar Component */}
                    <AdminNavbar
                        toggleSidebar={toggleSidebar}
                        setShowLogoutModal={setShowLogoutModal}
                    />
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            <LogoutModal
                showLogoutModal={showLogoutModal}
                setShowLogoutModal={setShowLogoutModal}
            />
        </div>
    );
}
