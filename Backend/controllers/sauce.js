const Sauce = require("../models/Sauce");
const fs = require("fs");

// POST
exports.createOneSauce = async (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  try {
    await sauce.save();
    res.status(201).send({ message: "Objet créé !" });
  } catch (e) {
    res.status(500).send(e);
  }
};

// GET
exports.getAllSauces = async (req, res, next) => {
  try {
    const sauces = await Sauce.find();
    res.status(200).send(sauces);
  } catch (e) {
    res.status(500).send();
  }
};

// GET ONE
exports.getOneSauce = async (req, res) => {
  try {
    const sauce = await Sauce.findById(req.params.id);
    if (!sauce) {
      return res.status(404).send({ error: "Objet non trouvée" });
    }
    res.status(200).send(sauce);
  } catch (e) {
    res.status(500).send(e);
  }
};

// PUT Update
exports.updateSauce = async (req, res) => {
  try {
    const sauceObject = req.file
      ? {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };
    await Sauce.findOneAndUpdate(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    );
    res.status(200).send({ message: "Objet modifié !" });
  } catch (err) {
    res.status(500).send(err);
  }
};

// DELETE
exports.deleteSauce = async (req, res) => {
  try {
    const sauce = await Sauce.findOne({ _id: req.params.id });
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, async () => {
      await Sauce.deleteOne({ _id: req.params.id });
    });
    res.status(200).send({ message: "Objet supprimé !" });
  } catch (err) {
    res.status(500).send({ err });
  }
};

// POST Like or Dislike
exports.likeOrDislikeOneSauce = async (req, res) => {
  try {
    const sauce = await Sauce.findById(req.params.id);
    if (req.body.like === 1) {
      if (!sauce.usersLiked.includes(req.body.userId)) {
        await Sauce.updateOne(
          { _id: req.params.id },
          {
            $push: {
              //The $push operator appends a specified value to an array.
              usersLiked: req.body.userId,
            },
            $inc: {
              //The $inc operator increments a field by a specified value
              likes: 1,
            },
          }
        );
      }
      res.status(200).send(sauce);
    } else if (req.body.like === 0) {
      if (sauce.usersLiked.includes(req.body.userId)) {
        await Sauce.updateOne(
          { _id: req.params.id },
          {
            $pull: {
              //The $pull operator removes from an existing array all instances of a value
              usersLiked: req.body.userId,
            },
            $inc: {
              likes: -1,
            },
          }
        );
      } else if (sauce.usersDisliked.includes(req.body.userId)) {
        await Sauce.updateOne(
          { _id: req.params.id },
          {
            $pull: {
              usersDisliked: req.body.userId,
            },
            $inc: {
              dislikes: -1,
            },
          }
        );
      }
      res.status(200).send(sauce);
    } else if (req.body.like === -1) {
      if (!sauce.usersDisliked.includes(req.body.userId)) {
        await Sauce.updateOne(
          { _id: req.params.id },
          {
            $push: {
              usersDisliked: req.body.userId,
            },
            $inc: {
              dislikes: 1,
            },
          }
        );
      }
      res.status(200).send(sauce);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
