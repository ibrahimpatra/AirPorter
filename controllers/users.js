const User = require('../models/user');

module.exports.signupform = (req, res) => {
    res.render('./users/register')
}

module.exports.signup = async(req,res,next) => {
    // res.send(req.body)
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        // console.log(registeredUser);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success','Welcome to Airporter')
            res.redirect('/airports')
        })    
    }catch(e){
        req.flash('error', e.message );
        res.redirect('register')
    }   
}

module.exports.loginform = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req,res) => {
    req.flash('success', 'Welcome')
    const redirectto = req.session.returnTo || '/'
    res.redirect(redirectto)
}

module.exports.logout = (req,res) =>{
    req.logout();
    req.flash('error', 'logged out successfully')
    res.redirect('/')
}