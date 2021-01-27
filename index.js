require('dotenv').config() // configure eviroment variables
const express = require('express')
const layouts = require('express-ejs-layouts')
const app = express()
const session = require('express-session')
const passport = require('./config/ppConfig.js')
const flash = require('connect-flash')
const isLoggedIn = require('./middlewear/isLoggedIn.js')
const axios = require('axios')
const { Template } = require('ejs')
const router = require('./controllers/auth.js')
const db = ('./models')



app.set('view engine', 'ejs')
app.use(layouts)

//body parser middlewear allows us to recieve form data in req.body 
app.use(express.urlencoded({ extended: false }))


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
    const civilizationUrl = 'https://age-of-empires-2-api.herokuapp.com/api/v1/civilizations'
    axios.get(civilizationUrl)
        .then(data => {
            let civData = data.data.civilizations
            // console.log(civData)
            res.render('profile', { civData: civData, currentUser: req.user })
        })
        .catch(error => {
            console.log(error)
        })
})

const technologyUrl = 'https://age-of-empires-2-api.herokuapp.com/api/v1/technologies'
const unitsUrl = 'https://age-of-empires-2-api.herokuapp.com/api/v1/units'

app.get('/civilization/:id', (req, res) => {
    let tech = () => {
        return axios.get(technologyUrl)
    }
    let unit = () => {
        return axios.get(unitsUrl)
    }
    Promise.all([tech(), unit()])
    .then(function (results) {
        const units = results[1].data.units
        const technology = results[0].data.technologies
        // res.send(results[0].data)
        res.render('techUnit', {unitData: units, techData: technology})
    })
        .catch(error => {
            console.log(error)
        })
})

app.get('/techUnit/:id', (req, res) => {
    axios.get(`https://age-of-empires-2-api.herokuapp.com/api/v1/unit/${req.params.id}`)
    axios.get(`https://age-of-empires-2-api.herokuapp.com/api/v1/technology/${req.params.id}`)
    .then(apiResponse => {
        let units = apiResponse.data
        let technology = apiResponse.data
        // console.log(units)
        res.render('description', {units: units, technology: technology})
    }).catch(error => {
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