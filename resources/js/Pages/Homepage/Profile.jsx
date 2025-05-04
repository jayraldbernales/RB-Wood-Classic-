import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Sidebar from "@/Components/Sidebar";
import Navbar from "@/Components/Navbar";
import LogoutModal from "@/Components/LogoutModal";
import { Head, usePage } from "@inertiajs/react";
import UpdateProfileInformation from "../Profile/Partials/UpdateProfileInformationForm";

export default function Profile({ mustVerifyEmail, status }) {
    useEffect(() => {
        AOS.init({
            once: true,
            duration: 1000,
            easing: "ease-in-out",
        });
    }, []);

    const [sidebarOpen, setSidebarOpen] = React.useState(true);
    const [showLogoutModal, setShowLogoutModal] = React.useState(false);
    const { user } = usePage().props;

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    return (
        <div
            className={`d-flex ${sidebarOpen ? "sidebar-open" : ""}`}
            style={{ overflow: "hidden" }} // Fixed: Removed jsx attribute
        >
            <Head title="Profile" />

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
                <div
                    className="position-relative"
                    style={{ paddingTop: "50px" }}
                >
                    {/* Navbar */}
                    <Navbar
                        toggleSidebar={toggleSidebar}
                        setShowLogoutModal={setShowLogoutModal}
                    />

                    {/* Profile Container */}
                    <div
                        className="container px-4 py-5"
                        style={{ maxWidth: "1200px" }}
                    >
                        <UpdateProfileInformation
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            user={user}
                        />
                    </div>
                </div>
            </div>

            {/* Logout Modal */}
            <LogoutModal
                showLogoutModal={showLogoutModal}
                setShowLogoutModal={setShowLogoutModal}
            />
        </div>
    );
}
