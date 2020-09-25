const connection = require("../db/index");

module.exports = (req,res,next) => {
    const {card_id} = req.params;
    const today = new Date();
    connection.query(`SELECT end_date FROM bingo_card WHERE id =${connection.escape(card_id)}`,(err,result)=>{
        if(err){console.log(err);return next(err)}
        const end_date = result[0].end_date;
        let expire;
        end_date < today ? expire = true: expire = false;
        //console.log(expire);
        req.expire = expire
        next();
    })

}