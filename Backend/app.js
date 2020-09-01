const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

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

// Empêche la pollution des paramètres http
app.use(hpp());

// Gestion des fichiers statiques images
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;