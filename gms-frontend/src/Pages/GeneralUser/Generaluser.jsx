import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import MemberCard from "../../components/MemberCard/MemberCard";

import {
    getMonthlyJoined,
    threeDayExpire,
    fourToSevenExpire,
    getExpiredMembers,
    getInactiveMembers
} from "./Data";

export default function GeneralUser() {

    const [header, setHeader] = useState("");
    const [data, setData] = useState([]);

    useEffect(() => {
        const func = sessionStorage.getItem("func");
        loadData(func);
    }, []);

    const loadData = async (func) => {
        let response;

        switch (func) {

            case "monthlyJoined":
                setHeader("Monthly Joined Members");
                response = await getMonthlyJoined();
                break;

            case "threeDayExpire":
                setHeader("Members Expiring in 3 Days");
                response = await threeDayExpire();
                break;

            case "fourtoSevendayExpire":
                setHeader("Members Expiring in 4–7 Days");
                response = await fourToSevenExpire();
                break;

            case "Expired":
                setHeader("Expired Members");
                response = await getExpiredMembers();
                break;

            case "InActiveMembers":
                setHeader("Inactive Members");
                response = await getInactiveMembers();
                break;

            default:
                setHeader("Members");
                response = { members: [] };
        }

        setData(response.members || []);
    };

    return (
        <div className="flex-1 h-screen overflow-auto p-10 bg-gray-50">

            <div className="flex items-center justify-between mb-8">
                <Link
                    to="/dashboard"
                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl 
                               border shadow-sm text-gray-600 hover:text-black transition"
                >
                    <ChevronLeftIcon /> Back
                </Link>

                <h1 className="text-3xl font-semibold text-gray-800">{header}</h1>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm min-h-[65vh]">
                {data.length === 0 ? (
                    <p className="text-gray-500 text-center py-20 text-lg">
                        No Members Found
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data.map((member) => (
                            <MemberCard key={member._id} item={member} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
