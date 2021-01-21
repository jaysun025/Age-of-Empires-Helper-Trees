require('dotenv').config() // configure eviroment variables
const express = require('express')
const layouts = require('express-ejs-layouts')
const app = express()
const session = require('express-session')
const passport = require('./config/ppConfig.js')

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

// CUSTOM MIDDLEWEAR
app.use((req, res, next) => {
    res.locals.currentUser = req.user
    next() // move on to the next piece of middlewear
})

app.use('/auth', require('./controllers/auth.js'))

app.get('/', (req, res) => {
    if(req.user) {
        res.send(`req.user: ${req.user.name}`)
    }else{
        res.send('no user currently logged in')
    }
})

app.get('/profile', (req, res) => {
    res.render('profile')
})


app.listen(process.env.PORT, () => {
    console.log(`fireing off at port ${process.env.PORT}`)
})