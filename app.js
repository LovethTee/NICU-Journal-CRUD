const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require ('dotenv')
const morgan = require('morgan')
const exphbs = require ('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')//(session) not required


const connectDB = require('./config/db')


//LOAD CONFIG
dotenv.config({path: './config/config.env'})


//PASSPORT CONFIG
require('./config/passport')(passport)

connectDB()

const app = express()

//BODY PARSER
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//METHOD OVERRIDE
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }

}))
//LOGGING
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//HANDLEBARS  HELPERS
const {formatDate, stripTags, truncate, editIcon, select}  = require('./helpers/hbs')

//HANDLEBARS
//add .engine after exphbs
app.engine('.hbs', exphbs.engine({
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select,
    }, 
    defaultLayout: 'main', 
    extname: '.hbs'
}))

app.set('view engine', '.hbs')

//SESSIONS
app.use(session({
    secret: 'keyboard cat',
    resave: false, //means we dont want to save a session if nothing is initialized
    saveUninitialized: false, //means dont create a session until something is stored
    store: MongoStore.create({
        mongoUrl:process.env.MONGO_URI 
    })//will give you your current mongoose connection
  }))


//PASSPORT MIDDLEWARE
app.use(passport.initialize())
app.use(passport.session()) //in order for passport to work we need to implement express session 

//SET GLOBAL VARIABLE
app.use(function (req, res, next){
    res.locals.user = req.user || null
    next()
})

//STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')))
//dirname is the absolute path to the current directory

//ROUTES
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))


const PORT = process.env.PORT || 3000


app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)