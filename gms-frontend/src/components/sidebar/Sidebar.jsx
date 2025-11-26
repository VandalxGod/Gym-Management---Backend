import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Icons
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";

// axios + toast
import axios from "axios";
import { toast } from "react-toastify";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [greeting, setGreeting] = useState("");
  const [profilePic, setProfilePic] = useState(localStorage.getItem("gymPic"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else if (hour < 21) setGreeting("Good Evening");
    else setGreeting("Good Night");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ⭐ Upload Image + Save Permanently in DB
  const uploadImage = async (event) => {
    setLoading(true);

    const data = new FormData();
    data.append("file", event.target.files[0]);
    data.append("upload_preset", "gym-management");

    try {
      // 1️⃣ Upload to Cloudinary
      const cloud = await axios.post(
        "https://api.cloudinary.com/v1_1/dgsfifvhy/image/upload",
        data
      );

      const imageUrl = cloud.data.secure_url;

      // 2️⃣ Update DB
      await axios.put(
        "http://localhost:4000/auth/update-profile-pic",
        { profilePic: imageUrl },
        { withCredentials: true }
      );

      // 3️⃣ Save Locally
      localStorage.setItem("gymPic", imageUrl);
      setProfilePic(imageUrl);

      toast.success("Profile Updated!");
    } catch (err) {
      console.log(err);
      toast.error("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { label: "Dashboard", to: "/dashboard", icon: <HomeIcon /> },
    { label: "Members", to: "/Member", icon: <GroupIcon /> },
  ];

  return (
    <aside
      className="
        h-screen w-64 flex flex-col
        bg-gradient-to-b from-black via-zinc-900 to-black
        border-r border-white/10 shadow-xl
        text-white p-6
        backdrop-blur-2xl
      "
    >
      {/* ===== TOP BRAND SECTION ===== */}
      <div className="flex flex-col items-center gap-4">
        {/* Gym Image */}
        <div className="relative group">
          <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={profilePic}
              className="w-full h-full object-cover"
              alt="Gym"
            />
          </div>

          <input
            type="file"
            id="uploadBtn"
            className="hidden"
            onChange={uploadImage}
          />

          <label
            htmlFor="uploadBtn"
            className="
              absolute -bottom-3 left-1/2 -translate-x-1/2
              bg-white text-black text-xs px-3 py-1 rounded-full 
              opacity-0 group-hover:opacity-100 transition-all shadow-md cursor-pointer
            "
          >
            {loading ? "..." : "Change"}
          </label>
        </div>

        {/* Gym Name */}
        <h1 className="text-2xl font-bold text-center tracking-wide">
          {localStorage.getItem("gymName")}
        </h1>

        {/* Greeting */}
        <p className="text-sm text-zinc-400">{greeting}</p>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10 my-6"></div>

      {/* ===== NAVIGATION ===== */}
      <nav className="flex flex-col gap-3">
        {navItems.map((item) => {
          const active = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all shadow-sm
                ${
                  active
                    ? "bg-white text-black shadow-xl font-semibold"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-lg tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* ===== LOGOUT BUTTON ===== */}
      <button
        onClick={handleLogout}
        className="
          flex items-center gap-3 w-full px-4 py-3 rounded-xl 
          bg-red-600 hover:bg-red-700 transition font-semibold shadow-lg
        "
      >
        <LogoutIcon />
        <span>Logout</span>
      </button>
    </aside>
  );
}
