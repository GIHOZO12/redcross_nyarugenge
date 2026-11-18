import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FAMILIES } from "../api";
import { useFamilyPage } from "../hooks";

const UnitFamily = () => {
  const navigate=useNavigate()

  const {
    familyData,
    activities,
    error,
    // Server-side answer for THIS family: its own father/mother, or staff.
    canAddActivity,
    handleDeleteActivity,
  } = useFamilyPage(
    FAMILIES.NEUTRALITY
  );

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
  




  return (
    <div className="min-h-screen bg-gray-100 pt-16 px-6">
     
      <header className="text-center mb-8">
        <div className="flex justify-center items-center mt-20 gap-14">
        <h1 className="text-4xl font-bold text-red-500">{familyData.name} Family</h1>
      {canAddActivity &&(
     <Link to="/addactivities/neutrality">  <button className="bg-black hover:bg-black hover:scale-[1.1] text-white font-bold py-2 px-4 rounded">Add activity</button></Link> 
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
                  <Link
                    to={`/family-activity/${activity.id}`}
                    className="inline-block mt-2 text-sm font-semibold text-red-600 hover:text-red-800"
                  >
                    View details &rarr;
                  </Link>
                  {canAddActivity &&(
                  <div className="flex justify-end p-2  gap-3">
                  <button onClick={()=>handleDeleteActivity(activity.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors ">Delete</button>
                  <button onClick={()=>navigate(`/update_activity/${activity.id}/`)}  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors mr-2 ">Edit</button>
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

export default UnitFamily;
