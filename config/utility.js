var moment = require('moment');
var util = require('util');
var momenttz = require('moment-timezone');
var crypto = require('crypto');
var winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
var fs = require('fs');
require('dotenv').config()

var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

var timezone = process.env.TIMEZONE

var shtm = function () {
    return momenttz().tz(timezone).format('DD MMM YYYY HH:mm:ss') + ' ';
    // return moment().format('DD MMM YYYY HH:mm:ss') + ' ';
};
module.exports.shtm = shtm;

/*LOGGER*/
var options = {
    file: {
        level: 'debug',
        name: 'file.info',
        filename: process.env.LOGFILE_FOLDER,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        // maxFiles: 100,
        colorize: true,
    },
    errorFile: {
        level: 'error',
        name: 'file.error',
        filename: process.env.LOGFILE_FOLDER,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 100,
        colorize: true,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: true,
        colorize: true,
    },
    dailyfile: {
        prepend: true,
        level: 'debug',
        colorize: false,
        timestamp: false,
        filename: process.env.LOGFILE_FOLDER,
        maxSize: 5242880,
        json: false,
        prettyPrint: true
    }
};

// your centralized logger object
const logger = winston.createLogger({
    transports: [
        new (winston.transports.Console)(options.console),
        new (winston.transports.File)(options.errorFile),
        // new (winston.transports.File)(options.file),
        // new (winston.transports.File)(options.file),
        new DailyRotateFile(options.file)
    ],
    exitOnError: false, // do not exit on handled exceptions
});
module.exports.logger = logger


var isEmailValid = function (email) {
    if (!email)
        return false;

    if(email.length>254)
        return false;

    var valid = emailRegex.test(email);
    if(!valid)
        return false;

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if(parts[0].length>64)
        return false;

    var domainParts = parts[1].split(".");
    if(domainParts.some(function(part) { return part.length>63; }))
        return false;

    return true;
}

module.exports.isEmailValid = isEmailValid


var isNameValid = function (name) {
    var result 

    if (name.length> 0 ){
        result = true
    }else{
        result = false
    }

    return result

}

module.exports.isNameValid = isNameValid