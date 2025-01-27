const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true // not for validate
    }
})


userSchema.plugin(passportLocalMongoose); // checking for duplicates and addin the password field and also username field & some additional methods too



module.exports = mongoose.model('User',userSchema)


// See these links to find explanations about it:
// - passport.initialize() https://stackoverflow.com/a/46645936
// - passport.session() https://stackoverflow.com/a/28994045
// - passport.use(new LocalStrategy(User.authenticate())); will basically make Passport.js use the passport-local-mongoose local 
// authentication strategy - https://github.com/saintedlama/passport-local-mongoose#configure-passportpassport-local
// - about serializing and deserializing a user:
// https://stackoverflow.com/a/27637668
// https://stackoverflow.com/a/28693104
// Make sure to research each of these lines online (via Google) to read more about it too.
// You can also read about the overall Passport local authentication system here:
//  https://mianlabs.com/2018/05/09/understanding-sessions-and-local-authentication-in-express-with-passport-and-mongodb/