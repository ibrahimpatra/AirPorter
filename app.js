if (process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

//console.log(process.env.secret)
//console.log(process.env.APIKEY)


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsmate = require('ejs-mate');
const joi = require('joi');
const {transcode} = require('buffer');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const localstrategy = require('passport-local')
const User = require('./models/user')

const userRoutes = require('./routes/users')
const airportRoutes = require('./routes/airports')
const reviewRoutes = require('./routes/reviews')

const dburl = process.env.db_url || 'mongodb://localhost:27017/airports'
const MongoDBStore = require("connect-mongo");

mongoose.connect(dburl , {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false

});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();

app.engine('ejs', ejsmate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const secret = process.env.secret || 'confidential';

const store = new MongoDBStore({
    mongoUrl: dburl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function(e){
    console.log("Session Store Error", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localstrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    //console.log(req.session)
    res.locals.signeduser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');

    next();
})

app.get('/fakeuser', async(req, res) => {
    const user = new User({email: 'abc@gmail.com', username: 'abfd'})
    const newuser = await User.register(user, 'chicken')
    res.send(newuser)
})

app.use('/', userRoutes)
app.use('/airports', airportRoutes)
app.use('/airports/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
    //res.send("Hello From Project")
    res.render('home')
})


app.all('*', (req, res, next ) => {
    //res.send("404!")
    next(new ExpressError('Page not found', 404))
}   )

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if (!err.message) err.message = 'Oh no, Something went Wrong'
    res.status(statusCode).render('error', {err});
    //res.send('Something went wrong')

})

const port = process.env.PORT || 3000;

app.listen(port, ()=> {
     console.log('Working on Port 3000')
 })