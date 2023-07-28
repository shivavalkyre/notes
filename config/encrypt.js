const crypto = require('crypto');
var util = require('util');
var futil = require('./utility.js');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
var iv_text = '';
const mysql = require('./mysql.js')



var EncryptData = function(req,res){
    futil.logger.debug(futil.shtm() + "- [ENCRYPT DATA] | DATA:" + util.inspect(req.body));
    var data = encrypt(JSON.stringify(req.body))
    //console.log('data:',data)

    var enc_data = data.encryptedData
    var iv = data.iv
    var key = data.key

    var query = "delete from encrypts where encrypt_data =? and iv=? and kol=?"
    mysql.DB.query(query,[enc_data,iv,key],function(getRes0)
    {
        //res.send(getRes)
        query = "insert into encrypts (encrypt_data,iv,kol) values (?,?,?)"
        mysql.DB.query(query,[enc_data,iv,key],function(getRes1)
        {   var obj = {"data":enc_data}
            res.send(obj)
        })
    })
   
}
module.exports.EncryptData  = EncryptData 

var EncryptResponseBody = function(req,res)
{
    futil.logger.debug(futil.shtm() + "- [ENCRYPT DATA] | DATA:" + util.inspect(req));
    var data = encrypt(JSON.stringify(req))
    //console.log('data:',data)
    futil.logger.debug(futil.shtm() + "- [ENCRYPT RESULT DATA] | DATA:" + util.inspect(data));
    var enc_data = data.encryptedData
    var iv = data.iv
    var key = data.key

    var query = "delete from encrypts where encrypt_data =? and iv=? and kol=?"
    mysql.DB.query(query,[enc_data,iv,key],function(getRes0)
    {
        //res.send(getRes)
        query = "insert into encrypts (encrypt_data,iv,kol) values (?,?,?)"
        mysql.DB.query(query,[enc_data,iv,key],function(getRes1)
        {   var obj = {"data":enc_data}
            res(obj)
        })
    })
}
module.exports.EncryptResponseBody = EncryptResponseBody

function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    //return encrypted.toString('hex')
    iv_text = iv.toString('hex')

    return { iv: iv_text, encryptedData: encrypted.toString('hex'),key:key.toString('hex') };
   }