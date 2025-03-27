import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../Layout/AdminLayout';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

const NewsletterComposer = ({ onClose, onSend }) => {
    const [subject, setSubject] = useState('');
    const { quill, quillRef } = useQuill();
    const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
        if (!subject || !quill?.getText()?.trim()) {
            alert('Please enter a subject and email content');
            return;
        }

        setIsSending(true);
        const htmlContent = quill.root.innerHTML;
        const plainContent = quill.getText();
        
        try {
            await onSend({ subject, htmlContent, plainContent });
            onClose();
        } catch (error) {
            console.error('Error sending newsletter:', error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Compose Newsletter</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
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
                    
                    <div className="h-96">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <div ref={quillRef} className="h-full" />
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
        // Fetch the list of subscribers
        axios.get("http://127.0.0.1:8000/all_subscribes/")
            .then((res) => {
                setSubscriptions(res.data);
            })
            .catch((error) => {
                console.error("Error fetching subscriptions", error);
            });
    }, []);

    const handleSendNewsletter = async ({ subject, htmlContent, plainContent }) => {
        const csrfToken = getCSRFToken();
        
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/send_newsletter/",
                {
                    subject,
                    html_content: htmlContent,
                    plain_content: plainContent
                },
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
                <section className="overflow-x-auto">
                    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">ID</th>
                                <th className="py-3 px-4 text-left">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.map((item, index) => (
                                <tr key={index} className="border-b hover:bg-gray-100">
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