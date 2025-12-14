import axios from "axios";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const response = await axios.get("http://localhost:8000/api/users/employees/");
            return res.status(200).json(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            return res.status(500).json({ message: "Error fetching users" });
        }
    }
    return res.status(405).json({ message: "Method Not Allowed" });
}
