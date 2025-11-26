import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";

export default function Header({ isSidebarOpen, setIsSidebarOpen }) {
  const [gymPic, setGymPic] = useState(localStorage.getItem("gymPic"));

  // Live update whenever profile changes in Sidebar
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedPic = localStorage.getItem("gymPic");
      if (updatedPic !== gymPic) {
        setGymPic(updatedPic);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [gymPic]);

  return (
    <header className="w-full bg-white shadow-md border-b px-6 py-4 
                       flex items-center justify-between sticky top-0 z-10">

      {/* LEFT SECTION: Menu Button + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-200 transition"
        >
          <MenuIcon sx={{ fontSize: 28 }} />
        </button>

        <h1 className="text-2xl font-semibold tracking-wide text-gray-900">
          Dashboard
        </h1>
      </div>

      {/* RIGHT SECTION: Profile Image */}
      <img
        src={gymPic}
        className="w-11 h-11 rounded-full border border-gray-300 object-cover 
                   shadow-sm hover:scale-105 transition"
        alt="profile"
      />
    </header>
  );
}
