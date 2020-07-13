const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/sauce");

//Import du middleware auth pour sécuriser les routes
const auth = require('../middleware/auth');
//Import du middleware multer pour la gestion des images
const multer = require('../middleware/multer-config');

router.post("/",auth, multer, sauceCtrl.createSauce);

router.put("/:id",auth, multer, sauceCtrl.updateSauce);

router.get("/",auth, sauceCtrl.getAllSauces);

router.get("/:id",auth, sauceCtrl.getOnesauce);

router.delete("/:id",auth, sauceCtrl.deleteOneSauce);

module.exports = router;
