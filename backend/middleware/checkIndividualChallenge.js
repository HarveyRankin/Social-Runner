const connection = require("../db/index");


module.exports = (req,res,next) => {
    const challenge_id = req.params.id
    
    connection.query(`SELECT i.end_date FROM individual i INNER JOIN challenges c ON (c.challenge_id = i.challenge_id) WHERE i.challenge_id =${connection.escape(challenge_id)}`,(err,result) => {
        if(err){
            console.log(err)
            return next(err)
        }
        //console.log(result)
        const end_date = result[0].end_date;
        //console.log(end_date)
        const today = new Date();
        const expired = end_date < today;
        console.log(expired)
        req.expired = expired
        next();
    })
    


}