import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";

import AOS from "aos";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [responseMessage, setResponseMessage] = useState("");
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    useEffect(() => {
        if (responseMessage) {
            const timer = setTimeout(() => {
                setResponseMessage("");
            }, 2000); // 2 seconds

            return () => clearTimeout(timer); // cleanup
        }
    }, [responseMessage]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Use Inertia to post the form data
        router.post("/contact", formData, {
            preserveScroll: true, // Preserve the scroll position
            onSuccess: () => {
                // Handle success
                setResponseMessage("Message sent successfully!");
                setIsError(false);
                setFormData({ name: "", email: "", message: "" }); // Reset form
            },
            onError: () => {
                // Handle error
                setResponseMessage("Failed to send message. Please try again.");
                setIsError(true);
            },
        });
    };

    return (
        <div
            id="contact-section"
            className="container-fluid bg-dark text-white py-5 position-relative"
        >
            <div className="container py-5">
                <div className="row align-items-center">
                    {/* Contact Info */}
                    <div className="col-md-6" data-aos="fade-right">
                        <h2 className="fw-bold mb-4 text-uppercase">
                            Get in Touch
                        </h2>
                        <div className="d-flex align-items-center mb-3">
                            <i className="bi bi-telephone-fill me-3 fs-4"></i>
                            <span className="fs-5">09947546757</span>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                            <i className="bi bi-geo-alt-fill me-3 fs-4"></i>
                            <span className="fs-5">
                                Purok 1, Cawayanan, Mabini, Bohol
                            </span>
                        </div>
                        <div className="d-flex align-items-center mb-4">
                            <i className="bi bi-envelope-fill me-3 fs-4"></i>
                            <span className="fs-5">bernalesj28@gmail.com</span>
                        </div>

                        {/* Social Icons */}
                        <div className="d-flex gap-4 mt-3">
                            <a href="#" className="text-white fs-3">
                                <i className="bi bi -facebook"></i>
                            </a>
                            <a href="#" className="text-white fs-3">
                                <i className="bi bi-instagram"></i>
                            </a>
                            <a href="#" className="text-white fs-3">
                                <i className="bi bi-twitter"></i>
                            </a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="col-md-6" data-aos="fade-left">
                        <form
                            className="p-4 rounded bg-light text-dark shadow-lg"
                            onSubmit={handleSubmit}
                        >
                            <h4 className="mb-3 text-center">Send a Message</h4>

                            <div className="mb-3">
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control rounded"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control rounded"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <textarea
                                    name="message"
                                    className="form-control rounded"
                                    rows="4"
                                    placeholder="Your Message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-dark w-100 rounded-pill fw-bold mb-3"
                            >
                                Submit
                            </button>
                            {responseMessage && (
                                <div
                                    className={`alert ${
                                        isError
                                            ? "alert-danger"
                                            : "alert-success"
                                    }`}
                                >
                                    {responseMessage}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            {/* Scroll to Top Button */}
            <button
                className="btn btn-outline-light rounded-circle position-absolute shadow-lg"
                onClick={scrollToTop}
                style={{
                    width: "70px",
                    height: "70px",
                    bottom: "20px",
                    right: "20px",
                    fontSize: "2rem",
                    zIndex: 10,
                }}
            >
                <i className="bi bi-arrow-up-short"></i>
            </button>
        </div>
    );
};

export default Contact;
