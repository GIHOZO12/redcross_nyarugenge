import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Update_activity = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activity, setActivity] = useState({
        title: "",
        text: "",
        activity_image: null,
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/update_activity/${id}/`)
            .then((res) => {
                console.log(res.data);
                // Map backend keys to frontend keys
                const activityData = {
                    title: res.data.activity.title,
                    text: res.data.activity.text,
                    activity_image: res.data.activity.activityImage, // Map activityImage to activity_image
                };
                setActivity(activityData);
            })
            .catch((error) => {
                console.error("Error fetching activity data", error);
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formdata = new FormData();
        formdata.append("title", activity.title);
        formdata.append("text", activity.text);
        formdata.append("activity_image", activity.activity_image);

        axios.post(`http://127.0.0.1:8000/update_activity/${id}/`, formdata, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((res) => {
            console.log(res.data);
            setMessage("Activity updated successfully");
            Swal.fire("Updated", "Activity updated successfully", "success");
            navigate(res.data.redirect_url);
        })
        .catch((error) => {
            console.error("Error updating activity", error);
        });
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <header>
                <h1>Update Activity</h1>
            </header>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col w-full max-w-md p-4 bg-white rounded-md">
                    <label>Title</label>
                    <input 
                        type="text" 
                        className="p-2 border rounded-md w-full" 
                        value={activity.title} 
                        onChange={(e) => setActivity({ ...activity, title: e.target.value })} 
                    />
                    <label>Description</label>
                    <textarea 
                        className="p-2 border rounded-md w-full" 
                        value={activity.text} 
                        onChange={(e) => setActivity({ ...activity, text: e.target.value })} 
                    ></textarea>
                    <label>Activity Image</label>
                    <input 
                        type="file" 
                        className="p-2 border rounded-md w-full" 
                        onChange={(e) => setActivity({ ...activity, activity_image: e.target.files[0] })} 
                    />
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Update</button>
                </div>
            </form>
        </div>
    );
};

export default Update_activity;