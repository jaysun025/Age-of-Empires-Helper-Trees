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


// app.get('/profile', (req, res) => {
//     const civilizationUrl = 'https://age-of-empires-2-api.herokuapp.com/api/v1/civilizations'
//     axios.get(civilizationUrl)
//         .then(data => {
//             let civData = data.data.civilizations
//             let unitData = data.data.units
//             console.log(civData)
//             res.render('profile', { civData: civData, currentUser: req.user })
//         })
//         .catch(error => {
//             console.log(error)
//         })
// })

// app.get('/civilization/:id', (req, res) => {
//     const technologyUrl = 'https://age-of-empires-2-api.herokuapp.com/api/v1/technologies'
//     axios.get(technologyUrl)
//         .then(data => {
//             let techData = data.data.technologies
//             let civData = data.data.civilizations
//             console.log(techData)
//             res.render('civilization', { techData: techData, currentUser: req.user })
//         })
//         .catch(error => {
//             console.log(error)
//         })
// })

// app.get('/techunit', (req, res) => {
//     const unitsUrl = 'https://age-of-empires-2-api.herokuapp.com/api/v1/units'
//     axios.get(unitsUrl)
//         .then(data => {
//             let civData = data.data.civilizations
//             let techData = data.data.technnologies
//             let unitData = data.data.units
//             res.render('techunit', { unitData: unitData, currentUser: req.user })
//         })
//         .catch(error => {
//             console.log(error)
//         })
// })

app.get('/profile', (req, res) => {
    const civilizationUrl = 'https://age-of-empires-2-api.herokuapp.com/api/v1/civilizations'
    const unitsUrl = 'https://age-of-empires-2-api.herokuapp.com/api/v1/units'
    const technologyUrl = 'https://age-of-empires-2-api.herokuapp.com/api/v1/technologies'
    axios.all(civilizationUrl, unitsUrl, technologyUrl)
    .then(axios.spread((data => {
        let civData = data.data.civilizations
        let unitData = data.data.unit
        let techData = data.data.technology
        console.log(civData)
        res.render('profile', { civData: civData, unitData:unitData, techData: techData,  currentUser: req.user })
    })))
    // .then
    // axios.get(unitsUrl)
    // .then(info => {
    //     let unitData = info.data.units
    //     console.log(unitData)
    //     res.render('profile', { unitData: unitData, currentUser: req.user })
    // })
    // axios.get(technologyUrl)
    // .then(dets => {
    //     let techData = dets.data.technology
    //     console.log(techData)
    //     res.render('profile', { techData: techData, currentUser: req.user })
    // })
    // res.render('civilization', { techData: techData, currentUser: req.user })
})


app.get('*', (req, res) => {
    res.render('404.ejs')
})


const server = app.listen(process.env.PORT, () => {
    console.log(`fireing off at port ${process.env.PORT}`)
})

module.exports = server