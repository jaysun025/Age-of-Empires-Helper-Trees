require('dotenv').config() // configure eviroment variables
const express = require('express')
const layouts = require('express-ejs-layouts')
const app = express()

app.set('view engine', 'ejs')
app.use(layouts)

//body parser middlewear allows us to recieve form data in req.body 
app.use(express.urlencoded({extended: false}))
app.use('/auth', require('./controllers/auth.js'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/profile', (req, res) => {
    res.render('profile')
})


app.listen(process.env.PORT, () => {
    console.log(`fireing off at port ${process.env.PORT}`)
})