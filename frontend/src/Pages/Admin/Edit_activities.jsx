import React, { useEffect, useState } from "react";
import AdminLayout from "../../Layout/AdminLayout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

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
        axios.get(`https://gihozo.pythonanywhere.com/edit_activity/${id}`, {
            withCredentials: true  
        })
        .then((res) => {
            setActivities(res.data);
        })
        .catch((error) => {
            console.error("❌ Error fetching activity:", error);
            setMessage("Error fetching activity data");
        });
    }, [id]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("title", activities.title);
        data.append("description", activities.description);

        if (activities.redcross_activities_image) {
            data.append("redcross_activities_image", activities.redcross_activities_image);
        }

        
        axios.post(
            `https://gihozo.pythonanywhere.com/edit_activity/${id}`,
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "X-CSRFToken": getCookie("csrftoken")  
                },
                withCredentials: true, 
            }
        )
        .then((res) => {
            console.log("✅ Response:", res.data);
            setMessage("Activity edited successfully");
            Swal.fire("Updated!", "Activity has been updated successfully.", "success");
            navigate("/admin/activities");
        })
        .catch((error) => {
            console.error("❌ Error:", error);
            setMessage("Error editing activity");
            Swal.fire("Error", "Error editing activity", "error");
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
