// Import express
var express = require ('express');
 // Init express router
var router = express.Router();
var Auth = require('../controllers/auth.js')
var Register = require('../controllers/register.js')
var Me = require('../controllers/me.js')

router.get('/api',function (req, res, next) {
    res.send({message:'Welcome API Page'})
    res.end()
})

router.post('/api/register',function (req, res, next) {
    Register.Create(req,res)
})

router.post('/api/login',function (req, res, next) {
    Auth.Login(req,res)
})

router.get('/api/me',Auth.authAccessToken,function (req, res){
    Me.Read(req,res)
})

module.exports.router = router

