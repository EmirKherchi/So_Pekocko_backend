const express = require("express"); // on importe express dans notre fichier app.js
const app = express(); // on appel la methode express dans la var app afin de crer l'application express.

app.use((req,res,next)=>{
    res.json({
        message: "First Json response mother fucker !",
    })
})

module.exports = app; // on export notre app express pour qu'elle puisse être utilisée dans d'autre fichier js
