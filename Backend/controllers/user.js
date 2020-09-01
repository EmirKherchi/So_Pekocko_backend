const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
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
           message : "utilisateur existant",
          })
        );
    })
    .catch(
      (error) => res.status(500).json({ error }) // erreur serveur dans ce cas
    );
};
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          error: "Pas d'utilisateur existant",
        });
      }
      bcrypt
        .compare(req.body.password, user.password)

        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              error: "Mot de pass éronné",
            });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, ")A,wY@ewo_`xK.6", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) =>
          res.status(500).json({
            error,
          })
        );
    })
    .catch((error) =>
      res.status(500).json({
        error,
      })
    );
};
