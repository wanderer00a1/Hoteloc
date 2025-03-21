

require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const User = require('./models/user.js')
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const expressSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
// routes 
const hotelRoutes = require('./routes/hotels.js')
const reviewRoutes = require('./routes/reviews.js');
const userRoutes = require('./routes/users.js')
const expressError = require('./utils/expressError');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const MongoStore = require('connect-mongo');

const dburl =process.env.DB_URL;

main().catch(err =>{ 
    console.log("Connection Failed");
    console.log(err)});

async function main() {
  await mongoose.connect(dburl);
    console.log("Connected")
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.engine('ejs',ejsMate);
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(expressSanitize({
  replaceWith: '_',
}));

const store = MongoStore.create({
  mongoUrl: dburl,
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret: process.env.SEC_RET
  }
});

store.on('error',function(e){
  console.log('store error',e);
})



const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/",
  "https://code.jquery.com/"
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/",
];
const connectSrcUrls = [
  "https://api.maptiler.com/",
];
const fontSrcUrls = [];
app.use(
   helmet.contentSecurityPolicy({
       directives: {
           defaultSrc: [],
           connectSrc: ["'self'", ...connectSrcUrls],
           scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
           styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
           workerSrc: ["'self'", "blob:"],
           objectSrc: [],
           imgSrc: [
               "'self'",
               "blob:",
               "data:",
               "https://res.cloudinary.com/dl13fjvsp/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
               "https://images.unsplash.com/",
               "https://encrypted-tbn0.gstatic.com/",
               "https://api.maptiler.com/"

           ],
           fontSrc: ["'self'", ...fontSrcUrls],
       },
   })
);


const sessionConfig  = {
  store,
  name:process.env.S_NAME,
  secret:process.env.SEC_RET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    httpOnly:true,
    // secure:true,
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


//The below block of code allows us to use currentUser,success,error in any ejs file.
app.use((req,res,next) =>{
  res.locals.CurrentUser = req.user; 

  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})


app.use('/',userRoutes);
app.use('/hotels',hotelRoutes);
app.use('/hotels/:id/reviews',reviewRoutes);




//******************************************ROUTES ********************************* */
app.get('/', (req,res) =>{
    res.render('hotels/home');
});

app.get('/*',(req,res,next) =>{
  next(new expressError('Page Not Found',404));
})

app.use((err,req,res,next) =>{
  const {statusCode = 500 } = err;
  if(!err.message) err.message = 'Cannot find that Page';
  res.status(statusCode).render('error', {err});
});

app.listen(7810, () =>{
    console.log('Server is running on port 7810');
});
