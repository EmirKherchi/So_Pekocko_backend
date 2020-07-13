const mongoose = require("mongoose");

const sauce = mongoose.Schema({
    userID : { type:String, require: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainingredient: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, min: 1, max: 10, required: true },
    likes: { type: Number },
    dislikes: { type: Number},
    usersliked: { type: String},
    usersdisliked: { type: String},
  });
  
  module.exports = mongoose.model("sauces", sauce);

 




