var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var userSchema=new Schema({

    Username:String,
    googleId:String

});
var User=mongoose.model('User',userSchema);


module.exports=User;