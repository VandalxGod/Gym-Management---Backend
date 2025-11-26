// src/Pages/DashBoard/Dashboard.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "./Header";
import Footer from "./Footer";

import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import ErrorIcon from "@mui/icons-material/Error";
import PersonOffIcon from "@mui/icons-material/PersonOff";

import axios from "axios";
import { Link } from "react-router-dom";

/*
  Enhanced Dashboard.jsx
  - Uses your working endpoints to compute counts
  - Shows friendly loading state (no nulls)
  - Clean, professional styling
  - Cards kept functionally identical (only styling improved)
  - No changes to routing or existing logic
*/

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Stats
  const [totalMembers, setTotalMembers] = useState(null);
  const [activeMembers, setActiveMembers] = useState(null);
  const [expiredMembers, setExpiredMembers] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const handleOnClickMenu = (value) => {
    sessionStorage.setItem("func", value);
  };

  useEffect(() => {
    let mounted = true;
    async function fetchStats() {
      setLoadingStats(true);
      try {
        // 1) total members from your existing endpoint (returns totalMembers)
        const allResp = await axios.get(
          "http://localhost:4000/members/all-member?skip=0&limit=1",
          { withCredentials: true }
        );

        // 2) expired members list endpoint (count length)
        const expiredResp = await axios.get(
          "http://localhost:4000/members/expired-member",
          { withCredentials: true }
        );

        // 3) inactive or active endpoint (your earlier code used 'inactive-member')
        // We can use inactive-member endpoint and derive active = total - inactive - expired (if needed).
        const inactiveResp = await axios.get(
          "http://localhost:4000/members/inactive-member",
          { withCredentials: true }
        );

        // Defensive checks (in case backend returns different shapes)
        const total = allResp?.data?.totalMembers ?? (Array.isArray(allResp?.data?.members) ? allResp.data.members.length : null);
        const expiredCount = Array.isArray(expiredResp?.data?.members) ? expiredResp.data.members.length : (expiredResp?.data?.totalMembers ?? 0);
        const inactiveCount = Array.isArray(inactiveResp?.data?.members) ? inactiveResp.data.members.length : (inactiveResp?.data?.totalMembers ?? 0);

        // Compute active as total - inactive - expired (only if total is known)
        let activeCount = null;
        if (typeof total === "number") {
          activeCount = Math.max(0, total - inactiveCount - expiredCount);
        }

        if (mounted) {
          setTotalMembers(typeof total === "number" ? total : 0);
          setExpiredMembers(expiredCount);
          setActiveMembers(activeCount !== null ? activeCount : Math.max(0, (total ?? 0) - inactiveCount));
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        // fallback to zero to avoid nulls
        if (mounted) {
          setTotalMembers(0);
          setExpiredMembers(0);
          setActiveMembers(0);
        }
      } finally {
        if (mounted) setLoadingStats(false);
      }
    }

    fetchStats();
    return () => {
      mounted = false;
    };
  }, []);

  // small helper to show loading placeholder
  const renderStat = (value) => (loadingStats ? "—" : value ?? 0);

  return (
    <div className="flex h-screen w-full bg-[#f5f5f7]">
      {/* SIDEBAR */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-0"} overflow-hidden`}>
        <Sidebar />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        {/* TOP STATS (clean & professional row) */}
        <div className="px-8 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <TopStat
              label="Total Members"
              value={renderStat(totalMembers)}
              icon={<PeopleIcon sx={{ fontSize: 28, color: "#0f172a" }} />}
              tone="neutral"
            />

            <TopStat
              label="Active Members"
              value={renderStat(activeMembers)}
              icon={<PeopleIcon sx={{ fontSize: 28, color: "#065f46" }} />}
              tone="green"
            />

            <TopStat
              label="Expired Members"
              value={renderStat(expiredMembers)}
              icon={<ErrorIcon sx={{ fontSize: 28, color: "#b91c1c" }} />}
              tone="red"
            />

          </div>
        </div>

        {/* MAIN CARDS */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            <DashboardCard
              to="/Member"
              title="Joined Members"
              subtitle="All registered members"
              accent="bg-emerald-500/90"
              icon={<PeopleIcon sx={{ fontSize: 44, color: "white" }} />}
            />

            <DashboardCard
              to="/specific/monthly"
              onClick={() => handleOnClickMenu("monthlyJoined")}
              title="Monthly Joined"
              subtitle="Members who joined this month"
              accent="bg-sky-500/90"
              icon={<CalendarMonthIcon sx={{ fontSize: 44, color: "white" }} />}
            />

            <DashboardCard
              to="/specific/expire-with-in-3-days"
              onClick={() => handleOnClickMenu("threeDayExpire")}
              title="Expiring in 3 Days"
              subtitle="Memberships that expire soon"
              accent="bg-orange-500/95"
              icon={<AccessAlarmIcon sx={{ fontSize: 44, color: "white" }} />}
            />

            <DashboardCard
              to="/specific/expire-within-4-7-days"
              onClick={() => handleOnClickMenu("fourtoSevendayExpire")}
              title="Expiring 4–7 Days"
              subtitle="Upcoming expirations"
              accent="bg-yellow-500/95"
              icon={<MoreTimeIcon sx={{ fontSize: 44, color: "white" }} />}
            />

            <DashboardCard
              to="/specific/expired"
              onClick={() => handleOnClickMenu("Expired")}
              title="Expired"
              subtitle="Members with expired memberships"
              accent="bg-red-600/95"
              icon={<ErrorIcon sx={{ fontSize: 44, color: "white" }} />}
            />

            <DashboardCard
              to="/specific/inactive-members"
              onClick={() => handleOnClickMenu("InActiveMembers")}
              title="Inactive Members"
              subtitle="Members not active recently"
              accent="bg-purple-600/95"
              icon={<PersonOffIcon sx={{ fontSize: 44, color: "white" }} />}
            />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

/* ---------------- Top stat small tile ---------------- */
function TopStat({ label, value, icon, tone = "neutral" }) {
  const toneBg =
    tone === "green" ? "bg-emerald-50" : tone === "red" ? "bg-red-50" : "bg-white";
  const toneBorder =
    tone === "green" ? "border-emerald-100" : tone === "red" ? "border-red-100" : "border-gray-100";

  return (
    <div className={`flex items-center justify-between p-5 rounded-lg shadow-sm border ${toneBg} ${toneBorder}`}>
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
      </div>

      <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-white shadow">
        {icon}
      </div>
    </div>
  );
}

/* ---------------- Dashboard card (clean pro) ---------------- */
function DashboardCard({ to, onClick, title, subtitle, accent, icon }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
    >
      <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 ${accent}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </Link>
  );
}
