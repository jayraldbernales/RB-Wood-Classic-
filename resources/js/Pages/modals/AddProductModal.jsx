import React, { useRef } from "react";
import { useForm } from "@inertiajs/react";

export default function AddProductModal({
    showModal,
    toggleModal,
    categories,
    onSuccess,
    onError,
}) {
    const fileInputRef = useRef(null);

    const { data, setData, post, reset, processing, errors } = useForm({
        name: "",
        category_id: "",
        description: "",
        price: "",
        images: [],
    });

    const handleImageChange = (e) => {
        setData("images", Array.from(e.target.files));
    };

    const submitProduct = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("category_id", data.category_id);
        formData.append("description", data.description);
        formData.append("price", data.price);
        data.images.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
        });

        post("/admin/product", {
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
            onSuccess: () => {
                reset();
                setData("images", []);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                toggleModal();
                if (onSuccess) onSuccess();
            },
            onError: () => {
                if (onError) onError();
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
                        <h5 className="modal-title">Add Product</h5>
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

                            {/* Images */}
                            <div className="mb-3">
                                <label className="text-dark form-label">
                                    Images (Multiple)
                                </label>
                                <input
                                    type="file"
                                    className="form-control"
                                    multiple
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    required
                                />
                                {errors.images && (
                                    <div className="text-danger">
                                        {errors.images}
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
                                    {processing ? "Adding..." : "Add Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
<style jsx>{`
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-content {
        background: white;
        padding: 20px;
        border-radius: 8px;
        width: 400px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }
`}</style>;
