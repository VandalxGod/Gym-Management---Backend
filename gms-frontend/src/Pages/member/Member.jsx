import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Layout
import Sidebar from "../../components/sidebar/Sidebar";
import MemberCard from "../../components/MemberCard/MemberCard";
import Modal from "../../components/modal/Modal";
import Addmembership from "../../components/Addmembership/Addmembership";
import AddMembers from "../../components/AddMembers/AddMembers";

// Icons
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SearchIcon from "@mui/icons-material/Search";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

// API + Toast
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function Member() {
  const [addMembership, setAddmembership] = useState(false);
  const [addMember, setAddmember] = useState(false);

  const [currentPage, setCurrentpage] = useState(1);
  const [startFrom, setStartFrom] = useState(0);
  const [endTo, setEndto] = useState(9);
  const [totalData, setTotalData] = useState(0);
  const [limit] = useState(9);

  const [isSearchModeOn, setIsSearchModeOn] = useState(false);
  const [noOfPage, setNoOfPage] = useState(0);
  const [data, setData] = useState([]);
  const [skip, setSkip] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Initial Fetch
  useEffect(() => {
    fetchData(0, limit);
  }, []);

  // Fetch Members
  const fetchData = async (skipValue, limits) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/members/all-member?skip=${skipValue}&limit=${limits}`,
        { withCredentials: true }
      );

      const total = response.data.totalMembers;
      setTotalData(total);
      setData(response.data.members);

      const pages =
        total % limit === 0 ? total / limit : Math.floor(total / limit) + 1;
      setNoOfPage(pages);

      const from = skipValue + 1;
      const to = Math.min(skipValue + limits, total);

      setStartFrom(from);
      setEndto(to);
    } catch (err) {
      toast.error("Technical Error");
      console.error(err);
    }
    setLoading(false);
  };

  // Prev page
  const handlePrev = () => {
    if (currentPage > 1) {
      let newPage = currentPage - 1;
      setCurrentpage(newPage);

      const newSkip = skip - limit;
      setSkip(newSkip);
      fetchData(newSkip, limit);
    }
  };

  // Next page
  const handleNext = () => {
    if (currentPage < noOfPage) {
      let newPage = currentPage + 1;
      setCurrentpage(newPage);

      const newSkip = skip + limit;
      setSkip(newSkip);
      fetchData(newSkip, limit);
    }
  };

  // Search
  const handleSearchData = async () => {
    if (!search.trim()) {
      if (isSearchModeOn) {
        setIsSearchModeOn(false);
        setSearch("");
        fetchData(0, limit);
        return;
      }
      return toast.error("Please Enter a search value");
    }

    setIsSearchModeOn(true);
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:4000/members/searched-member?searchTerm=${search}`,
        { withCredentials: true }
      );

      setData(response.data.members);
      setTotalData(response.data.totalMembers);

      setCurrentpage(1);
      setStartFrom(1);
      setEndto(response.data.members.length);
    } catch (err) {
      toast.error("Error occurred");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">

      {/* Sidebar FIXED (matching Dashboard) */}
      <div className="w-64 h-full">
        <Sidebar />
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 overflow-auto">

        {/* Top Header */}
        <div className="flex items-center justify-between mb-10">

          {/* Left Section */}
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-gray-500 hover:text-black transition"
            >
              <ChevronLeftIcon />
              Back
            </Link>

            <h1 className="text-4xl font-semibold text-gray-800 tracking-tight">
              Members
            </h1>
          </div>

          {/* Right Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAddmember(true)}
              className="bg-white border border-gray-300 px-5 py-2 rounded-xl shadow-sm hover:shadow transition flex items-center gap-2"
            >
              <AddIcon className="text-gray-600" />
              <span className="text-gray-700 font-medium">Add Member</span>
            </button>

            <button
              onClick={() => setAddmembership(true)}
              className="bg-black text-white px-5 py-2 rounded-xl shadow-md hover:opacity-90 transition flex items-center gap-2"
            >
              <FitnessCenterIcon />
              Membership
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 w-full md:w-1/2 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-black focus:outline-none"
            placeholder="Search by name or mobile number"
          />
          <button
            onClick={handleSearchData}
            className="p-3 bg-black text-white rounded-xl hover:opacity-90 transition shadow-sm"
          >
            <SearchIcon />
          </button>
        </div>

        {/* Pagination / Count */}
        <div className="flex justify-between items-center text-gray-500 text-sm mb-4">
          <div>Total Members: {totalData}</div>

          {!isSearchModeOn && (
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border ${
                  currentPage === 1
                    ? "border-gray-200 text-gray-300"
                    : "hover:bg-black hover:text-white border-gray-300"
                } transition`}
              >
                <ArrowLeftIcon />
              </button>

              <span className="px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm">
                Page {currentPage} / {noOfPage || 1}
              </span>

              <button
                onClick={handleNext}
                disabled={currentPage === noOfPage}
                className={`p-2 rounded-lg border ${
                  currentPage === noOfPage
                    ? "border-gray-200 text-gray-300"
                    : "hover:bg-black hover:text-white border-gray-300"
                } transition`}
              >
                <ArrowRightIcon />
              </button>
            </div>
          )}
        </div>

        {/* Member Cards */}
        <div className="bg-white rounded-2xl shadow-sm p-8 min-h-[60vh]">
          {loading ? (
            <div className="text-center text-gray-500 py-20">Loading…</div>
          ) : data.length === 0 ? (
            <div className="text-center text-gray-500 py-20">No Members Found</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.map((member) => (
                <MemberCard key={member._id} item={member} />
              ))}
            </div>
          )}
        </div>

        {/* Modals */}
        {addMember && (
          <Modal
            header="Add New Member"
            handleClose={() => setAddmember(false)}
            content={<AddMembers />}
          />
        )}

        {addMembership && (
          <Modal
            header="Add Membership"
            handleClose={() => setAddmembership(false)}
            content={<Addmembership />}
          />
        )}

        <ToastContainer />
      </main>
    </div>
  );
}
