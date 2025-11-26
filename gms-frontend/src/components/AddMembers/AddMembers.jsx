import React, { useState, useEffect } from "react";
import axios from 'axios';

//Material.ui
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

import { toast, ToastContainer } from 'react-toastify';

export default function AddMembers() {

    const [InputField, setInputField] = useState({ name: "", mobileNo: "", address: "", membership: "", profilePic: "https://openclipart.org/image/800px/247320", joiningDate: "" });
    const [loaderImage, setLoaderimage] = useState(false);
    const [membershipList, setMembershipList] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");




    const handleOnChange = (event, name) => {
        setInputField({ ...InputField, [name]: event.target.value })
    }
    console.log(InputField);

    const uploadImage = async (event) => {
        setLoaderimage(true);
        console.log("Image uploading");
        const files = event.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'gym-management'); // underscore _ here

        try {
            const response = await axios.post("https://api.cloudinary.com/v1_1/dgsfifvhy/image/upload", data);
            console.log(response);
            const imageUrl = response.data.url;
            setInputField({ ...InputField, ['profilePic']: imageUrl });
            setLoaderimage(false);

        }
        catch (err) {
            console.log(err);
            alert("Image upload failed");
            setLoaderimage(false);
        }
    }

    const fetchMembership = async () => {
        await axios.get("http://localhost:4000/plans/get-membership", { withCredentials: true }).then((response) => {


            setMembershipList(response.data.membership);
            if (response.data.membership.length === 0) {
                return toast.error("No any Membership added yet", {
                    className: "text-lg"

                })
            } else {
                let a = response.data.membership[0]._id;
                setSelectedOption(a);
                setInputField({ ...InputField,membership: a });
            }
        }).catch(err => {
            console.log(err);
            toast.error("Something went wrong")

        })

    }
    useEffect(() => {
        console.log(InputField)
        fetchMembership();
    }, [])

    const handleOnChangeSelect = (event) => {
        let value = event.target.value;
        setSelectedOption(value);
        setInputField({ ...InputField, membership: value });
    };


    const handleRegisterButton = async () => {
        await axios.post("http://localhost:4000/members/register-member", InputField, { withCredentials: true }).then((res) => {
            toast.success("Added Successfully");
            setTimeout(() => {
                window.location.reload();
            }, 2000)

        }).catch(err => {
            console.log(err);
            toast.error("Something went wrong")
        })
    }

    return (
        <div className="text-black">
            <div className="grid gap-5 grid-cols-2 text-lg">
                <input value={InputField.name} onChange={(event) => { handleOnChange(event, "name") }} className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-black rounded-md h-12" type='text' placeholder="Name of the Joinee" />

                <input value={InputField.mobileNo} onChange={(event) => { handleOnChange(event, "mobileNo") }} className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-black rounded-md h-12" type='text' placeholder="Mobile no" />

                <input value={InputField.address} onChange={(event) => { handleOnChange(event, "address") }} className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-black rounded-md h-12" type='text' placeholder="Enter Address" />

                <input value={InputField.joiningDate}  onChange={(event) => { handleOnChange(event, "joiningDate") }} className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-black rounded-md h-12" type='date' />

                <select value={selectedOption}  onChange={handleOnChangeSelect} className="border-2 w-[90%] h-12 pt-2 pb-2 border-black rounded-md placeholder:text-gray">
                    {
                        membershipList.map((item, index) => {
                            return (
                                <option key={index} value={item._id} >{item.months} Months Membership</option>
                            );
                        })
                    }
                </select>

                <input type="file" onChange={(e) => { uploadImage(e) }} className="border-2 bg-zinc-200 rounded-md w-[90%] pt-2 pb-2 pr-3 pl-3 " />

                <div className="w-[100px] h-[100px]">
                    <img src={InputField.profilePic} className="border-2 w-full h-full rounded-full" />

                    {
                        loaderImage && <Stack sx={{ width: '100%', color: 'black' }} spacing={2}>
                            {/* <LinearProgress color="secondary" /> */}
                            {/* <LinearProgress color="success" /> */}
                            <LinearProgress color="inherit" />
                        </Stack>

                    }

                </div>

                <div onClick={() => handleRegisterButton()} className="p-3 border-2 w-28 text-lg h-14 text-center bg-black text-white rounded-xl cursor-pointer hover:bg-white hover:text-black">Register</div>
            </div>
            <ToastContainer />
        </div>
    )
}