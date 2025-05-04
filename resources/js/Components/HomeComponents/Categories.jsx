import React from "react";

export default function Categories({
    categories,
    activeCategory,
    setActiveCategory,
}) {
    return (
        <div className="d-flex flex-wrap justify-content-center mb-3 mt-4">
            {categories.map((category) => (
                <button
                    key={category}
                    className={`btn mx-2 mb-2 ${
                        activeCategory === category
                            ? "btn-dark text-white"
                            : "btn-light border border-dark"
                    }`}
                    onClick={() => setActiveCategory(category)}
                    style={{
                        borderRadius: "20px",
                        padding: "5px 35px",
                        minWidth: "120px",
                    }}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}
