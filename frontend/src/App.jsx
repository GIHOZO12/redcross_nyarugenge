// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from "react"; 
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import Join from "./Components/Join";
import Anouncement from "./Pages/Anouncement";
import { AppContext } from "./AppContext/Appcontext";
import UnitFamily from "./Pages/Unit";
import Humanity_family from "./Pages/Humanity";
import Neutrality from "./Pages/Neutrality";
import Universality from "./Pages/universality";
import Partiality from "./Pages/Partiality";
import Activitiesadd from "./Pages/Activitiesadd";
import RedcrossAdmin from "./Pages/Admin/RedcrossAdmin";
import Adminuser from "./Pages/Admin/Adminuser";
import Adminactivities from "./Pages/Admin/Adminactivities";
import Getintouch from "./Components/Getintouch";
import AdminFellowership from "./Pages/Admin/AdminFellowership";
import AdminFamily from "./Pages/Admin/AdminFamily";
import Add_fellowership from "./Pages/Admin/Add_fellowership";
import All_fellowership from "./Pages/All_fellowership";
import All_Activities from "./Pages/All_Activities";
import Admin_announcement from "./Pages/Admin/Admin_announcement";
import Ideas from "./Pages/Ideas";
import Firstaidcourses from "./Pages/Firstaidcourses";
import FirstAidDetails from "./Pages/First_aid_details";
import Admin_courses from "./Pages/Admin/Admin_courses";
import AdminAddActivities from "./Pages/Admin/AdminAdd_activities";
import Viewprofile from "./Pages/Viewprofile";
import Edit_fellowership from "./Pages/Admin/Edit_fellowership";
import Add_anouncement from "./Pages/Admin/Add_anouncement";
import Edit_announcement from "./Pages/Admin/Edit_announcement";
import Edit_activities from "./Pages/Admin/Edit_activities";
import AdminMessage from "./Pages/Admin/AdminMessage";
import Subscribenewsletter from "./Pages/Admin/Subscribenewsletter";
import Payment from "./Components/Payment";
import Update_activity from "./Pages/Update_activity";
import Admin_general_info from "./Pages/Admin/Admin_courses";
import Confirmmbership from "./Pages/Admin/Confirmmbership";
import NotFound from "./Pages/Note_found";

// Loading Spinner Component
const Loadingspinner = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 z-50">
    <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
    <p className="text-lg font-semibold text-gray-800 animate-pulse">
      Welcome to <span className="text-blue-600">Nyarugenge Red Cross</span>
    </p>
  </div>
);

const App = () => {
  const { showlogin } = useContext(AppContext);
  const { showpayment } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // ✅ Page loading effect
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // ✅ Google Translate Integration
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.gtranslate.net/widgets/latest/float.js";
    script.async = true;
    document.body.appendChild(script);

    window.gtranslateSettings = {
      default_language: "en",
      languages: ["en", "fr", "it", "es"],
      wrapper_selector: ".gtranslate_wrapper",
      flag_style: "3d",
    };
  }, []);

  return (
    <div>
      {loading && <Loadingspinner />}

      {/* Google Translate Widget */}
      <div className="gtranslate_wrapper"></div>

      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/*" element={<RedcrossAdmin />} />
        <Route path="/admin/adminusers" element={<Adminuser />} />
        <Route path="/admin/Redscrossactivies" element={<Adminactivities />} />
        <Route path="/edit_activity/:id" element={<Edit_activities />} />
        <Route path="/admin/myfelowership" element={<AdminFellowership />} />
        <Route path="/admin/edit_fellowership/:id" element={<Edit_fellowership />} />
        <Route path="/admin/add_fellowership" element={<Add_fellowership />} />
        <Route path="/admin/redcrossfamilies" element={<AdminFamily />} />
        <Route path="/admin/announcement" element={<Admin_announcement />} />
        <Route path="/edit_announcement/:id" element={<Edit_announcement />} />
        <Route path="confirm_membership" element={<Confirmmbership />} />
        <Route path="/admin/addannouncement" element={<Add_anouncement />} />
        <Route path="/admin/general" element={<Admin_general_info />} />
        <Route path="/admin/addactivity" element={<AdminAddActivities />} />
        <Route path="/admin/messages" element={<AdminMessage />} />
        <Route path="/subscibe_newslatter" element={<Subscribenewsletter />} />

        {/* Non-Admin Routes */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              {showlogin && <Join />}
              {showpayment && <Payment />}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/update" element={<Anouncement />} />
                <Route path="/ideas" element={<Ideas />} />
                <Route path="/Viewprofile" element={<Viewprofile />} />
                <Route path="/payment" element={<Payment />} />
                
                <Route path="/Courses" element={<Firstaidcourses />} />
                <Route path="/families/unit" element={<UnitFamily />} />
                <Route path="/families/partiarity" element={<Partiality />} />
                <Route path="/families/Humanity" element={<Humanity_family />} />
                <Route path="/families/neutrality" element={<Neutrality />} />
                <Route path="/event/fellowership" element={<All_fellowership />} />
                <Route path="/event/allactivities" element={<All_Activities />} />
                <Route path="/families/universality" element={<Universality />} />

                <Route path="/addactivities/:familyName" element={<Activitiesadd />} />
                <Route path="/update_activity/:id" element={<Update_activity />} />
                <Route path="/course/first-aid-courses/:id" element={<FirstAidDetails />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Getintouch />
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
