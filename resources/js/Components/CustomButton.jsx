import React from "react";

const CustomButton = ({
    text,
    modalTarget,
    variant = "outline",
    className,
    onClick,
}) => {
    // Determine the button class based on the variant
    const buttonClass =
        variant === "filled" ? "btn-light" : "btn-outline-light";

    return (
        <button
            className={`btn ${buttonClass} rounded-pill px-4 me-3 ${className}`}
            data-bs-toggle="modal"
            data-bs-target={`#${modalTarget}`}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default CustomButton;
