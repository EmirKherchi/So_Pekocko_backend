const Sauce = require('../models/Sauce');
const fs = require('fs');

// @desc Crée nouvelle sauce
// @route POST /api/sauces
// @access Privée
exports.createSauce = async (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    try {
        await sauce.save();
        res.status(201).send({ message: "Objet créé !" })
    } catch (e) {
        res.status(500).send(e)
    }
}

// @desc Récupère toutes les sauces
// @route GET /api/sauces
// @access Privée
exports.getSauces = async (req, res, next) => {
    try {
        const sauces = await Sauce.find();
        res.status(200).send(sauces)
    } catch (e) {
        res.status(500).send()
    }
}

// @desc Récupère une sauce
// @route GET /api/sauces/:id
// @access Privée
exports.getSauce = async (req, res) => {
    try {
        const sauce = await Sauce.findById(req.params.id)
        if (!sauce) {
            return res.status(404).send({ error: "Objet non trouvée"})
        }
        res.status(200).send(sauce)
    } catch (e) {
        res.status(500).send(e)
    }
}

// @desc Modifie une sauce
// @route PUT /api/sauces/:id
// @access Privée
exports.updateSauce = async (req, res) => {
    try {
        const sauceObject = req.file ?
        {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body};      
        await Sauce.findOneAndUpdate({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        res.status(200).send({ message: 'Objet modifié !'})        
    } catch(err) {
        res.status(500).send(err);   
    }
}

// @desc Supprime une sauce
// @route DELETE /api/sauces/:id
// @access Privée
exports.deleteSauce = async (req, res) => {
    try {
        const sauce = await Sauce.findOne({ _id: req.params.id })
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, async () => {
            await Sauce.deleteOne({ _id: req.params.id })   
        })
        res.status(200).send({ message: 'Objet supprimé !'})
    } catch (err) {
        res.status(500).send({ err });
    }
}

// @desc Ajoute opinion pour la sauce
// @route POST /api/sauces/:id
// @access Privée
exports.likeOrDislike = async (req, res) => {
    try {
        const sauce = await Sauce.findById(req.params.id)
        if (req.body.like === 1) { 
            if( !sauce.usersLiked.includes(req.body.userId)) {
                await Sauce.updateOne({ _id: req.params.id }, {
                        $push: {
                            usersLiked: req.body.userId
                        }, 
                        $inc: { 
                            likes: 1 }} )                    
            } 
        res.status(200).send(sauce)
        } else if (req.body.like === 0) {
            if ( sauce.usersLiked.includes(req.body.userId)) {
                await Sauce.updateOne({ _id: req.params.id }, {
                        $pull: {
                            usersLiked: req.body.userId
                        }, 
                        $inc: { 
                            likes: -1 }} )       
            } else if ( sauce.usersDisliked.includes(req.body.userId)) {
                await Sauce.updateOne({ _id: req.params.id }, {
                        $pull: {
                            usersDisliked: req.body.userId
                        }, 
                        $inc: { 
                            dislikes: -1 }} )       
            }
        res.status(200).send(sauce) 
        } else if (req.body.like === -1) {
            if( !sauce.usersDisliked.includes(req.body.userId)) {
                await Sauce.updateOne({ _id: req.params.id }, {
                        $push: {
                            usersDisliked: req.body.userId
                        }, 
                        $inc: { 
                            dislikes: 1 }} )             
            }
        res.status(200).send(sauce)
        }
    } catch (err) {
        res.status(500).send(err)
    }
}