const express = require('express');

const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');



const sauceRouter = require('./routes/sauce');
const userRouter = require('./routes/user');

// Connect à la base de donnée
mongoose
  .connect("mongodb+srv://Emir:OcrStudent@cluster0.z9uvt.mongodb.net/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));


const app = express();
app.use(express.json());

// Permet CORS
app.use(cors());

// Désinfecte les données
app.use(mongoSanitize());

// Configure en-têtes HTTP
app.use(helmet());

// Empêche les attaques cross-site scripting (xss)
app.use(xss());

// Limite le nombre de requête
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
});
app.use(limiter);

// Empêche la pollution des paramètres http
app.use(hpp());

// Gestion des fichiers statiques
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRouter);
app.use('/api/sauces', sauceRouter);

module.exports = app;