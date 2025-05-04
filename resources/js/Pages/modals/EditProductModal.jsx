import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";

export default function EditProductModal({
    showModal,
    toggleModal,
    categories,
    selectedProduct,
    onSuccess,
    onError,
}) {
    const { data, setData, put, reset, processing, errors } = useForm({
        name: "",
        category_id: "",
        description: "",
        price: "",
    });

    // Pre-fill the form with selected product data
    useEffect(() => {
        if (selectedProduct) {
            setData({
                name: selectedProduct.name,
                category_id: selectedProduct.category_id,
                description: selectedProduct.description,
                price: selectedProduct.price,
            });
        }
    }, [selectedProduct]);

    // Submit the form
    const submitProduct = (e) => {
        e.preventDefault();
        if (processing) return;

        put(`/admin/product/${selectedProduct.id}`, {
            data: {
                name: data.name,
                category_id: data.category_id,
                description: data.description,
                price: data.price,
            },
            onSuccess: () => {
                reset();
                toggleModal();
                if (onSuccess) {
                    onSuccess("Product updated successfully");
                }
            },
            onError: () => {
                if (onError) {
                    onError("Failed to update product");
                }
            },
        });
    };

    return (
        <div
            className={`modal fade ${showModal ? "show d-block" : ""}`}
            tabIndex="-1"
            style={{ background: "rgba(0, 0, 0, 0.5)" }}
        >
            <div className="modal-dialog">
                <div
                    className="modal-content"
                    style={{
                        maxWidth: "900px",
                        width: "90%",
                        maxHeight: "90vh",
                        overflowY: "auto",
                    }}
                >
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Product</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={toggleModal}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={submitProduct}>
                            {/* Product Name */}
                            <div className="mb-3">
                                <label className="text-dark form-label">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    required
                                />
                                {errors.name && (
                                    <div className="text-danger">
                                        {errors.name}
                                    </div>
                                )}
                            </div>

                            {/* Category */}
                            <div className="mb-3">
                                <label className="text-dark form-label">
                                    Category
                                </label>
                                <select
                                    className="form-control"
                                    value={data.category_id}
                                    onChange={(e) =>
                                        setData("category_id", e.target.value)
                                    }
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories &&
                                        categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                </select>
                                {errors.category_id && (
                                    <div className="text-danger">
                                        {errors.category_id}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mb-3">
                                <label className="text-dark form-label">
                                    Description
                                </label>
                                <textarea
                                    className="form-control"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    required
                                />
                                {errors.description && (
                                    <div className="text-danger">
                                        {errors.description}
                                    </div>
                                )}
                            </div>

                            {/* Price */}
                            <div className="mb-3">
                                <label className="text-dark form-label">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={data.price}
                                    onChange={(e) =>
                                        setData("price", e.target.value)
                                    }
                                    required
                                />
                                {errors.price && (
                                    <div className="text-danger">
                                        {errors.price}
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="d-flex justify-content-end">
                                <button
                                    type="submit"
                                    className="btn btn-dark"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Updating..."
                                        : "Update Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
