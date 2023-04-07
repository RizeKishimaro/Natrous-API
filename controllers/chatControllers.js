const gpt = require("../hey");

exports.chat = (req,res,next) =>{
    gpt(req.body.question);
}