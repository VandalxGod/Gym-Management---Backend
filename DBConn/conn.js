const mongoose = require("mongoose");
require("dotenv").config();


mongoose.connect(process.env.atlas_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected Successfully!"))
.catch((err) => console.error("MongoDB Connection Failed:", err));

  //video 16 8:06;lkawdf;k