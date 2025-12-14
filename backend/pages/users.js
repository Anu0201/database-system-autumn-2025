// pages/users.js
import { useEffect, useState } from "react";
import axios from "axios";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("/api/users"); // API-аас хэрэглэгчийн мэдээллийг авна
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Users List</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.full_name} ({user.email})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UsersPage;
