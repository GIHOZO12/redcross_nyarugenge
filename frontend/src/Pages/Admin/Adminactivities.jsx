import React from 'react';
import AdminLayout from '../../Layout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { activitiesService, getErrorMessage } from '../../api';
import { useFetch } from '../../hooks';

const Adminactivities = () => {
  const navigate = useNavigate();
  const { data: activities, setData: setActivities } = useFetch(
    activitiesService.adminList,
    [],
    []
  );

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
        activitiesService.adminDelete(id)
          .then((data) => {
            if (data && data.status === false) {
              Swal.fire('Error!', data.message || 'Delete failed.', 'error');
              return;
            }
            setActivities((current) => current.filter((item) => item.id !== id));
            Swal.fire('Deleted!', 'Activity deleted successfully.', 'success');
          })
          .catch((error) => {
            Swal.fire('Error!', getErrorMessage(error), 'error');
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
