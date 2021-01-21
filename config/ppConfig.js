const passport = require('passport')
const db = require('../models')
const LocalStrategy = require('passport-local')

// ---------------------->SERIALIZATON SET UP<-----------------

// tell passport to seralize the user using
// the id by passing it in to the doneCallback
passport.serializeUser((user, doneCallback) => {
    console.log('serializing the user....')
    // check that everything is legit
    doneCallback(null, user.id)
})

// this tells passport how to deserialize the user now by looking
//it up in the database based on the id (which was stored in the session)
passport.deserializeUser((id, doneCallback) => {
    db.user.findByPk(id)
    .then(foundUser => {
        console.log('deserializing user....')
        doneCallback(null, foundUser)
    })
    .catch(err => {
        console.log('ERROR DESERIALIZING USER')
    })
})

// ---------------------->STRATEGY SET UP<-----------------

const findAndLogInUser = (email, password, doneCallback) => {
    // tell passport how to check that our user is legit
    db.user.findOne({
        where: {
            email: email // go check for use in database
        }})
        .then(async foundUser => {
            let match
            if(foundUser) {
                // check that the password is legit
                match = await foundUser.validPassword(password)
            }
             if(!foundUser || !match) { // there is something funky about the user
                console.log('PASSWORD WAS NOT VALIDATED I.E. MATCH WAS FALSE')
                return doneCallback(null, false)
             } else {
                 return doneCallback(null, foundUser)
             }
        })
        .catch(err => doneCallback(err))
}
// thing of done callback as a function that looks like this
//login (error, userToBeLoggedIn) {
    // do stuff
//}

// we provide 'null' fi there's no error, or 'false' if there's no user or
//if the password is invalid (like they did inteh passport-local docs)
const fieldsToCheck = {
    usernameField: 'email',
    passwordField: 'password'
}


// creating an istance of local strategy
// --> constructer arg 1:
// an object indicates how we're going to refer to the two fields
//we're checking (for ex. we're using email instead of username)
// --> constructor arg 2:
// a callback that is ready to receive the two fields we are checking
// as well as a doneCallBack

const strategy = new LocalStrategy(fieldsToCheck, findAndLogInUser)

passport.use(strategy)


module.exports = passport