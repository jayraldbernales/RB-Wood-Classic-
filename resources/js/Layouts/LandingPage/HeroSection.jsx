import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import LoginModal from "@/Pages/modals/LogInModal";
import SignUpModal from "@/Pages/modals/SignUpModal";
import CustomButton from "@/Components/CustomButton";
import ForgotPasswordModal from "@/Pages/modals/ForgotPasswordModal";

export default function HeroSection() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] =
        useState(false);

    useEffect(() => {
        AOS.init();
    }, []);

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
        });
    };

    return (
        <div
            className="d-flex align-items-center position-relative text-center text-white vh-100"
            style={{
                backgroundImage: "url('/img/homebg.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Dark Overlay */}
            <div
                className="h-100 position-absolute w-100 start-0 top-0"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
            ></div>

            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light position-absolute w-100 px-4 py-3 start-0 top-0">
                <div className="container-fluid">
                    {/* Company Logo and Name */}
                    <div className="d-flex align-items-center">
                        <img
                            src="/img/logo.png" // Update this path to your actual logo
                            alt="Logo"
                            style={{ height: "45px", width: "auto" }}
                        />
                        <h4
                            className="m-0 text-white fw-bold"
                            style={{ fontSize: "1.5rem" }}
                        >
                            WOOD CLASSIC
                        </h4>
                    </div>

                    {/* Right Nav */}
                    <div className="d-flex align-items-center ms-auto">
                        <CustomButton
                            text="Sign Up"
                            onClick={() => setShowSignUpModal(true)}
                            variant="outline"
                        />
                        <CustomButton
                            text="Log In"
                            onClick={() => setShowLoginModal(true)}
                            variant="filled"
                        />
                    </div>
                </div>
            </nav>

            {/* Hero Text - Centered */}
            <div
                className="d-flex flex-column align-items-center text-white"
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                }}
            >
                <h1
                    className="fw-bold"
                    style={{
                        fontSize: "clamp(4rem, 15vw, 12rem)",
                        lineHeight: "1",
                    }}
                    data-aos="zoom-in"
                >
                    Furniture
                </h1>
                <p className="fs-4" style={{ maxWidth: "700px" }}>
                    Bringing handcrafted furniture from our workshop to your
                    home with style and comfort.
                </p>
            </div>

            {/* Scroll Down Arrow */}
            <div
                className="position-absolute end-0 me-4"
                style={{ bottom: "30px" }}
            >
                <button
                    className="d-flex btn btn-outline-light align-items-center justify-content-center rounded-circle shadow-lg"
                    onClick={scrollToBottom}
                    style={{
                        width: "70px",
                        height: "70px",
                        fontSize: "2rem",
                        borderWidth: "2px",
                    }}
                >
                    <i className="bi bi-arrow-down-short"></i>
                </button>
            </div>

            {/* Custom Designs Box */}
            <div
                className="d-flex flex-column align-items-start bg-light bg-opacity-25 border border-white m-5 p-4 position-absolute rounded-5 text-white bottom-0 start-0"
                style={{
                    width: "250px",
                    padding: "1.5rem",
                    borderRadius: "20px",
                }}
                data-aos="zoom-in"
            >
                <h5
                    className="fw-bold"
                    style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}
                >
                    Custom Designs
                </h5>
                <p
                    className="mb-0"
                    style={{ fontSize: "1rem", lineHeight: "1.4" }}
                >
                    Made to fit your style and space.
                </p>
            </div>

            {/* Modals */}
            <LoginModal
                showLoginModal={showLoginModal}
                setShowLoginModal={setShowLoginModal}
                setShowSignUpModal={setShowSignUpModal}
                setShowForgotPasswordModal={setShowForgotPasswordModal}
            />
            <SignUpModal
                showSignUpModal={showSignUpModal}
                setShowSignUpModal={setShowSignUpModal}
                setShowLoginModal={setShowLoginModal}
            />

            <ForgotPasswordModal
                showForgotPasswordModal={showForgotPasswordModal}
                setShowForgotPasswordModal={setShowForgotPasswordModal}
            />
        </div>
    );
}
