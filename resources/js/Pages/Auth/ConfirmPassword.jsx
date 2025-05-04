import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../modals/LogInModal";
import SignUpModal from "../modals/SignUpModal";

export default function LandingPage() {
    useEffect(() => {
        AOS.init({ duration: 1200, once: true });
    }, []);

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
        });
    };

    const navigate = useNavigate();

    return (
        <>
            {/* Hero Section */}
            <div
                className="container-fluid p-0"
                style={{
                    position: "relative",
                    height: "100vh",
                    width: "100vw",
                    backgroundImage: `url('/img/furniture-bg.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Navbar */}
                <nav className="navbar navbar-expand-lg navbar-dark bg-transparent px-4 py-3">
                    <div className="container-fluid">
                        <div className="d-flex align-items-center">
                            <img
                                src="../../src/assets/img/logo.png"
                                alt="Logo"
                                style={{ height: "45px", width: "auto" }}
                            />
                            <h4 className="fw-bold text-white m-0 ms-2">
                                WOOD CLASSIC
                            </h4>
                        </div>
                        <div className="ms-auto d-flex align-items-center">
                            <button
                                className="btn btn-outline-light rounded-pill px-4 me-3"
                                data-bs-toggle="modal"
                                data-bs-target="#signUpModal"
                            >
                                Sign Up
                            </button>
                            <button
                                className="btn btn-light rounded-pill px-4"
                                data-bs-toggle="modal"
                                data-bs-target="#loginModal"
                            >
                                Log in
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Hero Text */}
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
                        style={{ fontSize: "6rem", lineHeight: "1" }}
                        data-aos="zoom-in"
                    >
                        Furniture
                    </h1>
                    <p className="fs-4" style={{ maxWidth: "700px" }}>
                        Bringing handcrafted furniture from our workshop to your
                        home with style and comfort.
                    </p>
                </div>

                {/* Scroll Down Button */}
                <div
                    className="position-absolute end-0 me-4"
                    style={{ bottom: "30px" }}
                >
                    <button
                        className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center shadow-lg"
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
                    className="position-absolute bottom-0 start-0 m-5 p-4 text-white bg-dark bg-opacity-75 rounded-5 d-flex flex-column align-items-start"
                    style={{ width: "250px", padding: "1.5rem" }}
                    data-aos="zoom-in"
                >
                    <h5
                        className="fw-bold"
                        style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}
                    >
                        Custom Designs
                    </h5>
                    <p
                        className="mb-0"
                        style={{ fontSize: "1.1rem", lineHeight: "1.4" }}
                    >
                        Made to fit your style and space.
                    </p>
                </div>
            </div>

            {/* Importing modals */}
            <LoginModal />
            <SignUpModal />
        </>
    );
}
