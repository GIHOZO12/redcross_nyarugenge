import React, { useEffect, useState } from "react";
import AdminLayout from "../../Layout/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { activitiesService, toFormData, getErrorMessage } from "../../api";

const Edit_activities = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activities, setActivities] = useState({
        title: "",
        description: "",
        redcross_activities_image: null
    });
    const [message, setMessage] = useState("");
    useEffect(() => {
        activitiesService.getForEdit(id)
            .then(setActivities)
            .catch((error) => {
                setMessage(getErrorMessage(error, "Error fetching activity data"));
            });
    }, [id]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = toFormData({
            title: activities.title,
            description: activities.description,
            redcross_activities_image: activities.redcross_activities_image,
        });

        activitiesService.saveEdit(id, data)
            .then(() => {
                setMessage("Activity edited successfully");
                Swal.fire("Updated!", "Activity has been updated successfully.", "success");
                navigate("/admin/activities");
            })
            .catch((error) => {
                const text = getErrorMessage(error, "Error editing activity");
                setMessage(text);
                Swal.fire("Error", text, "error");
            });
    };

    return (
        <AdminLayout>
            <div>
                <header>
                    <h1>Edit Activity</h1>
                    <section className="flex flex-col">
                        <form className="flex flex-col" onSubmit={handleSubmit}>
                            <label>Title</label>
                            <input
                                type="text"
                                value={activities.title || ""}
                                onChange={(e) => setActivities({ ...activities, title: e.target.value })}
                                className="p-2 w-full border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <label>Description</label>
                            <textarea
                                value={activities.description || ""}
                                onChange={(e) => setActivities({ ...activities, description: e.target.value })}
                                className="p-2 w-full border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <label>Image</label>
                            <input
                                type="file"
                                className="shadow border rounded w-full py-2 px-3 text-gray-700"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        setActivities({ ...activities, redcross_activities_image: e.target.files[0] });
                                    }
                                }}
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Update
                            </button>
                            <p>{message}</p>
                        </form>
                    </section>
                </header>
            </div>
        </AdminLayout>
    );
};

export default Edit_activities;
