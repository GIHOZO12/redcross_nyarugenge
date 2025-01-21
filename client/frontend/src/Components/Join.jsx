// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { FaBars, FaEnvelope, FaLock, FaTimes } from 'react-icons/fa';

const Join = () => {
  const [state, setState] = useState('login'); // Tracks the form state ('login' or 'register')
  const [showLogin, setShowLogin] = useState(true); // Tracks whether the modal is visible

  return (
    <>
      {showLogin && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
          <div>
            <form className="bg-white text-black p-14 relative w-[90%] max-w-md rounded-md shadow-lg">
              <p className="mb-4">
                {state === 'login'
                  ? 'Welcome back! Please sign in to continue.'
                  : 'Create an account to get started!'}
              </p>
              {state === 'login' && (
                <>
                  {/* Login Form */}
                  <div className="flex items-center p-4 border rounded-md mb-4">
                    <FaEnvelope className="mr-2 text-gray-500" />
                    <input
                      type="email"
                      placeholder="Email"
                      className="flex-1 outline-none"
                    />
                  </div>
                  <div className="flex items-center p-4 border rounded-md mb-4">
                    <FaLock className="mr-2 text-gray-500" />
                    <input
                      type="password"
                      placeholder="Password"
                      className="flex-1 outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="submit"
                      value="Login"
                      className="bg-red-500 cursor-pointer rounded-md w-full p-2 text-white hover:bg-red-600"
                    />
                  </div>
                  <p className="mt-4 text-sm">
                    New to the app?{' '}
                    <a
                      href="#"
                      className="text-blue-600"
                      onClick={() => setState('register')}
                    >
                      Create one
                    </a>
                  </p>
                </>
              )}
              {state !== 'login' && (
                <>
                  {/* Register Form */}
                  <div className="flex items-center p-4 border rounded-md mb-4">
                    <input
                      type="text"
                      placeholder="Username"
                      className="flex-1 outline-none"
                    />
                  </div>
                  <div className="flex items-center p-4 border rounded-md mb-4">
                    <FaEnvelope className="mr-2 text-gray-500" />
                    <input
                      type="email"
                      placeholder="Email"
                      className="flex-1 outline-none"
                    />
                  </div>
                  <div className="flex items-center p-4 border rounded-md mb-4">
                    <FaLock className="mr-2 text-gray-500" />
                    <input
                      type="password"
                      placeholder="Password"
                      className="flex-1 outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="submit"
                      value="Register"
                      className="bg-red-500 cursor-pointer rounded-md w-full p-2 text-white hover:bg-red-600"
                    />
                  </div>
                  <p className="mt-4 text-sm">
                    I already have an account.{' '}
                    <a
                      href="#"
                      className="text-blue-600"
                      onClick={() => setState('login')}
                    >
                      Login
                    </a>
                  </p>
                </>
              )}
              {/* Close Button */}
              <FaTimes
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => setShowLogin(false)}
              />
            </form>
          </div>
        </div>
      )}
    
     
     
    </>
  );
};

export default Join;
