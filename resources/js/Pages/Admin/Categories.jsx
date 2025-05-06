import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import LogoutModal from "@/Components/LogOutModal";
import AdminSidebar from "./AdminSidebar";
import { useForm } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import StatusModal from "../modals/StatusModal";
import AdminNavbar from "./AdminNavbar";

export default function Categories({ categories }) {
    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: "",
    });

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Status modal states
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusModalProps, setStatusModalProps] = useState({
        isSuccess: true,
        title: "",
        message: "",
    });

    // Handle timeout cleanup
    useEffect(() => {
        let timeoutId;
        if (showStatusModal) {
            timeoutId = setTimeout(() => setShowStatusModal(false), 3000);
        }
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [showStatusModal]);

    useEffect(() => {
        AOS.init();
    }, []);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // Handle Add Category
    const submitCategory = (e) => {
        e.preventDefault();
        if (processing) return;

        post("/admin/categories", {
            onSuccess: () => {
                reset();
                setShowAddModal(false);
                setStatusModalProps({
                    isSuccess: true,
                    title: "Success!",
                    message: "Category added successfully",
                });
                setShowStatusModal(true);
            },
            onError: () => {
                setStatusModalProps({
                    isSuccess: false,
                    title: "Error!",
                    message: "Failed to add category",
                });
                setShowStatusModal(true);
            },
        });
    };

    // Handle Edit Category
    const handleEditClick = (category) => {
        setSelectedCategory(category);
        setData("name", category.name);
        setShowEditModal(true);
    };

    const submitEditCategory = (e) => {
        e.preventDefault();
        if (processing) return;

        put(`/admin/categories/${selectedCategory.id}`, {
            onSuccess: () => {
                setShowEditModal(false);
                setStatusModalProps({
                    isSuccess: true,
                    title: "Success!",
                    message: "Category updated successfully",
                });
                setShowStatusModal(true);
            },
            onError: () => {
                setStatusModalProps({
                    isSuccess: false,
                    title: "Error!",
                    message: "Failed to update category",
                });
                setShowStatusModal(true);
            },
        });
    };

    // Handle Delete Category
    const handleDeleteClick = (category) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(`/admin/categories/${selectedCategory.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
                setStatusModalProps({
                    isSuccess: true,
                    title: "Success!",
                    message: "Category deleted successfully",
                });
                setShowStatusModal(true);
            },
            onError: () => {
                setStatusModalProps({
                    isSuccess: false,
                    title: "Error!",
                    message: "Failed to delete category",
                });
                setShowStatusModal(true);
            },
        });
    };

    return (
        <div
            className={`d-flex ${sidebarOpen ? "sidebar-open" : ""}`}
            style={{ overflow: "hidden" }}
        >
            {/* Sidebar */}
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
                    {/* Container */}
                    <div
                        className="container px-4 py-3"
                        style={{ maxWidth: "1200px", marginTop: "100px" }}
                    >
                        <h2
                            className="text-dark border-bottom pb-2 text-start"
                            style={{ fontWeight: "600" }}
                        >
                            Manage Categories
                        </h2>

                        {/* Button to Open Add Modal */}
                        <div className="d-flex justify-content-end">
                            <button
                                className="btn btn-dark mb-3"
                                onClick={() => setShowAddModal(true)}
                            >
                                <i className="bi bi-plus-lg"></i> Add Category
                            </button>
                        </div>

                        {/* List of Categories */}
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Category Name</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.length > 0 ? (
                                        categories.map((category) => (
                                            <tr key={category.id}>
                                                <td>{category.name}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() =>
                                                            handleEditClick(
                                                                category
                                                            )
                                                        }
                                                    >
                                                        <i className="bi bi-pencil-square"></i>{" "}
                                                        Edit
                                                    </button>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                category
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
                                                colSpan="3"
                                                className="text-center"
                                            >
                                                No categories available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Category Modal */}
            {showAddModal && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Category</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowAddModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={submitCategory}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            Category Name
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
                                    <button
                                        type="submit"
                                        className="btn btn-dark w-100"
                                        disabled={processing}
                                    >
                                        Add Category
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Category Modal */}
            {showEditModal && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Category</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowEditModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={submitEditCategory}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            Category Name
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
                                    <button
                                        type="submit"
                                        className="btn btn-dark w-100"
                                        disabled={processing}
                                    >
                                        Update
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowDeleteModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>
                                    Are you sure you want to delete "
                                    {selectedCategory?.name}"?
                                </p>
                                <button
                                    className="btn btn-danger w-100"
                                    onClick={confirmDelete}
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Modal */}
            <StatusModal
                show={showStatusModal}
                onHide={() => setShowStatusModal(false)}
                isSuccess={statusModalProps.isSuccess}
                title={statusModalProps.title}
                message={statusModalProps.message}
            />

            {/* Logout Modal */}
            <LogoutModal
                showLogoutModal={showLogoutModal}
                setShowLogoutModal={setShowLogoutModal}
            />
        </div>
    );
}
