import { useEffect, useState } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
  const fetchUsers = async () => {
    try {
      // Changed from /api/users to /api/auth
      const res = await axios.get('http://localhost:4000/api/auth'); 
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };
  fetchUsers();
}, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">User Management [cite: 136]</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Name [cite: 166]</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Email [cite: 167]</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Role [cite: 169]</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(u => (
              <tr key={u._id}>
                <td className="px-6 py-4">{u.name}</td>
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4 capitalize">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;