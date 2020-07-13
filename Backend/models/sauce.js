const mongoose = require("mongoose");

const sauce = mongoose.Schema({
    userID : { type:String, require: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainingredient: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: {type: Number, required: false, default:0},
    dislikes: {type: Number, required: false, default:0},
    usersliked: {type: [String], required: false},
    usersdisliked: {type: [String], required: false},
  });
  
  module.exports = mongoose.model("sauces", sauce);

 




