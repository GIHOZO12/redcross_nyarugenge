// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { authService, getErrorMessage } from '../api';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [resetpassword, setResetpassword] = useState(true); // Set to true for testing

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      setIsError(true);
      return;
    }

    try {
      const data = await authService.resetPassword({
        email,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      setMessage(data?.message || 'Your password has been reset.');
      setIsError(false);
    } catch (error) {
      setMessage(getErrorMessage(error));
      setIsError(true);
    }
  };

  return (
    <>
      {resetpassword && (
        <div className="fixed inset-0 z-10 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-white rounded-lg shadow-lg p-6 relative">
            <FaTimes
              className="absolute top-4 right-4 cursor-pointer text-red-500 text-xl"
              onClick={() => setResetpassword(false)}
            />
            <form onSubmit={handleSubmit}>
              <h1 className="text-3xl font-bold mb-6 text-center">Reset Password</h1>

              {message && (
                <div
                  className={`mb-4 p-2 rounded ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                >
                  {message}
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ResetPassword;