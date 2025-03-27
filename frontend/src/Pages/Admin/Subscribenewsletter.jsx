// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../Layout/AdminLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Custom toolbar configuration
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ],
};

const NewsletterComposer = ({ onClose, onSend }) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !content.trim()) {
      alert('Please enter a subject and email content');
      return;
    }

    setIsSending(true);
    
    try {
      // Convert content to plain text by stripping HTML tags
      const plainContent = content.replace(/<[^>]*>/g, '');
      await onSend({ 
        subject, 
        htmlContent: content,
        plainContent 
      });
      onClose();
    } catch (error) {
      console.error('Error sending newsletter:', error);
      alert('Failed to send newsletter');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Compose Newsletter</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            &times;
          </button>
        </div>
        
        <div className="p-4 space-y-4 overflow-y-auto flex-grow">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Newsletter subject"
            />
          </div>
          
          <div className="h-[400px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              className="h-[300px] mb-12"
            />
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isSending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isSending ? 'Sending...' : 'Send Newsletter'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Subscribenewsletter = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [showComposer, setShowComposer] = useState(false);

  const getCSRFToken = () => {
    const csrfToken = document.cookie
      .split(';')
      .find(cookie => cookie.trim().startsWith('csrftoken='))
      ?.split('=')[1];
    return csrfToken;
  };

  useEffect(() => {
    axios.get("https://gihozo.pythonanywhere.com/all_subscribes/")
      .then((res) => setSubscriptions(res.data))
      .catch((error) => console.error("Error fetching subscriptions", error));
  }, []);

  const handleSendNewsletter = async ({ subject, htmlContent, plainContent }) => {
    const csrfToken = getCSRFToken();
    
    try {
      const response = await axios.post(
        "https://gihozo.pythonanywhere.com/send_newsletter/",
        { subject, html_content: htmlContent, plain_content: plainContent },
        {
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );
      alert(response.data.message || 'Newsletter sent successfully!');
      return response.data;
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send newsletter');
      throw error;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Newsletter Subscriptions</h1>
          <button 
            onClick={() => setShowComposer(true)} 
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Send Newsletter
          </button>
        </header>
        
        <section className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{item.id}</td>
                  <td className="py-3 px-4">{item.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {showComposer && (
          <NewsletterComposer 
            onClose={() => setShowComposer(false)} 
            onSend={handleSendNewsletter}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default Subscribenewsletter;