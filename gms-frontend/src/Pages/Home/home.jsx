import React from "react";
// import Home from "./Home.css";
import Login from "../../components/login/Login";
import Signup from "../../components/signup/Signup";




export default function Home(){
    return(
        <div className="w-full h-[100vh] ">
            <div className="border-2 border-zinc-200 bg-zinc-200 text-black p-5 font-semibold text-x1"> 
                Yeah Buddy
            </div>
            <div className="Bgphoto">
                <div className="w-full lg:flex gap-39"> {/* when larg screen when we use lg this is use for responsivenes */}

                <Login />
                <Signup/>



                </div>
            </div>
        </div>
    )

}