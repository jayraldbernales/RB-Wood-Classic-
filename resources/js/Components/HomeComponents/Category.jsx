import React from "react";

export default function Categories({
    categories,
    activeCategory,
    setActiveCategory,
}) {
    return (
        <div className="d-flex flex-wrap justify-content-center mb-3 mt-4">
            {/* "All" Button */}
            <button
                className={`btn mx-2 mb-2 ${
                    activeCategory === null
                        ? "btn-dark text-white"
                        : "btn-light border border-dark"
                }`}
                onClick={() => setActiveCategory(null)}
                style={{
                    borderRadius: "20px",
                    padding: "5px 35px",
                    minWidth: "120px",
                }}
            >
                All
            </button>

            {/* Category Buttons */}
            {categories.map((category) => (
                <button
                    key={category.id}
                    className={`btn mx-2 mb-2 ${
                        activeCategory === category.id
                            ? "btn-dark text-white"
                            : "btn-light border border-dark"
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                    style={{
                        borderRadius: "20px",
                        padding: "5px 35px",
                        minWidth: "120px",
                    }}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}
