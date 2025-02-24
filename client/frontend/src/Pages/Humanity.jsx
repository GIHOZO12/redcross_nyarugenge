import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext/Appcontext";
import Swal from "sweetalert2";
import { formatDistanceToNow } from "date-fns";

const Humanity_family = () => {
  const [familyData, setFamilyData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const {user} =useContext(AppContext)
  const navigate=useNavigate()

  useEffect(() => {
    const fetchFamilyData = async () => {
      try {
       
        const familyResponse = await axios.get(
          "http://127.0.0.1:8000/family_list/Humanity/"
        );
        setFamilyData(familyResponse.data.family);

        
        const activitiesResponse = await axios.get(
          "http://127.0.0.1:8000/family_activities/Humanity/"
        );
        setActivities(activitiesResponse.data.activities);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Unable to fetch family data or activities.");
      }
    };

    fetchFamilyData();
  }, []);

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie) {
      const cookies = document.cookie.split(";").map((c) => c.trim());
      cookies.forEach((cookie) => {
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.split("=")[1]);
        }
      });
    }
    return cookieValue;
  }

  const handleDeleteActivity = async (id) => {
    const csrfToken = getCookie("csrftoken");

    if (!id) {
      console.error("Activity ID is undefined");
      setError("Invalid activity ID.");
      return;
    }
    console.log("Deleting activity with ID:", id);

    const result =await Swal.fire({
      "title":"are you sure?",
      "text":"You won't be able to revert this!",
      "icon":"warning",
      "showCancelButton":true,
      "confirmButtonColor":"#d33",
      "cancelButtonColor":"#3085d6",
      "confirmButtonText":"Yes, delete it!"
      
    })
    if(result.isConfirmed){

    try {
      const response = await axios.delete(`http://127.0.0.1:8000/family_delete_activity/${id}/`, {
        headers: {
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      });
      

      if (response.data.status) {
        setActivities(activities.filter((activity) => activity.id !== id));
        Swal.fire("Deleted", "Deleted successfully", "success");
        setError("");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting activity", error);
      setError("Error deleting activity");
    }
  }
  };

  if (error) {
    return (
      <div className="text-center text-red-500 mt-16">
        <p>{error}</p>
      </div>
    );
  }

  if (!familyData) {
    return (
      <div className="text-center text-gray-500 mt-16">
        <p>Loading family data...</p>
      </div>
    );
  }


  const isFamilyParent =
  user?.is_authenticated &&
  familyData &&
  familyData.father && // Ensure father exists
  familyData.mother || // Ensure mother exists
  (user.id === familyData.father.id || user.id === familyData.mother.id);


 
  

  return (
    <div className="min-h-screen bg-gray-100 pt-16 px-6">
     
      <header className="text-center mb-8">
        <div className="flex justify-center items-center mt-20 gap-14">
        <h1 className="text-4xl font-bold text-red-500">{familyData.name} Family</h1>
        {isFamilyParent && (
     <Link to="/addactivities/Humanity">  <button className="bg-black hover:bg-black hover:scale-[1.1] text-white font-bold py-2 px-4 rounded">Add activity</button></Link> 
    )}
        </div>
        <p className="text-gray-600 mt-2">
          Welcome to the {familyData.name} family page!
        </p>
      </header>

      {/* Activities Section */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center p-6">Activities/events of family</h2>
        {activities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <img
                  src={activity.activityImage}
                  alt={activity.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                   {activity.title}
                  </h3>
                  <p className="text-gray-600 mt-2"> {activity.text}</p>
                  <p className="text-sm text-gray-400 mt-4">
                   {new Date(activity.created).toLocaleString()}
                  </p>
                    {isFamilyParent && (
                  <div className="flex justify-end p-2  gap-3">
                  <button onClick={()=>handleDeleteActivity(activity.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors ">Delete</button>
                  <button  onClick={()=>navigate(`/update_activity/${activity.id}/`)}
                   className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors mr-2 ">Edit</button>
                  </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No activities found for this family.</p>
        )}
      </section>
    </div>
  );
};

export default Humanity_family ;
