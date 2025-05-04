import React, { useState, useEffect } from "react";
import axios from "axios";

const Pagination = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = async (page) => {
        try {
            const response = await axios.get(`/users?page=${page}`);
            setUsers(response.data.data);
            setCurrentPage(response.data.current_page);
            setLastPage(response.data.last_page);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    return (
        <div>
            <h2>User List</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} - {user.email}
                    </li>
                ))}
            </ul>

            {/* Pagination Controls */}
            <div>
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>
                    {" "}
                    Page {currentPage} of {lastPage}{" "}
                </span>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === lastPage}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;
