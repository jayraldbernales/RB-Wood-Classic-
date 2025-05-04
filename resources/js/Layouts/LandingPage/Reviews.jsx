import React, { useEffect } from "react";
import "aos/dist/aos.css";
import AOS from "aos";

// Import Images
const review1 = "/img/features/review1.png";
const review2 = "/img/features/review2.png";
const review3 = "/img/features/review3.png";
const user1 = "/img/features/user1.jpg";
const user2 = "/img/features/user2.jpg";
const user3 = "/img/features/user2.jpg";

// Testimonial Data
const reviewsData = [
    {
        name: "Jade Tagupa",
        role: "Customer",
        review: "From ordering to delivery, the process was smooth. The furniture is sturdy and beautifully crafted!",
        rating: 4,
        profile: user1,
        background: review1,
    },
    {
        name: "Maria S.",
        role: "Customer",
        review: "I loved how I could personalize my furniture to fit my home perfectly. The modular designs are a game-changer!",
        rating: 5,
        profile: user2,
        background: review2,
    },
    {
        name: "Ella M.",
        role: "Customer",
        review: "The quality and attention to detail in every piece exceeded my expectations. Truly timeless furniture!",
        rating: 5,
        profile: user3,
        background: review3,
    },
];

const Reviews = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <div className="container my-5 text-center">
            {/* Section Heading */}
            <h5
                className="text-uppercase text-danger fw-semibold"
                data-aos="fade-up"
            >
                Testimonials
            </h5>
            <h2 className="fw-bold display-5 mb-5 text-dark" data-aos="fade-up">
                Our Client Reviews
            </h2>

            {/* Reviews Grid */}
            <div className="row justify-content-center">
                {reviewsData.map((testimonial, index) => (
                    <div
                        key={index}
                        className="col-md-4 d-flex"
                        data-aos="zoom-in"
                        style={{ marginBottom: "50px", marginTop: "50px" }} // Added Margin
                    >
                        <div
                            className="testimonial-card position-relative w-100 rounded-4 shadow-lg"
                            style={{
                                backgroundImage: `url(${testimonial.background})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                minHeight: "500px", // **Increased Height**
                                borderRadius: "20px",
                                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)", // **Darker Shadow**
                                display: "flex",
                                alignItems: "flex-end", // Align the comment box at the bottom
                                paddingBottom: "30px", // Adjust spacing
                            }}
                        >
                            {/* White Review Box (Keeps the White Background) */}
                            <div className="review-box bg-white shadow-lg p-4 rounded-4 text-center mx-auto w-90">
                                {/* Profile Image Inside White Box with Oval Background */}
                                <div
                                    className="profile-container position-relative mx-auto mb-3"
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        background: "#f4f4f4", // Light Gray Oval Background
                                        borderRadius: "50%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: "-40px", // Lifted inside white box
                                    }}
                                >
                                    <img
                                        src={testimonial.profile}
                                        alt={testimonial.name}
                                        className="rounded-circle"
                                        width="60"
                                        height="60"
                                    />
                                </div>

                                <h5 className="fw-bold text-dark">
                                    {testimonial.name}
                                </h5>
                                <p className="text-muted">{testimonial.role}</p>

                                {/* Review Text (Inside White Box) */}
                                <p className="fs-6 fst-italic text-dark">
                                    {testimonial.review}
                                </p>

                                {/* Star Rating */}
                                <div className="text-warning fs-5">
                                    {"★".repeat(testimonial.rating)}
                                    {"☆".repeat(5 - testimonial.rating)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom CSS */}
            <style>
                {`
          .testimonial-card {
            padding-bottom: 60px;
            position: relative;
            color: white;
          }
          .review-box {
            width: 90%;
            bottom: -10%;
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          }
          .testimonial-card:hover .review-box {
            transform: translateY(-10px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          }
        `}
            </style>
        </div>
    );
};

export default Reviews;
