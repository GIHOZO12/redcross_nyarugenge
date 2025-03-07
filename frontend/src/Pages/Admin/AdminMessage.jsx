// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import AdminLayout from "../../Layout/AdminLayout";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import Swal from "sweetalert2";

const AdminMessage = () => {
  const [adminMessages, setAdminMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);

  useEffect(() => {
    axios
      .get("https://gihozo.pythonanywhere.com/admin_messages/")
      .then((res) => setAdminMessages(res.data))
      .catch((error) => console.error("Error fetching data", error));
  }, []);

  const unreadMessages = adminMessages.filter((msg) => msg.status !== "read");
  const readMessages = adminMessages.filter((msg) => msg.status === "read");

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

  const handleAction = (action) => {
    if (selectedMessages.length === 0) return;

    axios
      .post(
        "https://gihozo.pythonanywhere.com/update_message_status/",
        { ids: selectedMessages, action },
        { headers: { "X-CSRFToken": getCookie("csrftoken"), "Content-Type": "application/json" } }
      )
      .then(() => {
        setAdminMessages((prev) => prev.filter((msg) => !selectedMessages.includes(msg.id)));
        Swal.fire("Success", `Messages marked as ${action}`, "success");
      })
      .catch(() => Swal.fire("Error", "Failed to update message", "error"));

    setSelectedMessages([]);
  };

  const fetchMessages = (url) => {
    axios
      .get(url)
      .then((res) => setAdminMessages(res.data.messages))
      .catch(() => Swal.fire("Error", "Failed to fetch messages", "error"));
  };

  const toggleSelection = (id) => {
    setSelectedMessages((prev) =>
      prev.includes(id) ? prev.filter((msgId) => msgId !== id) : [...prev, id]
    );
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
        <header className="mb-4 flex flex-col md:flex-row justify-between items-center">
          <h2 className="text-xl md:text-3xl font-semibold text-gray-800">Admin Messages</h2>
        </header>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-4 bg-white p-3 md:p-4 shadow-md rounded-md">
          <button
            className="bg-blue-500 text-white px-3 md:px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => fetchMessages("https://gihozo.pythonanywhere.com/get_all_messages/")}
          >
            All Messages
          </button>

          <button
            onClick={() => handleAction("read")}
            className="bg-green-500 text-white px-3 md:px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            disabled={selectedMessages.length === 0}
          >
            Mark as Read
          </button>

          <button
            onClick={() => fetchMessages("https://gihozo.pythonanywhere.com/get_archived_messages/")}
            className="bg-purple-500 text-white px-3 md:px-4 py-2 rounded hover:bg-purple-700"
          >
            View Archive
          </button>

          <button
            onClick={() => handleAction("delete")}
            className="bg-red-500 text-white px-3 md:px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            disabled={selectedMessages.length === 0}
          >
            Delete
          </button>
          <button
           
            className="bg-blue-500 text-white px-3 md:px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={selectedMessages.length === 0}
          >
            Replay
          </button>
        </div>

        {/* Table Container for Responsiveness */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full border-collapse text-sm md:text-base">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="p-2 md:p-4">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedMessages(e.target.checked ? unreadMessages.map((msg) => msg.id) : [])
                    }
                  />
                </th>
                <th className="p-2 md:p-4">ID</th>
                <th className="p-2 md:p-4">Name</th>
                <th className="p-2 md:p-4">Email</th>
                <th className="p-2 md:p-4">Message</th>
                <th className="p-2 md:p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {[...unreadMessages, ...readMessages].map((message) => (
                <tr
                  key={message.id}
                  className={`border-b hover:bg-gray-100 ${
                    selectedMessages.includes(message.id) ? "bg-gray-200" : ""
                  }`}
                >
                  <td className="p-2 md:p-4">
                    <input
                      type="checkbox"
                      checked={selectedMessages.includes(message.id)}
                      onChange={() => toggleSelection(message.id)}
                    />
                  </td>
                  <td className="p-2 md:p-4">{message.id}</td>
                  <td className="p-2 md:p-4">{message.name}</td>
                  <td className="p-2 md:p-4">{message.email}</td>
                  <td className="p-2 md:p-4">{message.description}</td>
                  <td className="p-2 md:p-4">
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMessage;
