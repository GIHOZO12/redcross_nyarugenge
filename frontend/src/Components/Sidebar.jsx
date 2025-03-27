import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaAllergies, FaBars, FaEnvelope, FaTachometerAlt, FaTimes, FaUserAlt } from "react-icons/fa";
import axios from "axios";
import { MdDashboard } from "react-icons/md";
import { MdFamilyRestroom } from "react-icons/md";
import {FaHandsHelping} from 'react-icons/fa'
import { FaFirstAid } from "react-icons/fa";
import { FaBullhorn  } from "react-icons/fa";
import {  FaUserFriends  } from "react-icons/fa";
 
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [allmessage,setAllMessage]=useState()
  const [newlatter,setNewltter]=useState()
  const [allrequsted,setAllrequested]=useState()

  useEffect(()=>{
    axios.get("https://gihozo.pythonanywhere.com/all_messages/")
    .then((response)=>{
      setAllMessage(response.data)
    }).catch((error)=>{
      console.error("error fetching data",error)
    })
  })

  useEffect(()=>{
    axios.get("https://gihozo.pythonanywhere.com/all_letter/")
    .then((res)=>{
   setNewltter(res.data)
    }).catch((error)=>{
      console.error("error fetching data",error)
    })
  })

  useEffect(() => {
    const fetchRequestedMemberships = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(
          "https://gihozo.pythonanywhere.com/api/total_requested_memberships/", 
          {
            headers: { 
              'Authorization': `Bearer ${token}` 
            }
          }
        );
        setAllrequested(response.data.total_requests);
      } catch (error) {
        console.error("Error fetching requested memberships:", error);
      }
    };
  
    fetchRequestedMemberships();
  }, []);

  return (
    <>
      {/* Sidebar for large screens */}
      <div className="fixed top-0 left-0 w-52 h-full bg-blue-900 text-white  shadow-lg hidden md:block">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
        <nav>
          <ul className="">
            <li>
              <Link to="/admin" className="flex items-center gap-2  p-3 rounded hover:bg-blue-700"><MdDashboard/>   Dashboard  </Link>
            </li>
            <li>
              <Link to="/admin/redcrossfamilies" className="flex items-center gap-2 p-3 rounded hover:bg-blue-700"><MdFamilyRestroom/>Families</Link>
            </li>
            <li>
  <Link 
    to="/admin/adminusers" 
    className="flex items-center gap-2 p-3 rounded hover:bg-blue-700"
  >
    <FaUserAlt />
    <span>Users</span>  
  </Link>
</li>


            {/* <li>
              <Link to="/admin/Redscrossactivies" className="flex items-center gap-2 p-3 rounded hover:bg-blue-700"><FaHandsHelping/>Activities</Link>
            </li> */}
            <li>
              <Link to="/admin/myfelowership" className="flex items-center gap-2 p-3 rounded hover:bg-blue-700">< FaUserFriends/>Fellowship</Link>
            </li>
            <li>
            <Link to="/admin/general" className="flex items-center gap-2 p-3 rounded hover:bg-blue-700"><FaHandsHelping/>All info</Link>

            </li>
            <li>
            <Link to="/confirm_membership" className="flex items-center gap-2 p-3 rounded hover:bg-blue-700"><FaHandsHelping/>All requested membership<span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">{allrequsted}</span></Link>

            </li>
            <li>
              <Link to="/admin/messages" className="flex items-center gap-2 p-3 rounded hover:bg-blue-700"><FaEnvelope/>Messages<span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">{allmessage}</span></Link>
            </li>
            <li>
              
              <Link to="/admin/announcement" className="flex items-center gap-2 p-3 rounded hover:bg-blue-700"><FaBullhorn/>Announcements</Link>
            </li>

            <li>
              <Link to="/subscibe_newslatter" className="flex items-center gap-2 p-3 rounded hover:bg-blue-700"><FaEnvelope/>All Subscription<span className="ml-2 bg-red-500 text-white rounded-full py-2 px-2 text-xs font-bold">{newlatter}</span></Link>
            </li>
            <li>
              <Link to="/" className="block p-3 rounded hover:bg-blue-700">Go to Site</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Sidebar with Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-4 fixed top-4 left-4 z-50 bg-blue-900 text-white rounded-md"
      >
        {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40" onClick={() => setIsOpen(false)}></div>
      )}

      <div
        className={`fixed top-0 left-0 w-64 h-full bg-blue-900 text-white p-5 shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
        <nav>
          <ul className="space-y-4">
            <li onClick={() => setIsOpen(false)}>
              <Link to="/admin" className="block p-3 rounded hover:bg-blue-700">Dashboard</Link>
            </li>
            <li onClick={() => setIsOpen(false)}>
              <Link to="/admin/redcrossfamilies" className="block p-3 rounded hover:bg-blue-700"><MdFamilyRestroom/>Families</Link>
            </li>
            <li onClick={() => setIsOpen(false)}>
              <Link to="/admin/adminusers" className="block p-3 rounded hover:bg-blue-700">  <FaUserAlt />Users</Link>
            </li>
            {/* <li onClick={() => setIsOpen(false)}>
              <Link to="/admin/Redscrossactivies" className="block p-3 rounded hover:bg-blue-700">Activities</Link>
            </li> */}
            <li onClick={() => setIsOpen(false)}>
              <Link to="/admin/myfelowership" className="flex items-center gap-2 p-3 rounded hover:bg-blue-700">< FaUserFriends/>Fellowship</Link>
            </li>
            <li onClick={() => setIsOpen(false)}>
              <Link to="/admin/general" className="flex items-center gap-2 p-3 rounded hover:bg-blue-700"><FaHandsHelping/>all info</Link>
            </li>
            <li onClick={() => setIsOpen(false)}  >
            <Link to="/confirm_membership" className="flex items-center gap-2 p-3 rounded hover:bg-blue-700"><FaHandsHelping/>All requested membership</Link>

            </li>
            <li onClick={() => setIsOpen(false)}>
                            <Link to="/admin/messages" className="flex items-center gap-2 p-3 rounded hover:bg-blue-700"><FaEnvelope/>Messages<span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">{allmessage}</span></Link>
            </li>
            <li onClick={() => setIsOpen(false)}>
              <Link to="/admin/announcement" className="block p-3 rounded hover:bg-blue-700"><FaBullhorn/>Announcements</Link>
            </li>

            <li>
              <Link to="/subscibe_newslatter"  onClick={()=>setIsOpen(false)} className="flex items-center gap-2 p-3 rounded hover:bg-blue-700"><FaEnvelope/>All Subscription<span className="ml-2 bg-red-500 text-white rounded-full py-1 text-xl font-bold">{newlatter}</span></Link>
            </li>
            <li onClick={() => setIsOpen(false)}>
              <Link to="/" className="block p-3 rounded hover:bg-blue-700">Go to Site</Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
