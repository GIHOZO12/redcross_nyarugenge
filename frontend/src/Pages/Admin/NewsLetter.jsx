import React, { useState } from 'react';
import axios from 'axios';
import { useQuill } from 'react-quilljs'; // or any other rich text editor
import 'quill/dist/quill.snow.css'; // Styles for the editor
import AdminLayout from '../../Layout/AdminLayout';

const NewsletterComposer = ({ onClose }) => {
    const [subject, setSubject] = useState('');
    const { quill, quillRef } = useQuill();
    const [isSending, setIsSending] = useState(false);
    
    const getCSRFToken = () => {
        const csrfToken = document.cookie
          .split(';')
          .find(cookie => cookie.trim().startsWith('csrftoken='))
          ?.split('=')[1];
        return csrfToken;
    };

    const handleSend = async () => {
        if (!subject || !quill.getText().trim()) {
            alert('Please enter a subject and email content');
            return;
        }

        if (!window.confirm('Are you sure you want to send this newsletter to all subscribers?')) {
            return;
        }

        setIsSending(true);
        
        try {
            const htmlContent = quill.root.innerHTML;
            const plainContent = quill.getText();
            
            const csrfToken = getCSRFToken();
            
            const response = await axios.post(
                "https://gihozo.pythonanywhere.com/send_newsletter/",
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
            
            alert(response.data.message);
            onClose();
        } catch (error) {
            console.error('Error sending newsletter:', error);
            alert(error.response?.data?.message || 'Failed to send newsletter');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <AdminLayout>
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
        </AdminLayout>
    );
};

export default NewsletterComposer;