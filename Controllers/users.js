const User = require('../models/user');
const handleAsync = require('../utils/handleAsync');
module.exports.renderRegister =  (req,res) =>{
    res.render('users/register')
}

module.exports.Register = handleAsync(async (req,res,next) =>{
try{
    const {username,email,password} = req.body;
    console.log(req.body)
    const user = new User({username,email});
    const regUser = await User.register(user,password);
    req.login(regUser,err =>{
        if(err) return next(err);
        req.flash('success',`WELCOME TO HOTELOC, ${username}`.toUpperCase());
        res.redirect('/hotels');
    })
}
catch(e){
    req.flash('error',e.message)
    res.redirect('/register');
}
})

module.exports.renderLogin =  (req,res) =>{
    res.render('users/login')
}

module.exports.Login = (req, res)=>{
    const {username} = req.body
    const redirectUrl = res.locals.returnTo || '/hotels';
    req.flash('success',`WELCOME BACK, ${username}`.toUpperCase());
    res.redirect(redirectUrl);
}
module.exports.LogOut = (req,res) => {
    req.logOut((err) => {
      if(err) {
        return next(err);
      }
      req.flash('success',`See You Again`);
      res.redirect('/hotels');
    });
  }