import React, { useEffect, useState } from "react";
import AdminLayout from "../../Layout/AdminLayout";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import Swal from "sweetalert2";

const AdminMessage = () => {
  const [adminMessages, setAdminMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // "all", "unread", "read", "replied"

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = () => {
    setIsLoading(true);
    let url = "https://gihozo.pythonanywhere.com/admin_messages/";
    
    if (filter === "unread") {
      url = "https://gihozo.pythonanywhere.com/get_unread_messages/";
    } else if (filter === "read") {
      url = "https://gihozo.pythonanywhere.com/get_read_messages/";
    } else if (filter === "replied") {
      url = "https://gihozo.pythonanywhere.com/get_replied_messages/";
    }

    axios
      .get(url)
      .then((res) => {
        setAdminMessages(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
        setIsLoading(false);
      });
  };

  const filteredMessages = adminMessages.filter((msg) => {
    if (filter === "unread") return msg.status !== "read";
    if (filter === "read") return msg.status === "read";
    if (filter === "replied") return msg.is_replied;
    return true; // "all"
  });

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie) {
      const cookies = document.cookie.split(";").map((c) => c.trim());
      for (let cookie of cookies) {
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.split("=")[1]);
          break;
        }
      }
    }
    return cookieValue;
  }

  const handleAction = (action) => {
    if (selectedMessages.length === 0) {
      Swal.fire("Info", "Please select at least one message", "info");
      return;
    }

    Swal.fire({
      title: `Are you sure you want to ${action} the selected messages?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${action} them!`
    }).then((result) => {
      if (result.isConfirmed) {
        const csrfToken = getCookie("csrftoken");
        axios
          .post(
            "https://gihozo.pythonanywhere.com/update_message_status/",
            { ids: selectedMessages, action },
            { 
              headers: { 
                "X-CSRFToken": csrfToken, 
                "Content-Type": "application/json" 
              },
              withCredentials: true
            }
          )
          .then(() => {
            setAdminMessages(prev => 
              action === "delete" 
                ? prev.filter(msg => !selectedMessages.includes(msg.id))
                : prev.map(msg => 
                    selectedMessages.includes(msg.id) 
                      ? { ...msg, status: action === "read" ? "read" : msg.status }
                      : msg
                  )
            );
            Swal.fire("Success", `Messages ${action} successfully`, "success");
            setSelectedMessages([]);
          })
          .catch(() => {
            Swal.fire("Error", `Failed to ${action} messages`, "error");
          });
      }
    });
  };

  const handleReply = (message) => {
    setReplyingTo(message);
    setReplyContent(message.reply || "");
  };

  const sendReply = async () => {
    if (!replyContent.trim()) {
      Swal.fire("Error", "Please enter a reply message", "error");
      return;
    }

    try {
      const csrfToken = getCookie("csrftoken");
      setIsLoading(true);
      
      const response = await axios.post(
        `http://127.0.0.1:8000/reply_to_message/${replyingTo.id}/`,
        { reply: replyContent },
        { 
          headers: { 
            "X-CSRFToken": csrfToken, 
            "Content-Type": "application/json" 
          },
          withCredentials: true
        }
      );

      Swal.fire("Success", "Reply sent successfully!", "success");
      setReplyingTo(null);
      fetchMessages();
    } catch (error) {
      console.error("Error sending reply:", error);
      Swal.fire("Error", "Failed to send reply", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelection = (id) => {
    setSelectedMessages(prev =>
      prev.includes(id) 
        ? prev.filter(msgId => msgId !== id) 
        : [...prev, id]
    );
  };

  const selectAllMessages = (e) => {
    if (e.target.checked) {
      setSelectedMessages(filteredMessages.map(msg => msg.id));
    } else {
      setSelectedMessages([]);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
        <header className="mb-4 flex flex-col md:flex-row justify-between items-center">
          <h2 className="text-xl md:text-3xl font-semibold text-gray-800">Admin Messages</h2>
        </header>

        {/* Filter and Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="bg-white p-3 shadow-md rounded-md flex-1">
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => setFilter("all")}
              >
                All Messages
              </button>
              <button
                className={`px-3 py-1 rounded ${filter === "unread" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => setFilter("unread")}
              >
                Unread
              </button>
              <button
                className={`px-3 py-1 rounded ${filter === "read" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => setFilter("read")}
              >
                Read
              </button>
              <button
                className={`px-3 py-1 rounded ${filter === "replied" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => setFilter("replied")}
              >
                Replied
              </button>
            </div>
          </div>

          <div className="bg-white p-3 shadow-md rounded-md">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleAction("read")}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                disabled={selectedMessages.length === 0 || isLoading}
              >
                Mark as Read
              </button>
              <button
                onClick={() => handleAction("delete")}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                disabled={selectedMessages.length === 0 || isLoading}
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Reply Modal */}
        {replyingTo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Reply to {replyingTo.name}
                </h3>
                <div className="mb-4 p-3 bg-gray-100 rounded">
                  <p className="font-medium">Original Message:</p>
                  <p className="text-gray-700 mt-1">{replyingTo.description}</p>
                </div>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={5}
                  placeholder="Type your reply here..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  disabled={isLoading}
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendReply}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No messages found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-blue-800 text-white">
                  <tr>
                    <th className="p-3 md:p-4 w-10">
                      <input
                        type="checkbox"
                        onChange={selectAllMessages}
                        checked={
                          selectedMessages.length > 0 && 
                          selectedMessages.length === filteredMessages.length
                        }
                      />
                    </th>
                    <th className="p-3 md:p-4 text-left">Name</th>
                    <th className="p-3 md:p-4 text-left">Email</th>
                    <th className="p-3 md:p-4 text-left">Message</th>
                    <th className="p-3 md:p-4 text-left">Date</th>
                    <th className="p-3 md:p-4 text-left">Status</th>
                    <th className="p-3 md:p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map((message) => (
                    <tr
                      key={message.id}
                      className={`border-b hover:bg-gray-50 ${
                        selectedMessages.includes(message.id) ? "bg-gray-100" : ""
                      } ${
                        message.status !== "read" ? "font-semibold" : ""
                      }`}
                    >
                      <td className="p-3 md:p-4">
                        <input
                          type="checkbox"
                          checked={selectedMessages.includes(message.id)}
                          onChange={() => toggleSelection(message.id)}
                        />
                      </td>
                      <td className="p-3 md:p-4">{message.name}</td>
                      <td className="p-3 md:p-4">{message.email}</td>
                      <td className="p-3 md:p-4">
                        <div className="max-w-xs md:max-w-md truncate">
                          {message.description}
                        </div>
                        {message.reply && (
                          <div className="mt-1 text-xs text-blue-600">
                            (Replied)
                          </div>
                        )}
                      </td>
                      <td className="p-3 md:p-4 whitespace-nowrap">
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                      </td>
                      <td className="p-3 md:p-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          message.status === "read" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {message.status}
                        </span>
                      </td>
                      <td className="p-3 md:p-4">
                        <button
                          onClick={() => handleReply(message)}
                          className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                          disabled={isLoading}
                        >
                          {message.reply ? "View/Edit" : "Reply"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMessage;