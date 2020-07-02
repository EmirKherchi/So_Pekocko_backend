const express = require("express"); // on importe express dans notre fichier app.js
const app = express(); // on appel la methode express dans la var app afin de crer l'application express.
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Mise en place de la base de donnée avec mongoose
mongoose
  .connect("mongodb+srv://Emir:OcrStudent@cluster0.z9uvt.mongodb.net/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// middleware spécifique qui permets l'ajout de headers pour eviter les ereurs CORS

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json()); // tout transformer en json grace à la methode prédéfini Json de bodyParser.

//GET

app.use("/api/sauces", (req, res, next) => {
  // res.json({
  //     message: "toutes les sauces",
  // })
  const sauces = [
    {
      _id: "oeihfzeoi",
      sauce: "name",
      imageUrl:
        "https://www.kimchi-passion.fr/228-thickbox_default/sauce-poisson-thailandaise-mae-krua-300ml.jpg",
      userId: "qsomihvqios",
    },
    {
      _id: "oeihfzeomoihi",
      title: "Mon deuxième objet",
      description: "Les infos de mon deuxième objet",
      imageUrl:
        "https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg",
      price: 2900,
      userId: "qsomihvqios",
    },
  ];
  res.status(200).json(sauces);
});

app.use("/api/sauces/:id", (req, res, next) => {
  res.status(200).json({
    message: "Sauce unique",
  });
});


//Post

app.use("api/auth/signup", (req, res, next) => {
  const signup = [
    {
      email: "ekherchi@live.fr",
      password: "1234",
    },
  ];
  res.status(200).json(signup);
});

module.exports = app; // on export notre app express pour qu'elle puisse être utilisée dans d'autre fichier js
