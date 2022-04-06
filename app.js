const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const mongoSanitize = require('express-mongo-sanitize');
// const dbUrl ="mongodb+srv://ouradmin:v1S0qs2zQ6LceGXI@cluster0.ahifw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const dbUrl = 'mongodb://first_database_user:iSu2rEpua11nqbC2@cluster0.7euot.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
// mongodb://localhost:27017/camp
// const Password = v1S0qs2zQ6LceGXI
// const dbUrl = "mongodb+srv://admin:Fr2WwdBTPZhCavYg@project.ahifw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
// const new_pass = Fr2WwdBTPZhCavYg
const dbUrl = "mongodb://admin:Fr2WwdBTPZhCavYg@project-shard-00-00.ahifw.mongodb.net:27017,project-shard-00-01.ahifw.mongodb.net:27017,project-shard-00-02.ahifw.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-4ii7c8-shard-0&authSource=admin&retryWrites=true&w=majority"
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize());


const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    // console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
    res.render('home.ejs')
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(process.env.PORT || 5000, () => {
    console.log('Serving on port 5000')
})

module.exports = app

