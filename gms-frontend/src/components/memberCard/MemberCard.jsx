import React from "react";
//Material.ui
import CircleIcon from '@mui/icons-material/Circle';
import { Link } from "react-router-dom";

export default function MemberCard({item}) {
    return (
        
        <Link to={`/member/${item?._id}`} className="bg-white rounded-lg p-1 hover:bg-zinc-900 hover:text-white cursor-pointer">
            <div className="w-28 h-28 flex justify-center relative items-center border-2 p-1 mx-auto rounded-full">
                <img className="w-full h-full rounded-full" src={item?.profilePic} alt="profile pic" />
                <CircleIcon className="absolute top-0 left-0" sx={{ color: item?.status==="Active"?"greenyellow":"red" }} />
            </div>
            <div className="mx-auto mt-5 text-center text-x1 font-semibold font-mono">
                {item?.name}
            </div>
            <div className="mx-auto mt-2 text-center text-xl font-mono">
                {"+91 " + item?.mobileNo}
            </div>
            <div className="mx-auto mt-2 text-center text-xl font-mono">
                Next Bill Date: {item?.nextBillDate?.slice(0, 10).split("-").reverse().join("-")}
            </div>
        </Link>
    )
}