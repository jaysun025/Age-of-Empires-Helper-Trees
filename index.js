require('dotenv').config() // configure eviroment variables
const express = require('express')
const layouts = require('express-ejs-layouts')
const app = express()
const session = require('express-session')
const passport = require('./config/ppConfig.js')
const flash = require('connect-flash')
const isLoggedIn = require('./middlewear/isLoggedIn.js')
const axios = require('axios')
const civilizationUrl = 'https://age-of-empires-2-api.herokuapp.com/api/v1/civilizations'
const technologyUrl = 'https://age-of-empires-2-api.herokuapp.com/api/v1/technologies'

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


app.get('/profile', (req, res) => {
    axios.get(civilizationUrl)
    .then(data => {
        let civData = data.data.civilizations
        console.log(civData)
       res.render('profile', {civData:civData, currentUser: req.user})
    })
    .catch(error => {
        console.log(error)
    })
})

app.get('/civilization', (req, res) => {
    axios.get(technologyUrl)
    .then(data => {
        let techData = data.data.technologies
        let civData = data.data.civilizations
        res.render('civilization', {techData:techData, currentUser: req.user})
    })
    .catch(error => {
        console.log(error)
    })
})

app.get('/techUnit', (req, res) => {
    axios.get(technologyUrl)
    .then(data => {
        let civData = data.data.civilizations
        res.render('techUnit', {civData:civData, currentUser: req.user})
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