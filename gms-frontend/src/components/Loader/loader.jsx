import React from "react"
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


export default function Loader() {
    return(
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 ">
            <Box>
                <CircularProgress size = "10rem" sx={{color: "white"}} />
            </Box>

        </div>
    )
}