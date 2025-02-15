import React, { useEffect, useState } from 'react';
import AdminLayout from '../../Layout/AdminLayout';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

const EditFellowership = () => {
  const navigate=useNavigate()
  const { id } = useParams();
  const [fellowership, setFellowership] = useState(null);
  const [message, setMessage] = useState(""); // ✅ Add a success message state

  useEffect(() => {
    console.log("📢 Fetching:", `http://127.0.0.1:8000/admin_edit_fellowship/${id}/`);
    
    axios.get(`http://127.0.0.1:8000/admin_edit_fellowship/${id}/`)
      .then((res) => {
        console.log("✅ Data received:", res.data);
        setFellowership(res.data);
      })
      .catch((error) => console.error("❌ Error fetching data:", error.response?.data || error));
  }, [id]);
  

  if (!fellowership) {
    return <p>Loading...</p>; 
  }

  // ✅ Function to handle form submission (Update Fellowship)
  const updateFellowship = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("title", fellowership.title);
    formData.append("description", fellowership.description);
    if (fellowership.image instanceof File) {
      formData.append("fellowership_image", fellowership.image);
    }
  
    console.log("📤 Sending update to:", `http://127.0.0.1:8000/admin_edit_fellowship/${id}/`);
    console.log("📦 Payload:", [...formData.entries()]);
  
    axios.post(`http://127.0.0.1:8000/admin_edit_fellowship/${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => {
      console.log("✅ Success:", res.data);
      Swal.fire("Updated!", "Fellowship has been edited.", "success")
      navigate("/admin/myfelowership")
    })
    .catch((error) => console.error("❌ Update error:", error.response?.data || error));
  };

  return (
    <AdminLayout>
      <div className='min-h-screen'>
        <h1>Edit Fellowship Page</h1>

        {/* ✅ Success Message Popup */}
        {message && (
          <div className="bg-green-500 text-white p-3 rounded mb-4">
            {message}
          </div>
        )}

        <section className='w-1/2 bg-white rounded-lg p-8 flex flex-col'>
          <form onSubmit={updateFellowship}>  {/* ✅ Add onSubmit handler */}
            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2'>Fellowship Title</label>
              <input 
                className='shadow border rounded w-full py-2 px-3 text-gray-700' 
                type='text' 
                placeholder='Title' 
                value={fellowership.title || ""} 
                onChange={(e) => setFellowership({ ...fellowership, title: e.target.value })} 
              />

              <label className='block text-gray-700 text-sm font-bold mb-2'>Description</label>
              <textarea 
                className='shadow border rounded w-full py-2 px-3 text-gray-700' 
                placeholder='Description' 
                value={fellowership.description || ""} 
                onChange={(e) => setFellowership({ ...fellowership, description: e.target.value })} 
              />

              <label className='block text-gray-700 text-sm font-bold mb-2'>Fellowship Image</label>
              <input 
                className='shadow border rounded w-full py-2 px-3 text-gray-700' 
                type='file' 
                onChange={(e) => setFellowership({ ...fellowership, image: e.target.files[0] })} 
              />

              <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4' type='submit'>
                Update Fellowship
              </button>
            </div>
          </form>
        </section>
      </div>
    </AdminLayout>
  );
};

export default EditFellowership;
