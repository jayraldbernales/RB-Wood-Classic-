import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import LogoutModal from "@/Components/LogoutModal";
import AddProductModal from "../modals/AddProductModal";
import AdminSidebar from "./AdminSidebar";
import { useForm } from "@inertiajs/react";
import DeleteProductModal from "../modals/DeleteProductModal";
import { router } from "@inertiajs/react"; // Import Inertia router
import EditProductModal from "../modals/EditProductModal";
import ImageCarouselModal from "../modals/ImageCarouselModal ";
import StatusModal from "../modals/StatusModal";
import AdminNavbar from "./AdminNavbar";

export default function Product({ categories, products }) {
    useEffect(() => {
        AOS.init();
    }, []);

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedProductImages, setSelectedProductImages] = useState([]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const toggleModal = () => setShowModal(!showModal);
    const handleCloseModal = () => setShowDeleteModal(false);
    const handleCloseEditModal = () => setShowEditModal(false);

    // Add these new states
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusModalProps, setStatusModalProps] = useState({
        isSuccess: true,
        title: "",
        subtitle: "",
    });

    const { data, setData, post, reset, processing, errors } = useForm({
        name: "",
        category_id: "",
        description: "",
        price: "",
        image: null,
    });

    const [filterCategory, setFilterCategory] = useState("");

    const filteredProducts = products.filter(
        (product) => !filterCategory || product.category_id == filterCategory
    );

    const handleDeleteClick = (id) => {
        setSelectedProductId(id);
        setShowDeleteModal(true);
    };

    // Example usage in your delete handler
    const handleConfirmDelete = () => {
        if (selectedProductId) {
            router.delete(`/admin/product/${selectedProductId}`, {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setStatusModalProps({
                        isSuccess: true,
                        title: "Succesfully Deleted",
                        subtitle: "The product was successfully removed.",
                    });
                    setShowStatusModal(true);
                },
                onError: (error) => {
                    setStatusModalProps({
                        isSuccess: false,
                        title: "Delete Failed",
                        subtitle: "There was an error deleting the product.",
                    });
                    setShowStatusModal(true);
                },
            });
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowEditModal(true);
    };

    return (
        <div
            className={`d-flex ${sidebarOpen ? "sidebar-open" : ""}`}
            style={{ overflow: "hidden" }}
        >
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            {/* Main Content */}
            <div
                className="content flex-grow-1"
                style={{
                    marginLeft: sidebarOpen ? "220px" : "0",
                    transition: "margin-left 0.3s ease",
                    overflow: "hidden",
                }}
            >
                {/* Hero Section */}
                <div
                    className="position-relative min-vh-100 d-flex flex-column text-white text-center"
                    style={{ background: "#F6F4F5" }}
                >
                    {/* Navbar Component */}
                    <AdminNavbar
                        toggleSidebar={toggleSidebar}
                        setShowLogoutModal={setShowLogoutModal}
                    />
                    <div
                        className="container px-4 py-3"
                        style={{ maxWidth: "1200px", marginTop: "100px" }} // Adjust height as needed
                    >
                        <h2
                            className="text-dark border-bottom pb-2 text-start"
                            style={{ fontWeight: "600" }}
                        >
                            Manage Products
                        </h2>

                        <div className="d-flex justify-content-between align-items-stretch gap-2 my-3">
                            {/* Category Filter - Aligns Left */}
                            <select
                                className="form-select w-auto"
                                style={{ height: "40px" }} // Ensures same height as the button
                                onChange={(e) =>
                                    setFilterCategory(e.target.value)
                                }
                            >
                                <option value="">All</option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            {/* Add Product Button - Aligns Right */}
                            <button
                                className="btn btn-dark d-flex align-items-center gap-2 shadow-sm"
                                style={{ height: "40px" }} // Matches the select dropdown height
                                onClick={toggleModal}
                            >
                                <i className="bi bi-plus-circle"></i> Add
                                Product
                            </button>
                        </div>

                        {/* Product List with Actions */}
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Description</th>
                                        <th>Price</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products && products.length > 0 ? (
                                        filteredProducts.map((product) => (
                                            <tr key={product.id}>
                                                <td
                                                    style={{
                                                        textAlign: "center",
                                                        verticalAlign: "middle",
                                                    }}
                                                >
                                                    {product.images &&
                                                    product.images.length >
                                                        0 ? (
                                                        <div
                                                            style={{
                                                                width: "70px",
                                                                height: "70px",
                                                                cursor: "pointer",
                                                                display: "flex", // Centering using flexbox
                                                                justifyContent:
                                                                    "center",
                                                                alignItems:
                                                                    "center",
                                                                margin: "auto", // Centering the div
                                                            }}
                                                            onClick={() => {
                                                                setSelectedProductImages(
                                                                    product.images
                                                                ); // Set the images to display in the modal
                                                                setShowImageModal(
                                                                    true
                                                                ); // Open the modal
                                                            }}
                                                        >
                                                            {/* Display the first image */}
                                                            <img
                                                                src={`/storage/${product.images[0].image}`}
                                                                alt={
                                                                    product.name
                                                                }
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    objectFit:
                                                                        "cover",
                                                                    borderRadius:
                                                                        "5px",
                                                                }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span>No Image</span>
                                                    )}
                                                </td>

                                                <td>{product.name}</td>
                                                <td>
                                                    {product.category?.name}
                                                </td>
                                                <td>{product.description}</td>
                                                <td>
                                                    ₱
                                                    {Number(
                                                        product.price
                                                    ).toLocaleString("en-PH")}
                                                </td>
                                                <td>
                                                    {/* Edit Button */}
                                                    <button
                                                        className="btn btn-sm btn-success me-2"
                                                        onClick={() =>
                                                            handleEdit(product)
                                                        }
                                                    >
                                                        <i className="bi bi-pencil-square"></i>{" "}
                                                        Edit
                                                    </button>

                                                    {/* Delete Button */}
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                product.id
                                                            )
                                                        }
                                                    >
                                                        <i className="bi bi-trash"></i>{" "}
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="text-center"
                                            >
                                                No products available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success and error modal */}
            <StatusModal
                show={showStatusModal}
                onHide={() => setShowStatusModal(false)}
                isSuccess={statusModalProps.isSuccess}
                title={statusModalProps.title}
                subtitle={statusModalProps.subtitle}
            />
            {/* Image Carousel Modal */}
            <ImageCarouselModal
                showModal={showImageModal}
                setShowModal={setShowImageModal}
                images={selectedProductImages}
            />

            <DeleteProductModal
                show={showDeleteModal}
                handleClose={handleCloseModal}
                handleConfirm={handleConfirmDelete}
            />

            <EditProductModal
                showModal={showEditModal}
                toggleModal={() => setShowEditModal(false)}
                categories={categories}
                selectedProduct={selectedProduct}
                onSuccess={(message) => {
                    setStatusModalProps({
                        isSuccess: true,
                        title: "Update Successful!",
                        subtitle: message,
                    });
                    setShowStatusModal(true);
                }}
                onError={(message) => {
                    setStatusModalProps({
                        isSuccess: false,
                        title: "Error!",
                        subtitle: message,
                    });
                    setShowStatusModal(true);
                }}
            />

            <AddProductModal
                showModal={showModal}
                toggleModal={toggleModal}
                categories={categories}
                onSuccess={() => {
                    setStatusModalProps({
                        isSuccess: true,
                        title: "Successfully Added!",
                        subtitle: "Product added successfully",
                    });
                    setShowStatusModal(true);
                }}
                onError={() => {
                    setStatusModalProps({
                        isSuccess: false,
                        title: "Error!",
                        subtitle: "Failed to add product",
                    });
                    setShowStatusModal(true);
                }}
            />

            <LogoutModal
                showLogoutModal={showLogoutModal}
                setShowLogoutModal={setShowLogoutModal}
            />
        </div>
    );
}
