const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuidv1 = require('uuidv1');
const hashPassword = require('password-hash');


var User = new Schema({
    email:{
        type: String,
        required:true
    },
    salt:{
        type:String,
        required:true  
    },
    password:{
        type:String,
        required:true
    }
},
{
    timestamps : true
}

);

// user methods

User.virtual("password")
  .set(function(password) {
    this._password = password;
    // uuid generate random string
    this.salt = uuidv1();
    this.hashPassword = this.encryptPassword(password);
    //console.log("check", this.salt, this.hashPassword);
  })
  .get(function() {
    return this._password;
  });
User.methods = {
  auth: function(password) {
    return passwordHash.verify(password, this.hashPassword);
  },
  encryptPassword: function(password) {
    if (!password) {
      return "";
    }
    try {
      return passwordHash.generate(password);
    } catch (error) {
      console.log(error);
      return "";
    }
  }
};



module.exports = mongoose.model('User', User);