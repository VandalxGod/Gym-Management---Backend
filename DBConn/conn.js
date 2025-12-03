const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://sumittutu2506_db_user:hlH5fi48Ps0aFrEF@gym.vhgxlrb.mongodb.net/')
  .then(() => console.log('DB connection successful!'))
  .catch(err => {
    console.log(err)
  });

  //video 16 8:06