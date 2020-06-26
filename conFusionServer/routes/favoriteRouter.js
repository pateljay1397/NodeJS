const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
var mongoose = require('mongoose');
const cors = require('./cors');
const Favorites = require('../models/favorites');
const { response } = require('express');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({ user: req.user._id }, (err) => { if (err) { console.log("It's borked. find() failed.") } })
            .then((favorite) => {
                // If there's no favorite document with current users ID, 
                // create one and iterate through req.body to push submitted 
                // favorite dishes into this users favorite list / array. 
                if (favorite.length == 0) {
                    Favorites.create({ user: req.user._id })
                        .then((favorite) => {
                            for (let i = 0; i < req.body.length; i++) {
                                favorite.dishes.push(req.body[i])
                            }
                            favorite.save()
                                .then((response) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(response);
                                })
                        })
                }
                else {
                    // I know this is a mess but I was getting hung up on 
                    // mongoose typing issues because I started out with the
                    // wrong type in my model. Since this is just a course assignment,
                    // I'm not gonna worry too much about it. Strings are fine. 
                    let reqArray = [];
                    let reqArrayFixed = [];
                    for (let i = 0; i < req.body.length; i++) {
                        reqArray.push(Object.values(req.body[i]))
                    }
                    for (let i = 0; i < reqArray.length; i++) {
                        reqArrayFixed.push(reqArray[i][0])
                    }
                    let favArray = [];
                    for (let i = 0; i < favorite[0].dishes.length; i++) {
                        favArray.push(JSON.stringify((favorite[0].dishes[i])))
                    }

                    for (let i = 0; i < reqArrayFixed.length; i++) {
                        if (favArray.includes(reqArrayFixed[i])) {
                            console.log("Skipping as it's already a favorite.");
                        }
                        else {
                            console.log(reqArrayFixed[i])
                            favorite[0].dishes.push(reqArrayFixed[i])
                        }
                    }
                    favorite[0].save()
                        .then((response) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(response);
                        })
                }
            })
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.deleteMany({ user: req.user._id }, (err) => { if (err) { console.log("It's borked. find() failed. " + err) } })
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            }, (err) => next(err));
    })

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req,res,next) => {
        Favorites.findOne({user: req.user._id})
        .then((favorites) => {
            if (!favorites) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({"exists": false, "favorites": favorites});
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({"exists": true, "favorites": favorites});
                }
            }
    
        }, (err) => next(err))
        .catch((err) => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id }, (err, favorite) => {
            if (err) { return next(err); }
            if (favorite == null) {
                Favorites.create({ user: req.user._id })
                    .then((favorite) => {
                        favorite.dishes.push(req.params.dishId);
                        favorite.save()
                            .then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            });
                    }, (err) => next(err))
                    .catch((err) => next(err));
            } else {
                if (favorite.dishes.indexOf(req.params.dishId) < 0) {
                    favorite.dishes.push(req.params.dishId);
                    favorite.save()
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        });
                } else {
                    res.statusCode = 200;
                    res.end("Already added");
                }
            }
        });
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("Not supported!");
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id }, (err, favorite) => {
            if (err) {
                return next(err);
            }
            if (favorite == null) {
                res.statusCode = 200;
                res.end("Favorites is already empty");
            }
            var index = favorite.dishes.indexOf(req.params.dishId);
            if (index > -1) {
                favorite.dishes.splice(index, 1);
                favorite.save()
                    .then((resp) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(resp);
                    }, (err) => next(err))
                    .catch((err) => next(err));
            }
        });
    });
module.exports = favoriteRouter;