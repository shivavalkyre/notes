var Model = require('../models/user.js')
var User = Model.User
var util = require('util');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var futil = require('../config/utility.js');
var passwordValidator = require('password-validator');


var result = {
    "status" : 'success',
}

var Create = async function(req,res){
    try {
        var name = req.body.name;
        var email= req.body.email;
        var password = req.body.password;
        var repassword = req.body.repassword;

        var isNameValid = futil.isNameValid(name)
        futil.logger.debug('\n' + futil.shtm() + '- [ NAME VALID ] | INFO ' + util.inspect(isNameValid));

        var isEmailValid = futil.isEmailValid(email)
        futil.logger.debug('\n' + futil.shtm() + '- [ EMAIL VALID ] | INFO ' + util.inspect(isEmailValid));
        
        if (isNameValid == true){

            if (isEmailValid == true){
            
                // check email on database
                EmailCheck(req).then(function (response){

                    futil.logger.debug('\n' + futil.shtm() + '- [ RESULT EMAIL CHECK RESPONSE ] | INFO ' + util.inspect(response));

                    if (response == false) {
                        
                            // check password
                            var schema = new passwordValidator();
                            schema
                            .is().min(8)                                    // Minimum length 8
                            .is().max(100)                                  // Maximum length 100
                            .has().uppercase()                              // Must have uppercase letters
                            .has().lowercase()                              // Must have lowercase letters
                            .has().digits(2)                                // Must have at least 2 digits
                            .has().not().spaces()                           // Should not have spaces
                
                            var isPasswordValid = schema.validate(password)
                
                            if (isPasswordValid == true){
                                if(password == repassword){
                
                                    // var reply = res

                                

                                    bcrypt.genSalt(saltRounds, function(err, salt) {
                                        bcrypt.hash(password, salt, function(err, hash) {
                                            // Store hash in your password DB.
                
                                            var request = {
                                                username : req.body.name,
                                                email : req.body.email,
                                                password : hash
                                            }
                
                                            futil.logger.debug('\n' + futil.shtm() + '- [ REQUEST ] | INFO ' + util.inspect(request));
                
                                            AddUser(request).then(function(response) {
                                                futil.logger.debug('\n' + futil.shtm() + '- [ RESULT RESPONSE ] | INFO ' + util.inspect(response));
                                                if (response == true){
                                                    
                                                    result.status = 'success'
                                                    result.message = "user was created"

                                                    res.setHeader("Content-Type", "application/json");
                                                    res.writeHead(200);
                                                    res.end(JSON.stringify(result));
                                                    
                                                }else{
                                                    result.status = 'failed'
                                                    result.message = "create user failed"
                                                

                                                    res.setHeader("Content-Type", "application/json");
                                                    res.writeHead(400);
                                                    res.end(JSON.stringify(result));
                                                }
                                            });
                                            
                                        
                                        
                                        });
                                    });
                
                                
                                }else{
                                    futil.logger.debug('\n' + futil.shtm() + '- [ ERROR PASSWORD COMPARE] | INFO ');
                                
                                    result.status = 'failed'
                                    result.message = "password is not same"
                                
                
                                    res.setHeader("Content-Type", "application/json");
                                    res.writeHead(400);
                                    res.end(JSON.stringify(result));
                                }
                            }else{
                                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR PASSWORD VALIDITY ] | INFO ' + util.inspect(isPasswordValid));
                                
                                result.status = "failed"
                                result.message = "password format invalid (Min. 8,Max. 100,Must have uppercase,Must have lower case)"
                
                                res.setHeader("Content-Type", "application/json");
                                res.writeHead(400);
                                res.end(JSON.stringify(result));
                            }



                    }else{

                        result.status = "failed"
                        result.message = "email already registered"
        
                        res.setHeader("Content-Type", "application/json");
                        res.writeHead(400);
                        res.end(JSON.stringify(result));
                    }
                })


            
            }else{
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR EMAIL VALIDITY ] | INFO ' + util.inspect(isEmailValid));
                
                result.status = "failed"
                result.message = "email format invalid"
    
                res.setHeader("Content-Type", "application/json");
                res.writeHead(400);
                res.end(JSON.stringify(result));
            }
    
        }else{

            futil.logger.debug('\n' + futil.shtm() + '- [ ERROR NAME VALIDITY ] | INFO ' + util.inspect(isNameValid));

            result.status = "failed"
            result.message = "name format invalid"

            res.setHeader("Content-Type", "application/json");
            res.writeHead(400);
            res.end(JSON.stringify(result));
        }
        
   
      
        
    } catch (err) {
        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
        
        result.status = 'failed'
        result.message = err
    

        res.setHeader("Content-Type", "application/json");
        res.writeHead(400);
        res.end(JSON.stringify(result));
    }
}


var AddUser = async function (req){

    var response 
    try{

        const user = await User.create(req);
        futil.logger.debug('\n' + futil.shtm() + '- [ RESULT ] | QUERING ' + util.inspect(user));
        response = true
        return response
        // result.status = 'success'
        // result.message = "user was created"

        // res.setHeader("Content-Type", "application/json");
        // res.writeHead(200);
        // res.end(JSON.stringify(result));

    }catch(err){
        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR CREATE USERS] | INFO ' + util.inspect(err));
        response = false
        return response
        // result.status = 'failed'
        // result.message = "create user failed"
       

        // res.setHeader("Content-Type", "application/json");
        // res.writeHead(400);
        // res.end(JSON.stringify(result));
    }

  
}

var EmailCheck = async function (req){
    try {
        const user = await User.findAll({
            where: {
                email: req.body.email
              }
        });
        futil.logger.debug('\n' + futil.shtm() + '- [ RESULT ] | QUERING ' + util.inspect(user));
        if (user.length == 0){
            return false
        }else{
            return true
        }
       
    } catch (err) {
        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
    }
}


module.exports = {
    Create
}