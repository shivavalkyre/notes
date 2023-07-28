var Model = require('../models/user.js')
var User = Model.User
var util = require('util');
var futil = require('../config/utility.js');

var result = {
    "status" : 'success',
}

var Read = async function(req,res){
    try {
        const user = await User.findAll({
            where: {
                email: req.body.email
              },
              attributes: ['username', 'email','password']
        });

        futil.logger.debug('\n' + futil.shtm() + '- [ RESULT ] | QUERING ' + util.inspect(user));
        
        result.status = 'success'
        result.message = "user found"
        result.data = user
                        
                
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.end(JSON.stringify(result));

    } catch (err) {
        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
    }
}


module.exports = {
    Read,
}