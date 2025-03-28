import React from "react";
import { useState,useEffect } from "react";

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // This useEffect isn't strictly necessary since the year changes only once per year,
  // but it's included in case you want to update it dynamically
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className="bg-black relative">
      <hr className="border-white" />
      <div className="p-4">
        <p className="text-center text-white">
          &copy; {currentYear} Copyright || All rights reserved, designed by{" "}
          <span className="font-bold text-blue-700 hover:text-blue-500">
            <a href="https://gihozo12.github.io/my_portofolio/">IsmailG</a>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Footer;