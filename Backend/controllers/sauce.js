const sauces = require("../models/sauce");

// const multer = require('./middleware/multer-config'); //on importe multer
const fs = require('fs');


exports.createSauce = (req, res, next) => {
    const sauceObjet = JSON.parse(req.body.sauce);
    const sauce = new sauces({
      ...sauceObjet,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce
      .save()
      .then((sauce) => {
        res.status(201).json({ sauce });
      })
      .catch((error) => {
        res.status(400).json({
          error: error,
        });
      });
  }

exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    if (req.file) {
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
              .then(() => { res.status(200).json({ message: 'Sauce mise à jour!' }); })
              .catch((error) => { res.status(400).json({ error }); });
          })
        })
        .catch((error) => { res.status(500).json({ error }); });
  
    } else {
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce mise à jour!' }))
        .catch((error) => res.status(400).json({ error }));
    }
  }

exports.getAllSauces = (req, res, next) => {
  sauces
    .find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
};

exports.getOnesauce = (req, res, next) => {
  sauces
    .findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.deleteOneSauce = (req, res, next) => {
    sauces.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          sauces.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };