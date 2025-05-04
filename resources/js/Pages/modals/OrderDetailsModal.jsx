import React, { useState } from "react";
import { router } from "@inertiajs/react";

const OrderDetailsModal = ({ order, onClose, show, onCancelSuccess }) => {
    const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

    if (!order || !show) return null;

    const formatDate = (dateString, showTime = false) => {
        if (!dateString) return "N/A";

        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            ...(showTime && { hour: "2-digit", minute: "2-digit" }),
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusColor = (status) => {
        const statusMap = {
            completed: "text-green-600",
            pending: "text-gray-600",
            ongoing: "text-yellow-600",
            cancelled: "text-red-600",
            shipped: "text-indigo-600",
            default: "text-gray-600",
        };
        return statusMap[status.toLowerCase()] || statusMap.default;
    };

    const getProductImage = (product) => {
        if (!product?.images) return "/placeholder-image.jpg";
        if (product.images.length > 0) {
            return (
                product.images[0].url || `/storage/${product.images[0].image}`
            );
        }
        return "/placeholder-image.jpg";
    };

    const handleCancelClick = () => {
        setShowCancelConfirmation(true);
    };

    const confirmCancel = () => {
        router.post(
            `/orders/${order.id}/cancel`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    onCancelSuccess();
                    onClose();
                    setShowCancelConfirmation(false);
                },
            }
        );
    };

    const remainingBalance =
        order.payment_status === "partially_paid"
            ? order.total_amount - (order.down_payment_amount || 0)
            : order.total_amount;

    // Payment status display function
    const renderPaymentStatus = () => {
        switch (order.payment_status) {
            case "paid":
                return <span className="text-green-600">Paid</span>;
            case "partially_paid":
                return <span className="text-yellow-600">Partially Paid</span>;
            case "unpaid":
            case "pending_payment":
                return <span className="text-gray-600">Unpaid</span>;
            default:
                return <span className="text-gray-600">Unknown</span>;
        }
    };

    return (
        <>
            {/* Cancel Confirmation Modal */}
            {showCancelConfirmation && (
                <div className="fixed inset-0 z-[1060] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 text-center">
                        <div
                            className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
                            aria-hidden="true"
                            onClick={() => setShowCancelConfirmation(false)}
                        ></div>

                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>

                        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                Confirm Cancellation
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    Are you sure you want to cancel Order #
                                    {order.id}? This action cannot be undone.
                                </p>
                            </div>

                            <div className="mt-4 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    onClick={() =>
                                        setShowCancelConfirmation(false)
                                    }
                                >
                                    Go Back
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    onClick={confirmCancel}
                                >
                                    Confirm Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            <div className="fixed inset-0 overflow-y-auto z-[1050]">
                <div className="flex items-center justify-center min-h-screen px-4 py-6 text-center">
                    <div
                        className="fixed inset-0 transition-opacity"
                        aria-hidden="true"
                    >
                        <div
                            className="absolute inset-0 bg-dark opacity-45"
                            onClick={onClose}
                        ></div>
                    </div>

                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="bg-white px-4 pt-4 pb-2">
                            <div className="flex flex-col">
                                {/* Order Status */}
                                <div className="mb-4">
                                    <span
                                        className={`text-sm font-medium ${getStatusColor(
                                            order.status
                                        )}`}
                                    >
                                        {order.status.toUpperCase()}
                                    </span>
                                    <h2 className="text-xl font-bold text-gray-900 mt-1">
                                        Order #{order.id}
                                    </h2>
                                </div>

                                {/* Product List */}
                                <div className="space-y-4 mb-6 max-h-24 overflow-y-auto">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-start space-x-4"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                                                    <img
                                                        src={getProductImage(
                                                            item.product
                                                        )}
                                                        alt={item.product.name}
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror =
                                                                null;
                                                            e.target.src =
                                                                "https://via.placeholder.com/150?text=No+Image";
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex-1 h-20 flex flex-col justify-between">
                                                    <div className="flex flex-col w-full space-y-1 overflow-hidden">
                                                        <div className="w-full">
                                                            <h3 className="text-md fs-5 font-semibold text-gray-900 truncate">
                                                                {
                                                                    item.product
                                                                        .name
                                                                }
                                                            </h3>
                                                            {item.variation && (
                                                                <p className="text-sm text-gray-600 truncate">
                                                                    {
                                                                        item
                                                                            .variation
                                                                            .name
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="w-full flex justify-between items-end">
                                                            <p className="text-md text-gray-600">
                                                                Qty:{" "}
                                                                {item.quantity}
                                                            </p>
                                                            <p className="text-sm font-medium text-gray-900 text-end">
                                                                ₱
                                                                {(
                                                                    item.price *
                                                                    item.quantity
                                                                ).toLocaleString(
                                                                    "en-PH",
                                                                    {
                                                                        minimumFractionDigits: 2,
                                                                    }
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Details */}
                                <div className="py-2 border-t border-gray-200">
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600">
                                            Order date:
                                        </span>
                                        <span className="font-medium">
                                            {formatDate(order.created_at)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-gray-600">
                                            Payment method:
                                        </span>
                                        <span className="font-medium">
                                            {order.payment_method === "card"
                                                ? "Credit Card"
                                                : order.payment_method ===
                                                  "gcash"
                                                ? "GCash"
                                                : "Pay In-Store"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-gray-600">
                                            Payment status:
                                        </span>
                                        <span className="font-medium">
                                            {renderPaymentStatus()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-gray-600">
                                            Delivered on:
                                        </span>
                                        <span className="font-medium text-green-600 flex items-center">
                                            {order.status.toLowerCase() ===
                                            "completed" ? (
                                                <>
                                                    <svg
                                                        className="w-4 h-4 mr-1"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M5 13l4 4L19 7"
                                                        ></path>
                                                    </svg>
                                                    {formatDate(
                                                        order.actual_completion_date
                                                    )}
                                                </>
                                            ) : (
                                                "-"
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* Delivery Information */}
                                {order.shipping_address && (
                                    <div className="py-3 border-t border-gray-200">
                                        <h4 className="font-semibold text-gray-900 mb-2">
                                            Delivery
                                        </h4>
                                        <p className="text-gray-600 text-sm mb-1">
                                            Address
                                        </p>
                                        <p className="text-sm">
                                            {order.shipping_address
                                                .split("\n")
                                                .map((line, i) => (
                                                    <React.Fragment key={i}>
                                                        {line}
                                                        <br />
                                                    </React.Fragment>
                                                ))}
                                        </p>
                                    </div>
                                )}

                                {/* Price Details */}
                                <div className="py-3 border-t border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-2">
                                        Price Details
                                    </h4>
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600">
                                            Total Product Price
                                        </span>
                                        <span className="text-gray-800">
                                            ₱
                                            {order.total_amount.toLocaleString(
                                                "en-PH"
                                            )}
                                        </span>
                                    </div>

                                    {order.payment_status ===
                                        "partially_paid" && (
                                        <>
                                            <div className="flex justify-between py-1">
                                                <span className="text-gray-600">
                                                    Amount Paid
                                                </span>
                                                <span className="text-green-600">
                                                    ₱
                                                    {(
                                                        order.down_payment_amount ||
                                                        0
                                                    ).toLocaleString("en-PH")}
                                                </span>
                                            </div>
                                            <div className="flex justify-between py-1">
                                                <span className="text-gray-600">
                                                    Remaining Balance
                                                </span>
                                                <span className="text-red-600">
                                                    ₱
                                                    {remainingBalance.toLocaleString(
                                                        "en-PH"
                                                    )}
                                                </span>
                                            </div>
                                        </>
                                    )}

                                    <div className="flex justify-between py-2 mt-2 border-t border-gray-200 font-bold">
                                        <span>
                                            {order.payment_status ===
                                            "partially_paid"
                                                ? "Amount Due Now"
                                                : "Order Total"}
                                        </span>
                                        <span>
                                            ₱
                                            {order.payment_status ===
                                            "partially_paid"
                                                ? remainingBalance.toLocaleString(
                                                      "en-PH"
                                                  )
                                                : order.total_amount.toLocaleString(
                                                      "en-PH"
                                                  )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-white px-4 pb-3 sm:px-6 flex flex-col gap-3">
                            {order.status.toLowerCase() === "pending" ? (
                                <button
                                    className="w-full py-2 px-4 rounded-md text-white bg-black hover:bg-gray-800 transition font-medium"
                                    onClick={handleCancelClick}
                                >
                                    Cancel Order
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm"
                                    onClick={onClose}
                                >
                                    Close
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderDetailsModal;
