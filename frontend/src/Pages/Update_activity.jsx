import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { activitiesService, toFormData, getErrorMessage } from "../api";

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
        activitiesService.getForUpdate(id)
            .then((data) => {
                // Map backend keys to frontend keys
                setActivity({
                    title: data.activity.title,
                    text: data.activity.text,
                    activity_image: data.activity.activityImage, // Map activityImage to activity_image
                });
            })
            .catch((error) => {
                setMessage(getErrorMessage(error, "Error fetching activity data"));
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formdata = toFormData({
            title: activity.title,
            text: activity.text,
            // Only send the image when a new file was picked. `activity_image`
            // is loaded from the API as the current image's URL, and posting
            // that string back would arrive as a text field rather than an
            // upload - the server would see no file and reject the request.
            activity_image:
                activity.activity_image instanceof File
                    ? activity.activity_image
                    : undefined,
        });

        activitiesService.update(id, formdata)
            .then((data) => {
                setMessage("Activity updated successfully");
                Swal.fire("Updated", "Activity updated successfully", "success");
                if (data?.redirect_url) navigate(data.redirect_url);
            })
            .catch((error) => {
                setMessage(getErrorMessage(error, "Error updating activity"));
            });
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <header>
                <h1>Update Activity</h1>
            </header>
            {/* The page tracked this message but never rendered it, so a failed
                update looked like nothing happened at all. */}
            {message && (
                <div
                    className={`w-full max-w-md mb-4 p-3 rounded-md text-sm ${
                        message.includes("success")
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {message}
                </div>
            )}
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
