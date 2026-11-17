import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../Layout/AdminLayout'
import { AppContext } from '../../AppContext/Appcontext'
import { familyService, isFamilyOfficer } from '../../api'
import { useFetch } from '../../hooks'

const AdminFamily = () => {
    const { data: family } = useFetch(familyService.adminList, [], [])
    const { user } = useContext(AppContext)
    // Only the President, Vice President or Secretary may restructure a
    // family, so only they are shown the way in. The server enforces the
    // same rule; being staff is not enough.
    const canManage = isFamilyOfficer(user)
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
                  {canManage && <th className="px-4 py-2 border-b">Manage</th>}
                  
                </tr>
              </thead>
              <tbody>
                {family.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{item.id}</td>
                    <td className="px-4 py-2">{item.name}</td>
                    
                    <td className="px-4 py-2">{item.father}</td>
                    <td className="px-4 py-2">{item.mother}</td>
                    <td className="px-4 py-2">{item.number_of_members}</td>
                    {canManage && (
                      <td className="px-4 py-2">
                        <Link
                          to={`/admin/families/${item.id}`}
                          className="text-blue-700 underline hover:text-blue-900"
                        >
                          Manage
                        </Link>
                      </td>
                    )}
                   
                   
    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminLayout>
      );
}

export default AdminFamily
