// eslint-disable-next-line no-unused-vars
import axios from 'axios';
import React, { useState } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Getintouch = () => {
  
  const [subscribe,setSubscribe]=useState({email:''})
  const [message,setMessage]=useState('')

  const handleChange=(e)=>{
    const {name,value}=e.target
    setSubscribe({...subscribe,[name]:value})
  }

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const handleSubmit= async(e)=>{
    e.preventDefault()
    const data=new FormData()
    data.append('email',subscribe.email)

    try{
      const csrfToken=getCookie('csrftoken')
      const response =await axios.post("https://gihozo.pythonanywhere.com/add_email_toseubscribenewsletter/",data,{
        headers:{
          "Content-Type":"multipart/form-data",
          "X-CSRFToken":csrfToken
        }
      })
      setMessage(response.data.message)
      setSubscribe({email:''})
    }catch(error){
      console.error("error while subscribing to newsletter",error)
    }
  }


  return (
    <div className="bg-black text-white p-6 mt-48">
      <h1 className="text-center text-2xl md:text-3xl font-bold mb-6">Get in Touch</h1>
      
      <section className="flex flex-col lg:flex-row justify-between items-center space-y-8 lg:space-y-0 lg:space-x-10 text-center lg:text-left">
        
        {/* Social Media Section */}
        <div className="flex flex-col items-center lg:items-start space-y-4">
          <h2 className="text-xl font-semibold">Social Media</h2>
          <div className="flex space-x-4">
            <a href="#" className="text-2xl hover:text-blue-600 transition duration-300">
              <FaFacebook />
            </a>
            <a href="#" className="text-2xl hover:text-blue-400 transition duration-300">
              <FaTwitter />
            </a>
            <a href="#" className="text-2xl hover:text-pink-600 transition duration-300">
              <FaInstagram />
            </a>
            <a href="#" className="text-2xl hover:text-blue-700 transition duration-300">
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Our Partners Section */}
        <div className="flex flex-col items-center lg:items-start space-y-2">
          <h2 className="text-xl font-semibold">Our Partners</h2>
          <h4 className="text-lg">UR-CST</h4>
          <h4 className="text-lg">Nyarugenge District</h4>
          <h4 className="text-lg">Rwanda Redcross</h4>
        </div>

        {/* Newsletter Subscription Section */}
        <div className="flex flex-col items-center space-y-4 w-full max-w-sm">
          <h2 className="text-xl font-semibold">Subscribe</h2>
          {message && <p className="text-green-600 text-center">{message}</p>}
          <div className="flex ">
  
            <form className='flex w-full' onSubmit={handleSubmit}>
              
            <input
              type="email"
              placeholder="Enter your email"
              required
              onChange={handleChange}
              name="email"
              value={subscribe.email}
              className="p-2 w-full rounded-l text-black focus:outline-none"
            />
            <button type='submit' className="bg-red-600 text-white py-2 px-4 md:px-6 rounded-r hover:bg-blue-700 transition duration-300">
              Subscribe
            </button>
            </form>
          </div>
        </div>

      </section>
    </div>
  );
};

export default Getintouch;
