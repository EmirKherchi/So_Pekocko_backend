const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const session = require('express-session')

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Connection à la base de données
mongoose
  .connect("mongodb+srv://Emir:OcrStudent@cluster0.z9uvt.mongodb.net/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));


const app = express();

//***/  apply to all requests /*** //

//toutes requetes en JSON
app.use(express.json()); 

// Permet CORS, npm dependance 
app.use(cors());

// The sanitize function will strip out any keys that start with '$' in the input
app.use(mongoSanitize());

// Setting various HTTP headers.
app.use(helmet());

// Empêche les attaques cross-site scripting (xss)
app.use(xss());

// Limite le nombre de requête pour eviter attaque DDoS(deni de service) // to limit repeated requests
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100 //limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Empêche la pollution des paramètres http eviter les paramètre de l'url vérifier
app.use(hpp());

// Emepeche la récupération d'informations d'identification dans les cookies 
app.set('trust proxy', 1) // trust first proxy

app.use(session({
  secret: 'keyboard', //nom et mdp générique
  name:'session',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

// Gestion des fichiers statiques images
app.use('/images', express.static(path.join(__dirname, 'images')));

//**Appel des routes sur les requetes auth et sauces**//

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;