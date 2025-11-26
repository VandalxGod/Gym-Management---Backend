import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";


export default function Addmembership({handleClose}) {
    const [InputField, setInputField] = useState({ months: "", price: "" });
    const [membership, setMembership] = useState([]);

    const handleOnChange = (event, name) => {
        setInputField({ ...InputField, [name]: event.target.value })
    }

    const fetchMembership = async () => {
        await axios.get("http://localhost:4000/plans/get-membership", { withCredentials: true }).then((res) => {
            console.log(res)
            setMembership(res.data.membership);
            toast.success(res.data.membership.length + "Membership Fetched")
        }).catch(err => {
            console.log(err);
            toast.error("Somoething went wrong");

        })
    }

    useEffect(() => {
        fetchMembership()
    }, [])


    const handleAddmembership = async ()=>{
        await axios.post("http://localhost:4000/plans/add-membership",InputField, { withCredentials: true }).then((res) => {
            // console.log(res)
            toast.success(res.data.message);
            handleClose();
            // setMembership(res.data.membership);
            // toast.success("Membership Added")
        }).catch(err => {
            console.log(err);
            toast.error("Somoething went wrong");

        })
    }



    // console.log(InputField);
    return (

        <div className="text-black">
            <div className="flex flex-wrap gap-5 items-center justify-center">

                {
                    membership.map((item, index) => {
                        return (
                            <div className="text-lg bg-zinc-900 text-white border-2 pl-2 pr-2 flex-col gap-3 justify-between pt-1 p-b-1 rounded-xl font-semibold hover:bg-white hover:text-black">
                                <div>{item.months} Months Membership</div>
                                <div>Rs {item.price}</div>

                            </div>
                        )
                    })
                }


            </div>


            <hr className="mt-10 mb-10" />
            <div className="flex gap-10 mb-10">
                <input value={InputField.months} onChange={(event) => { handleOnChange(event, "months") }} className="border-2 rounded-lg text-lg w-1/3 h-1/2 p-2" type='number' placeholder="Add No. of Months" />

                <input value={InputField.price} onChange={(event) => { handleOnChange(event, "price") }} className="border-2 rounded-lg text-lg w-1/3 h-1/2 p-2" type='number' placeholder="Add Price" />
                <div onClick={()=>{handleAddmembership()}} className="text-lg border-2  bg-black text-white p-1 w-auto mt-0 rounded-xl cursor-pointer hover:bg-white hover:text-black">Add +</div>


            </div>
            <ToastContainer />
        </div>
    )
}