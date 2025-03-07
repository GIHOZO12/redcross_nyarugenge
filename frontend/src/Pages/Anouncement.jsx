import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const  Announcements=()=> {
    const [details, setDetails] = useState([]);
    const [searchQuery,setSearchQuery]=useState("");
    useEffect(()=>{
      axios
      .get("https://gihozo.pythonanywhere.com//announcement_list/")
      .then((response)=>{
        setDetails(response.data)
      }).catch((error)=>{
        console.error("error fetching announcement data",error)
      })
    },[])
const handleSearchchange=(e)=>{
  setSearchQuery(e.target.value)
}

const filteredAnnouncements = details.filter((announce) => {
  return (
    announce.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announce.text.toLowerCase().includes(searchQuery.toLowerCase())
  );
});

    return (
      <div className="min-h-screen bg-gray-100 pt-16 px-6">
     
        <header className="text-center mb-8 mt-20">
          <form>
          <form className="flex items-center ">
          <input
            type="search"
             value={searchQuery}
             onChange={handleSearchchange}
          
            name="search"
            placeholder="Search Announcements"
            className="p-3 rounded-l-full border border-gray-300 focus:outline-none flex-grow"
          />
          <button
            type="submit"
            onSubmit={(e)=>e.preventDefault()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold p-3 rounded-r-full focus:outline-none"
          >
            Search
          </button>
        </form>
          </form>
          <div className="p-20">
          <h1 className="text-4xl font-bold text-red-500">Announcements</h1>
          <p className="text-gray-600 mt-2">
            Stay updated with the latest news and information.
          </p>
          </div>
        </header>

       
        <div className="flex flex-col items-center justify-center mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredAnnouncements.length > 0 ? (
    filteredAnnouncements.map((item, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-transform"
      >
        <div className="">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
         
          {item.title}
        </h2>
       
        </div>
        <p className="text-gray-600">
          {item.text}
        </p>
        <p><span className="text-gray-700 text-xl font-semibold">released time:</span>{item.created}</p>
      </motion.div>
    ))
  ) : (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="col-span-full text-center text-gray-500"
    >
      <p>No announcements available. "<strong>{searchQuery}</strong>"</p>
    </motion.div>
  )}
</div>

        </div>
      </div>
    );
  }


export default Announcements;
