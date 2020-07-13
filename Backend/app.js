const express = require("express"); // on importe express dans notre fichier app.js
const app = express(); // on appel la methode express dans la var app afin de crer l'application express.
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const sauces = require("./models/sauces");

const User = require("./models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // importation de json webtoken pour création envoi et reception des tokens

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

//Post

app.post("/api/auth/signup", (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10) // quoi hasher et combien de fois(10 ici) retourne une promise
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });

      user
        .save()
        .then(() =>
          res.status(201).json({
            message: "utilisateur enregistré",
          })
        )
        .catch((error) =>
          res.status(400).json({
            error,
          })
        );
    })
    .catch(
      (error) => res.status(500).json({ error }) // erreur serveur dans ce cas
    );
});

app.post("/api/auth/login", (req, res, next) => {
  User.findOne({ email: req.body.email }) // utilise l'adresse mail qui est unique et envoyée depuis le body du front pour vérifier et pour trouver le user dans la BDD
    .then((user) => {
      // on vérifie la response si oui ou non on récupère un user
      if (!user) {
        // si aucun user avec cet adresse email
        return res.status(401).json({
          error: "Pas d'utilisateur existant",
        });
      }
      bcrypt // si l'utilisateur est trouvé, nous utilison alors Bcrypt pour comparé les hash des mots de pass envoyé et ceux qu'on a en BDD
        .compare(req.body.password, user.password)
        //comparaison du mdp du body envoyé (req.body) avec le password de la base de donnée.
        .then((valid) => {
          // vérifie la validation
          if (!valid) {
            // si password non trouvé
            return res.status(401).json({
              error: "Mot de pass éronné",
            });
          }
          res.status(200).json({
            // si pasword ok ( et donc email aussi car sinon impossible d'être à cette étape), on renvoi un objet Json avec...
            userId: user._id, //renvoi l'userID
            token: jwt.sign(
              //Utilisation de la fonction SIGN de JWT pour envoyé un TOKEN dans la response
              { userId: user._id }, //first argument, // on créer un objet avec identifiant l'user id, on est donc sur que la requete vient bien de cet user ID
              "RANDOM_TOKEN_SECRET", //2nd argument, // clée secret pour l'encodage, ici un simple exemple en réalité longue clée alétatoire pour sécurisé l'encodage
              { expiresIn: "24h" } // thrid argument, // argument de configuration, notre TOKEN expire au bout de 24 h
            ),
          });
        })
        .catch((error) =>
          res.status(500).json({
            // erreur serveur car meme si pas bon mdp envoi une response
            error,
          })
        );
    })
    .catch((error) =>
      res.status(500).json({
        // erreur serveur car meme si pas user envoi une response
        error,
      })
    );
});

app.post("/api/sauces", (req, res, next) => {
  delete req.body._id; // Le champs _iD est supprimé du body qui sera envoyé car celui-ci est généré automatiquement par mongoDb

  const sauce = new sauces({
    ...req.body, //modèle rempli automatiquement à la manière dun prototype objet (title = this.title,...);
  });

  // on enregistre et renvoi une reponse.
  sauce
    .save()
    .then(() =>
      res.status(201).json({
        // reponse reçu si envoi OK
        message: "Sauce enregistré dans la base de donnée",
      })
    )
    .catch((error) =>
      res.status(400).json({
        error, //logerra l'erreur dans la console javascript
      })
    );
});

//GET

app.get("/api/sauces", (req, res, next) => {
 
  sauces
    .find()
    .then((sauces) => res.status(200).json(sauces)) // si statut de la request est 200 la reponse à cette requete est tous mes objets
    .catch((error) =>
      res.status(400).json({
        error, //logerra l'erreur dans la console javascript
      })
    );
});

app.get("/api/sauces/:id", (req, res, next) => {
  // :id dans l'adresse api précise que cette id est variable selon l'objet, celui-ci est défini mongoose
  sauces
    .findOne({ _id: req.params.id }) // on dit, touve moi cet objet qui a pour id celui présent dans l'url de l'api exemple http://localhost:4200/part-one/thing/5ed7702dd2db160cf7962b08
    .then((sauce) => res.status(200).json(sauce)) // si reponse ok id existe, renvoi l'objet (thing) et non les objets (things)
    .catch((error) => res.status(404).json({ error })); //logerra l'erreur dans la console javascript
});

module.exports = app; // on export notre app express pour qu'elle puisse être utilisée dans d'autre fichier js
