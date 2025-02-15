import React, { useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../Layout/AdminLayout';

const Adminuser = () => {
  const [users, setUsers] = React.useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/users_info/")
      .then((response) => {
        console.log(response.data);
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 mt-6">Redcross members</h1>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Member role</th>
              
            </tr>
          </thead>
          <tbody>
            {users.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{item.id}</td>
                <td className="px-4 py-2">{item.username}</td>
                <td className="px-4 py-2">{item.email}</td>
                <td className="px-4 py-2">{item.role}</td>
               

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Adminuser;
