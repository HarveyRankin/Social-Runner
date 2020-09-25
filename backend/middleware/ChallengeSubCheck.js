const connection = require("../db/index");

module.exports = (req,res,next) => {
    
    //make call to database to get challenge that it is posting to
    const {challenge_id,gpsRoute,distance,elevationGain,description,personImage} = req.body;
    const distanceNum = +distance;
    const elevationNum = +elevationGain
    connection.query('SELECT * FROM challenges WHERE challenge_id =' + connection.escape(challenge_id),(err,result)=> {
        if(err)return next(err);
        
        const challengeRules = result[0]
        
        //check that the user can even submit a second challenge 
        console.log(challengeRules)
        if(challengeRules.gps && !gpsRoute){
          return res.json({data: 'missing gps route'})
        }
        if(challengeRules.distance){
            if(distanceNum < challengeRules.distance){  
                return res.json({data: `Run must be ${challengeRules.distance} miles or longer`});
            }
        }
        if(challengeRules.elevation){
            if(elevationNum < challengeRules.elevation){
                return res.json({data: `Total Elevation gain must be ${challengeRules.elevation}ft or greater`});
            }
        }
        if(challengeRules.user_description && !description){
            return res.json({data: `Challenge must have a description`});
        }
        if(challengeRules.photo && !personImage){
            return res.json({data: `Must have an image`});
        }
        req.challengeRules = challengeRules;
        next()
        
    })   
}