const CustomBlackButton = ({
    text,
    modalTarget,
    variant = "outline", // Default variant is "outline"
    className,
    onClick,
}) => {
    // Determine the button class based on the variant
    const buttonClass =
        variant === "filled"
            ? "btn-dark text-white" // Filled variant with black background
            : "btn-outline-dark custom-outline-dark"; // Add a custom class for outline variant

    return (
        <button
            className={`btn ${buttonClass} rounded-pill px-4 me-3 ${className}`}
            data-bs-toggle="modal"
            data-bs-target={`#${modalTarget}`}
            onClick={onClick}
            style={{
                color: variant === "filled" ? "white" : "black", // Text color based on variant
                borderWidth: "2px", // Thicker border for better visibility
            }}
        >
            {text}
        </button>
    );
};

export default CustomBlackButton;
