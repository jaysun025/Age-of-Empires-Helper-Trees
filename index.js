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
const db = require('./models')
const favovorites = require('./models/favovorites')




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


app.get('/profile', isLoggedIn, (req, res) => {
    const civilizationUrl = 'https://age-of-empires-2-api.herokuapp.com/api/v1/civilizations'
    axios.get(civilizationUrl)
        .then(data => {
            let civData = data.data.civilizations
            res.render('profile', { civData: civData, currentUser: req.user })
        })
        .catch(error => {
            console.log(error)
        })
})

const technologyUrl = 'https://age-of-empires-2-api.herokuapp.com/api/v1/technologies'
const unitsUrl = 'https://age-of-empires-2-api.herokuapp.com/api/v1/units'

app.get('/civilization/:id', isLoggedIn, (req, res) => {
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
        res.render('techUnit', {unitData: units, techData: technology})
    })
        .catch(error => {
            console.log(error)
        })
})

app.get('/techUnit/:id', isLoggedIn, (req, res) => {
    axios.get(`https://age-of-empires-2-api.herokuapp.com/api/v1/unit/${req.params.id}`)
    axios.get(`https://age-of-empires-2-api.herokuapp.com/api/v1/technology/${req.params.id}`)
    .then(apiResponse => {
        let units = apiResponse.data
        let technology = apiResponse.data
        // console.log(units)
        res.render('techPage', {technology: technology})
    }).catch(error => {
        console.log(error)
    })
})
app.get('/unit/:id', isLoggedIn, (req, res) => {
    axios.get(`https://age-of-empires-2-api.herokuapp.com/api/v1/unit/${req.params.id}`)
    .then(apiResponse => {
        let units = apiResponse.data
        // console.log(units)
        res.render('unitsPage', {units: units})
        // res.send(units)
    }).catch(error => {
        console.log(error)
    })
})
app.get('/tech/:id', isLoggedIn, (req, res) => {
    axios.get(`https://age-of-empires-2-api.herokuapp.com/api/v1/technology/${req.params.id}`)
    .then(apiResponse => {
        let technology = apiResponse.data
        // console.log(units)
        res.render('techPage', {technology: technology})
    }).catch(error => {
        console.log(error)
    })
})

app.get('/favovorites', isLoggedIn, (req, res) => {
    // console.log('👿')

    db.favovorites.findAll({

        // where: {
        //     id: req.user.id
        // }
    }).then((favovorites => {
        // console.log(favovorites)
        res.render('favovorites', {favovorites})
    }))
})

app.post('/favovorites', isLoggedIn, (req, res) => {
    db.favovorites.create({
        name: req.body.name,
        userId: req.user.id
     }).then(newFav =>{ console.log(newFav)
        res.redirect('favovorites')
        // res.redirect('/profile')
    }).catch(error => {
        console.log(error)
    })
})

app.post('/delete/:id', isLoggedIn, (req, res) => {
    // console.log('you hit the delete route')
    console.log(req.params.id)
    db.favovorites.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        console.log('deleted entry')
        res.redirect('/favovorites')
    })
})

app.get('*', (req, res) => {
    res.render('404.ejs')
})


const server = app.listen(process.env.PORT, () => {
    console.log(`fireing off at port ${process.env.PORT}`)
})

module.exports = server
