import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import {toast,ToastContainer} from 'react-toastify';


export default function Login() {
    const[loginField,setLoginField] = useState({"userName":"","password":""});


    const navigate = useNavigate();

    const handleLogin = async() => {
        // sessionStorage.setItem("isLogin", "true");
        // navigate('/dashboard'); 

        await axios.post("http://localhost:4000/auth/login",loginField,{withCredentials:true}).then((response)=>{
            console.log(response.data);
            localStorage.setItem('gymName',response.data.gym.gymName);
            localStorage.setItem('gymPic',response.data.gym.profilePic);
        
            localStorage.setItem('isLogin',true);
            localStorage.setItem('token',response.data.token);

            navigate('/dashboard'); 

        }).catch(err=>{
            const errorMessage = err.response.data.error;
            // console.log(errorMessage);
            toast.error(errorMessage);
        })

    };

    const handleOnChange = (event,name)=>{
        setLoginField({...loginField,[name]:event.target.value});
    }
    // console.log(loginField)
    return (

        <div className="w-1/3 p-10 mt-20 ml-20 bg-gray-50/45 h-fit">
            <div className="font-sand text-white text-center text-3x1 font-semibold " onClick={() => { handleLogin() }}>Login</div>
            <input
    type="text"
    value={loginField.userName}
    onChange={(event)=> handleOnChange(event,"userName")}
    className="w-full my-10 p-2 rounded-lg bg-white"
    placeholder="Enter UserName"
/>

<input
    type="password"
    value={loginField.password}
    onChange={(event)=> handleOnChange(event,"password")}
    className="w-full mb-10 p-2 rounded-lg bg-white"
    placeholder="Enter Password"
/>

            <div className="p-2 w-[100%] border-2 bg-zinc-800 mx-auto rounded-lg text-white text-center text-lg hover:bg-white hover:text-black font-semibold cursor-pointer" onClick={()=>{handleLogin()}}>Login</div>
            <ToastContainer />
        </div>
    )
}