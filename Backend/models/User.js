const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
 email:{type: String, required:true, unique: true, trim: true}, //ici unique: true pour eviter que l'utilisateur enregistre plusieurs comptes avec une seule adresse mail. 
 password:{type: String, required:true, minlength:8, trim:true}// trim true, for no white space
}); 

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user',userSchema);