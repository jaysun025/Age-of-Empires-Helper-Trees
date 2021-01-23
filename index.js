require('dotenv').config() // configure eviroment variables
const express = require('express')
const layouts = require('express-ejs-layouts')
const app = express()
const session = require('express-session')
const passport = require('./config/ppConfig.js')
const flash = require('connect-flash')
const isLoggedIn = require('./middlewear/isLoggedIn.js')
const axios = require('axios')

app.set('view engine', 'ejs')
app.use(layouts)

//body parser middlewear allows us to recieve form data in req.body 
app.use(express.urlencoded({extended: false}))


//session middlewear
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

// passport middlewear
app.use(passport.initialize())
app.use(passport.session())

// flash middlewear flash goes before sessions
app.use(flash())

// CUSTOM MIDDLEWEAR
app.use((req, res, next) => {
    res.locals.alerts = req.flash()
    res.locals.currentUser = req.user
    next() // move on to the next piece of middlewear
})

app.use('/auth', require('./controllers/auth.js'))

app.get('/', (req, res) => {
        res.render('home')
})

app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile')
})

app.get('/profile/civilization', (req, res) => {
    let civilizationUrl = 'https://age-of-empires-2-api.herokuapp.com/api/v1/civilization/1'
    axios.get(civilizationUrl)
    .then(data => {
        console.log(data)
    })
    .catch(error => {
        console.log(error)
    })
})

app.get('*', (req, res) => {
    res.render('404.ejs')
})


const server = app.listen(process.env.PORT, () => {
    console.log(`fireing off at port ${process.env.PORT}`)
})

module.exports = server