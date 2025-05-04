import React from "react";
import { router } from "@inertiajs/react"; // Correct import

export default function LogOutButton({ onLogout }) {
    const handleLogout = () => {
        router.post("/logout"); // Use router.post for logout
        onLogout(); // Close the modal after logout
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-pill hover:bg-red-600 transition-colors"
        >
            Log Out
        </button>
    );
}
