import React, { useState } from "react";
import './signUp.css';
import Modal from "../modal/Modal";
import ForgotPassword from "../forgotPassword/ForgotPassword";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

//Material.ui
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';


export default function Signup() {

    const [InputField, setInputField] = useState({ gymName: "", email: "", userName: "", password: "", profilePic: "https://i.pinimg.com/474x/2b/53/0d/2b530d0302e87d964541b0765ec5f52b.jpg" })
    const [forgotPassword, setForgotPassword] = useState(false);
    const [loaderImage, setLoaderimage] = useState(false);

    const handleClose = () => {
        setForgotPassword(prev => !prev);
    }

    const handleOnchange = (event, name) => {
        setInputField({ ...InputField, [name]: event.target.value })
    }
    // console.log(InputField);

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


    const handleRegister = async () => {
        await axios.post("http://localhost:4000/auth/register", InputField).then((resp) => {
            // console.log(resp)
            const successMessage = resp.data.message;
            toast.success(successMessage);
        }).catch(err => {
            const errorMessage = err.response.data.error;
            // console.log(errorMessage);
            toast.error(errorMessage);
        })

    }


    return (
        <div className="customSignup w-1/3 p-10 mt-20 ml-20 bg-gray-50/45 h-[450px] overflow-auto">
            <div className="font-sand text-white text-center text-3x1 font-semibold ">Register your Gym</div>
            <input
                type="email" value={InputField.email} onChange={(event) => { handleOnchange(event, "email") }}
                className="w-full my-10 p-2 rounded-lg bg-white"
                placeholder="Enter Email"
            />

            <input
                type="text" value={InputField.gymName} onChange={(event) => { handleOnchange(event, "gymName") }}
                className="w-full mb-10 p-2 rounded-lg bg-white"
                placeholder="Enter Gym Name"
            />

            <input
                type="text" value={InputField.userName} onChange={(event) => { handleOnchange(event, "userName") }}
                className="w-full mb-10 p-2 rounded-lg bg-white"
                placeholder="Enter UserName"
            />

            <input
                type="Password" value={InputField.password} onChange={(event) => { handleOnchange(event, "password") }}
                className="w-full mb-10 p-2 rounded-lg bg-white"
                placeholder="Enter Password"
            />
            <input type="file" onChange={(e) => { uploadImage(e) }} className="w-full mb-10 p-2 rounded-lg bg-zinc-200" />

            {
                loaderImage && <Stack sx={{ width: '100%', color: 'grey.800' }} spacing={2}>
                    {/* <LinearProgress color="secondary" /> */}
                    {/* <LinearProgress color="success" /> */}
                    <LinearProgress color="inherit" />
                </Stack>

            }
            <img src={InputField.profilePic} className="mb-10 h-[200px] w-[200px] " />

            <div className="p-2 w-[100%] border-2 bg-zinc-800 mx-auto rounded-lg text-white text-center text-lg hover:bg-white hover:text-black font-semibold cursor-pointer" onClick={()=>handleRegister()}>Register</div>

            <div className="p-2 w-[100%] mt-5 border-2 bg-zinc-800 mx-auto rounded-lg text-white text-center text-lg hover:bg-white hover:text-black font-semibold cursor-pointer" onClick={() => handleClose()}>Forgot Password</div>

            {forgotPassword && <Modal header="Forgot Password" handleClose={handleClose} content={<ForgotPassword />} />}
            
            <ToastContainer />
        </div>
    )
}




