var Model = require('../models/user.js')
var User = Model.User
var util = require('util');
var jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
var futil = require('../config/utility.js');
require('dotenv').config();

var result = {
    "status" : 'success',
}

var Login = async function(req,res){
    try {


        const user = await User.findAll({
            where: {
                email: req.body.email
              }
        });
        
        futil.logger.debug('\n' + futil.shtm() + '- [ RESULT ] | QUERING ' + util.inspect(user));
        
        if (user.length >0){
            var hash = user[0].password
            // futil.logger.debug('\n' + futil.shtm() + '- [ HASH ] | QUERING ' + util.inspect(hash));

           CheckPassword(req.body.password,hash).then(function(response){
                if (response == true){

                    const jwtKey = process.env.TOKEN_SECRET
                    const jwtExpirySeconds = '1d'
                    var email = req.body.email

                    const token = jwt.sign({ email }, jwtKey, {
                        algorithm: "HS256",
                        expiresIn: jwtExpirySeconds,
                    })

                    UpdateToken(email,token).then(function(response){
                        if(response == true){
                            result.status = 'success'
                            result.message = "user found"
                            result.token = token
                        
                
                            res.setHeader("Content-Type", "application/json");
                            res.writeHead(200);
                            res.end(JSON.stringify(result));
                        }else{

                            delete result.token;
                            result.status = 'failed'
                            result.message = "user not found"
                           
                        
                
                            res.setHeader("Content-Type", "application/json");
                            res.writeHead(400);
                            res.end(JSON.stringify(result));
                        }
                    })

                   
                }else{

                    delete result.token;
                    result.status = 'failed'
                    result.message = "password not same"
                    
        
                    res.setHeader("Content-Type", "application/json");
                    res.writeHead(400);
                    res.end(JSON.stringify(result));
                }
           })

           

        }else{
            delete result.token;
            result.status = 'failed'
            result.message = "user not found"
        

            res.setHeader("Content-Type", "application/json");
            res.writeHead(400);
            res.end(JSON.stringify(result));
        }

    } catch (err) {
        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
        
        delete result.token;
        result.status = 'failed'
        result.message = err
    

        res.setHeader("Content-Type", "application/json");
        res.writeHead(400);
        res.end(JSON.stringify(result));
    }
}

var CheckPassword = async function (password,hash){
    const match = await bcrypt.compare(password, hash);

    if(match) {
        return true
    }else{
        return false
    }
}

var UpdateToken = async function(email,token){
    try {
        await User.update({token:token},{
            where: {
                email:email
            }
        });
       
       futil.logger.debug('\n' + futil.shtm() + '- [ UPDATE USER TOKEN ] | QUERING ' + util.inspect(User));
       return true
    } catch (err) {
        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
        return false
    }
}

var authAccessToken = async function (req,res,next){

    const token = req.headers.token
    // console.log(token)
    const jwtKey = process.env.TOKEN_SECRET

    try{
        var payload = jwt.verify(token, jwtKey)
        // console.log(payload)
       
        futil.logger.debug('\n' + futil.shtm() + '- [ PAYLOAD ] | AUTH' + util.inspect(payload)); 
        req.body.email = payload.email
        next()

    }catch (err){

        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | AUTH' + util.inspect(err));

        result.status = 'failed'
        result.message = err.message
    

        res.setHeader("Content-Type", "application/json");
        res.writeHead(400);
        res.end(JSON.stringify(result));

        // res.send(err)
        // var result = {  "status":false,
        //                 "message":"token is expired"
        //              }
        // res.setHeader("Content-Type", "application/json");
        // res.writeHead(400);
        // res.end(JSON.stringify(result,null,3));
    }
}

module.exports = {
    Login,
    authAccessToken
}