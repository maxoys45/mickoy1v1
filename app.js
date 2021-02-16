import dotenv from 'dotenv'
import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import flash from 'connect-flash'
import mongoose from 'mongoose'
import passport from 'passport'
import session from 'express-session'

import func from './config/passport'

import leaderboardRouter from './routes/leaderboard.route'
import userRouter from './routes/users.route'
import matchRouter from './routes/matches.route'

import { defaultResVars } from './middleware/res.vars'

// Init dotenv
dotenv.config()

// App
const app = express()

// Passport config
func(passport)

// Connect to Mongo
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
  .then(() => console.log('MongoDB Connected...\n====================\n++++++++++++++++++++\n===================='))
  .catch(err => console.error(err))

// Public folder
app.use(express.static(__dirname + '/public'))

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

// Bodyparser
app.use(express.urlencoded({ extended: false }))

// Express session
app.use(session({
  secret: process.env.EXPRESS_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 86400000, // 24 hours
  },
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Add user to all views
app.use(defaultResVars)

// Connect flash
app.use(flash())

// Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.light_msg = req.flash('light_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')

  next()
})

// Routes
app.use('/', leaderboardRouter)
app.use('/users', userRouter)
app.use('/matches', matchRouter)

// Listen to server
const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Started on ${PORT}`))
