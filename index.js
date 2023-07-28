var express = require ('express')
var bodyParser = require('body-parser');
var util = require('util');
var cors = require('cors');
var futil = require('./config/utility.js');
var con = require ('./config/database.js');
var routes = require('./routes')
require('dotenv').config();

var app = express()


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());



app.use(routes.router)

var server = app.listen(process.env.SERVER_PORT, function () {
    var host = server.address().address;
    var port = server.address().port;
    

    futil.logger.debug('\n' + futil.shtm() + '- [ W A K E   U P ] | STARTING ' + util.inspect(process.env.TITLE));
    futil.logger.debug(futil.shtm() + '- [ W A K E   U P ] | RUN AT PATH: /api/pattern, PORT: ' + port);

    // Testing database connection 
    try {
        con.db.authenticate();
        futil.logger.debug('\n' + futil.shtm() + '- [ DATABASE U P ] | STARTING ' + util.inspect(process.env.DATABASE));
    } catch (error) {
        futil.logger.debug('\n' + futil.shtm() + '- [ DATABASE ERROR] | STARTING ' + util.inspect(error));
    }

});
