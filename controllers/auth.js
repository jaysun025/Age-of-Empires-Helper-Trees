const express = require('express')
const router = express.Router()
const db = require('../models')
const passport = require('../config/ppConfig.js')


router.get('/signup',  (req, res) => {
    res.render('auth/signup.ejs')
})

router.post('/signup',  (req, res) => {
    // find or create a new user!!!
    db.user.findOrCreate({
        where: {
            email: req.body.email
        },
        defaults: {
            name: req.body.name,
            password: req.body.password
        }
    })
    .then(([user, wasCreated]) => {
        if(wasCreated){
            passport.authenticate('local', {successRedirect: '/'})(req, res)
            res.send(`Created a new user profile for ${user.email}`)
        } else {
            console.log('An account with that email alread exists did you mean tolog in??')
            res.redirect('/auth/login')
        }
    })
})

router.get('/login',  (req, res) => {
    res.render('auth/login.ejs')
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth,login',
    successRedirect: '/' 
}))

router.get('/logout',  (req, res) => {
    res.send("this is our exit point")
})

module.exports = router