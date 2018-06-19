//add to github.ignore

var passport=require('passport');
var GoogleStrategy=require('passport-google-oauth20').Strategy;
var key=require('../Keys/key');
var User=require('../models/user');

passport.serializeUser(function (user,done) {
   done(null,user.id);
});

passport.deserializeUser(function (id,done) {

    User.findById(id).then(function (user) {
        done(null,user);
    });
});



passport.use(new GoogleStrategy(
    {
        callbackURL: '/auth/google/redirect',
        clientID:key.googleKeys.cliendId,
        clientSecret:key.googleKeys.clientSecret
     },
    function (accessToken,refreshToken,profile,done) {
       //check if User already there in our db or not
        User.findOne({googleId:profile.id}).then(function (currentUser) {
            if(currentUser){
                console.log('user is:'+currentUser);
                done(null,currentUser);
            }
            else {
                new User({
                    Username:profile.displayName,
                    googleId:profile.id
                }).save().then(function (newUser) {
                    console.log('new user is created:' + newUser);
                    done(null,newUser);
                })
            }
        });


    }));

