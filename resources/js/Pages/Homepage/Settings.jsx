import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Sidebar from "@/Components/Sidebar";
import Navbar from "@/Components/Navbar";
import LogoutModal from "@/Components/LogoutModal";
import { Head, usePage } from "@inertiajs/react";
import UpdateProfileInformation from "../Profile/Partials/UpdateProfileInformationForm";
import ContactInformation from "../Profile/Partials/ContactInformationForm";

export default function Settings({ mustVerifyEmail, status }) {
    useEffect(() => {
        AOS.init({
            once: true,
            duration: 1000,
            easing: "ease-in-out",
        });
    }, []);

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const { user } = usePage().props;

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    return (
        <div
            className={`d-flex ${sidebarOpen ? "sidebar-open" : ""}`}
            style={{ overflow: "hidden" }}
        >
            <Head title="Profile Settings" />

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
                        className="container px-4 py-5"
                        style={{ maxWidth: "1200px" }}
                    >
                        {/* Tab Navigation */}
                        <ul
                            className="nav nav-tabs mb-4"
                            id="settingsTabs"
                            role="tablist"
                        >
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link ${
                                        activeTab === "profile" ? "active" : ""
                                    }`}
                                    id="profile-tab"
                                    onClick={() => setActiveTab("profile")}
                                    style={{
                                        color:
                                            activeTab === "profile"
                                                ? "black"
                                                : "gray",
                                        backgroundColor:
                                            activeTab === "profile"
                                                ? "white"
                                                : "transparent",
                                        borderColor:
                                            activeTab === "profile"
                                                ? "#dee2e6 #dee2e6 #fff"
                                                : "transparent",
                                    }}
                                >
                                    <i className="bi bi-person me-2"></i>{" "}
                                    Profile
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link ${
                                        activeTab === "contact" ? "active" : ""
                                    }`}
                                    id="contact-tab"
                                    onClick={() => setActiveTab("contact")}
                                    style={{
                                        color:
                                            activeTab === "contact"
                                                ? "black"
                                                : "gray",
                                        backgroundColor:
                                            activeTab === "contact"
                                                ? "white"
                                                : "transparent",
                                        borderColor:
                                            activeTab === "contact"
                                                ? "#dee2e6 #dee2e6 #fff"
                                                : "transparent",
                                    }}
                                >
                                    <i className="bi bi-telephone me-2"></i>{" "}
                                    Contact Us
                                </button>
                            </li>
                        </ul>

                        {/* Tab Content */}
                        <div className="tab-content p-3 border border-top-0 rounded-bottom">
                            <div
                                className={`tab-pane fade ${
                                    activeTab === "profile" ? "show active" : ""
                                }`}
                            >
                                <UpdateProfileInformation
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    user={user}
                                />
                            </div>
                            <div
                                className={`tab-pane fade ${
                                    activeTab === "contact" ? "show active" : ""
                                }`}
                            >
                                <ContactInformation user={user} />
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
