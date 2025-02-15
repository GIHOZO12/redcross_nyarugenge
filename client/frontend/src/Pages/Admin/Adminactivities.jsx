import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'
import AdminLayout from '../../Layout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Adminactivities = () => {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/admin_activities/')
      .then((response) => {
        setActivities(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const deleteActivity = (id) => {
    if (!id) {
      console.log('Delete error: No ID provided');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this activity?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://127.0.0.1:8000/admin/delete_activity/${id}`,{
          headers:{
          "X-CSRFToken": Cookies.get("csrftoken"),
          },
          withCredentials:true,
        })
          .then((response) => {
            if (response.data.status) {
              setActivities(activities.filter((item) => item.id !== id));
              Swal.fire('Deleted!', 'Activity deleted successfully.', 'success');
            }
          })
          .catch((error) => {
            console.log('Error deleting activity:', error);
            Swal.fire('Error!', 'Something went wrong.', 'error');
          });
      }
    });
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header with Button */}
        <header className="flex flex-col sm:flex-col md:flex-row justify-between items-center mb-6">
          <div className='m-5'>
            <h1 className="text-3xl font-semibold text-blue-800">Redcross Activities</h1>
            <p className="mt-2 text-gray-600">Here are the latest activities of Redcross</p>
          </div>
          {/* Add Button */}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => navigate('/Admin/addactivity')}
          >
            Add Activity
          </button>
        </header>

        {/* Activity List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((item, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              {/* Image */}
              <img
                src={item.redcross_activities_image}
                alt={item.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />

              {/* Content */}
              <div>
                <h2 className="text-xl font-semibold text-blue-700 mb-2">{item.title}</h2>
                <p className="text-gray-700 text-sm">{item.description}</p>

                <div className="p-3">
                  <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors mr-2"
                  onClick={()=>navigate(`/edit_activity/${item.id}`)}
                  >
                    Edit
                  </button>

                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    onClick={() => deleteActivity(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Adminactivities;
