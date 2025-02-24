import React, { useEffect } from 'react'
import { useState } from'react'
import axios from 'axios'
import AdminLayout from '../../Layout/AdminLayout'

const AdminFamily = () => {
    const [family, setFamily] = useState([])
    useEffect(()=>{
        axios.get("http://127.0.0.1:8000/admin_family/")
        .then((response)=>{
            setFamily(response.data)
        }).catch((error)=>{
            console.error("error fetching family",error)
        })

    },[])
    return (
        <AdminLayout>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 mt-6">Redcross Families</h1>
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="px-4 py-2 border-b">ID</th>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Father</th>
                  <th className="px-4 py-2 border-b">Mother</th>
                  <th className="px-4 py-2 border-b">Number of Children</th>
                  
                </tr>
              </thead>
              <tbody>
                {family.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{item.id}</td>
                    <td className="px-4 py-2">{item.name}</td>
                    
                    <td className="px-4 py-2">{item.father}</td>
                    <td className="px-4 py-2">{item.mother}</td>
                    <td className="px-4 py-2">{item.member}0</td>
                   
                   
    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminLayout>
      );
}

export default AdminFamily