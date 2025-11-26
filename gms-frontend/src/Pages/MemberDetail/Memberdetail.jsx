import React, { useState, useEffect } from "react";

//Switch
import Switch from 'react-switch';
//Material.ui
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';



export default function Memberdetail() {
    const [status, setStatus] = useState("Pending");
    const navigate = useNavigate(); //useNavigate help to keep details of pages //it store the direction of pages
    const [renew, setRenew] = useState(false);
    const [data, setData] = useState(null);
    const [membership, setMembership] = useState([]);

    const { id } = useParams(); //useParams help to get the id from the url
    const [planMember , setPlanMember] = useState("");


    useEffect(() => {
        fetchData();
        fetchMembership();
    }, [])

    const fetchMembership = async () => {
        axios.get("http://localhost:4000/plans/get-membership", { withCredentials: true }).then((response) => {
            setMembership(response.data.membership);
            setPlanMember(response.data.membership[0]._id);
        }).catch(err => {
            console.log(err);
            toast.error("Something Went Wrong")
        })
    }

    const fetchData = async () => {
        await axios.get(`http://localhost:4000/members/get-member/${id}`, { withCredentials: true }).then((response) => {
            console.log(response);
            setData(response.data.member);
            setStatus(response.data.member.status);
            toast.success(response.data.message)
        }).catch(err => {
            console.log(err);
            toast.error("Something Went Wrong")
        })
    }


    const handleSwitchBtn = async() => {
        let statuss = status === "Active" ? "Pending" : "Active";
        await axios.post(`http://localhost:4000/members/change-status/${id}`,{status:statuss}, {withCredentials: true}).then((response)=> {
            toast.success("Status Changed ")

        }).catch(err =>{
            console.log(err);
            toast.error("Something Went Wrong")
        })
        setStatus(statuss);
    }


    const isDateInPast = (inputDate) => {
        const today = new Date(); // Get today's date
        const givenDate = new Date(inputDate); // Convert the input date to a Date object
        return givenDate < today; // Check if the given date is in the past

    };


    const handleOnChangeSelect =(event) => {
        let value = event.target.value;
        setPlanMember(value);
    }
    // console.log(planMember);
    const handleRenewSaveBtn = async()=>{
        await axios.put(`http://localhost:4000/members/update-member-plan/${id}`,{membership:planMember},{withCredentials:true}).then((response)=>{
            setData(response.data.member);
            toast.success(response.data.message);
        }).catch(err => {
            console.log(err);
            toast.error("Something Went Wrong")
        })
    }

    return (

        <div className="w-3/4 text-black p-5">
            <div onClick={() => { navigate(-1) }} className="border-2 w-fit pl-1 pt-1 pb-1 pr-3 rounded-2xl cursor-pointer hover:bg-black hover:text-white">
                <ChevronLeftIcon />Back
            </div>

            <div className="mt-10 p-2">
                <div className="w-[100%] h-fit flex">
                    <div className="w-1/3 max-auto">
                        <img src={data?.profilePic} className="w-full mx-auto" />
                    </div>
                    <div className="w-2/3 mt-5 text-xl p-5">
                        <div className="mt-1 mb-2 text-2xl font-semibold">Name : {data?.name} </div>
                        <div className="mt-1 mb-2 text-2xl font-semibold">Moible : {data?.mobileNo}</div>
                        <div className="mt-1 mb-2 text-2xl font-semibold">Address : {data?.address}</div>
                        <div className="mt-1 mb-2 text-2xl font-semibold">Joined Date : {data?.createdAt ? data.createdAt.slice(0, 10).split('-').reverse().join('-') : 'N/A'}</div>

                        <div className="mt-1 mb-2 text-2xl font-semibold">Next Bill Date : {data?.nextBillDate.slice(0, 10).split('-').reverse().join('-')} </div>
                        <div className="mt-1 mb-2 flex gap-4 text-2xl font-semibold">Status : <Switch onColor="#6366F1" checked={status === "Active"} onChange={() => { handleSwitchBtn() }} /></div>


                        {
                            isDateInPast(data?.nextBillDate) && <div className={`mt-1 rounded-lg p-3 border-2 border-black text-center w-full md:w-1/2 cursor-pointer hover:bg-gradient-to-r from-zinc-500 via-zinc-200 to-zinc-500  hover:text-black ${renew && status === "Active" ? "bg-gradient-to-r from-zinc-500 via-zinc-200 to-zinc-500  hover:text-black" : null}`} onClick={() => { setRenew(prev => !prev) }}>Renew</div>
                        }


                        {
                            renew && status === "Active" ? (<div className="rounded-lg p-3 mt-5 h-fit bg-zinc-50 w-[100%]">
                                <div className="w-full">
                                    <div className="my-5">
                                        <div>MemberShip</div>
                                        <select value={planMember} onChange={handleOnChangeSelect} className="w-full border-2 p-2 rounded-lg">

                                            {
                                            membership.map((item, index) => {
                                                return (
                                                    <option value={item._id}>{item.months} Months Membership</option>
                                                );
                                            })
                                            }


                                        </select>
                                        <div className={`mt-1 rounded-lg p-3 border-2 border-white text-center w-1/2 mx-auto cursor-pointer hover:bg-gradient-to-r from-zinc-500 via-zinc-200 to-zinc-500  hover:text-black `}onClick={()=>{handleRenewSaveBtn()}}>Save</div>
                                    </div>
                                </div>
                            </div>) : null
                        }

                    </div>
                </div>

            </div>
            <ToastContainer />
        </div>
    )
}