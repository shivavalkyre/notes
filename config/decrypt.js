const crypto = require('crypto');
var util = require('util');
var futil = require('./utility.js');
const algorithm = 'aes-256-cbc';
const mysql = require('./mysql.js')
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
var iv_text = '';

var DecryptData = function(req,res){
    var encryptedData = req
    futil.logger.debug(futil.shtm() + "- [ENCRYPT DATA] | DATA:" + util.inspect(req));
    var dec = decrypt(encryptedData)
    res(dec)
}
module.exports.DecryptData  = DecryptData 

var DecryptRequestBody = function(req,res){
    var data = req.body
    futil.logger.debug(futil.shtm() + "- [ENCRYPT DATA] | DATA:" + util.inspect(req.body));
    var query = "SELECT * FROM encrypts WHERE encrypt_data = ?"
    mysql.DB.query(query,[data.data],function(getRes){

        var encryptedData = {"encryptedData": getRes.data[0].encrypt_data,"iv": getRes.data[0].iv,"key":getRes.data[0].kol}
        var dec = decrypt(encryptedData)
        res.send(dec)


    })
    
}
module.exports.DecryptRequestBody  = DecryptRequestBody

function decrypt(text) {

    let iv = Buffer.from(text.iv, 'hex');
    let enkey = Buffer.from(text.key, 'hex')//will return key;
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(enkey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    futil.logger.debug(futil.shtm() + "- [DECRYPT DATA] | DATA:" + util.inspect(decrypted.toString()));
    return JSON.parse(decrypted.toString());
   }