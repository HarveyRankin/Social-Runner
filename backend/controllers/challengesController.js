const connection = require('../db/index');
const uuid4 = require('uuid4');
const booleanCheck = (value) => {
    if (value) return 1;
    return 0;
}
exports.addSingleChallenge = (req, res, next) => {
    //get all data
    const id = uuid4();
    console.log(id)
    const {
        title,
        description,
        gps,
        photo,
        userDescription,
        startDate,
        endDate,
        score,
        distance,
        elevation,
        privacy,
        clubSelected
    } = req.body;
    console.log(title, description, gps)
    const distanceNum = +distance;
    const scoreNum = +score;
    const elevationNum = +elevation;
    const userName = req.userData.username;
    const gpsVal = booleanCheck(gps);
    const photoVal = booleanCheck(photo);
    const userDescriptionVal = booleanCheck(userDescription);
    console.log(clubSelected)
    const challenge = {
        challenge_id: id,
        title: title,
        score: scoreNum,
        gps: gpsVal,
        distance: distanceNum,
        elevation: elevationNum,
        photo: photoVal,
        user_description: userDescriptionVal,
        description: description,

    }
    const individual = {
        individual_id: 0,
        start_date: startDate,
        end_date: endDate,
        challenge_id: id,
        privacy: privacy,
        creator: userName,
        club: clubSelected
    }

    //console.log(individual,challenge);
    connection.query('INSERT INTO challenges SET ?', challenge, (err, response) => {
        if (err) return next(err);
        connection.query('INSERT INTO individual SET ?', individual, (err, response) => {
            if (err) return next(err);
            console.log('both succesful')
            res.send({
                data: 'succesfully added to database'
            })
        });
    })
    //upload to database within a transaction

}

exports.getSingleChallenge = (req, res, next) => {
    const id = req.params.id;
    
    const expired = req.expired
    //console.log(id);
    connection.query('SELECT * FROM challenges c INNER JOIN individual i ON (c.challenge_id = i.challenge_id) WHERE c.challenge_id =' + connection.escape(id), (err, result) => {
        if (err) return next(err);
        res.status(200).json({data:result[0],expired:expired});
    });
}

exports.addUserToChallenge = (req, res, next) => {
    const id = req.params.id;
    const username = req.userData.username;
    const data = {
        username: username,
        individual_id: id
    }
    connection.query('INSERT INTO athlete_joins_challenge SET ?', data, (err, result) => {
        if (err) return next(err);
        console.log(result)

        res.redirect('/challenges/single/joined')

    })

}

exports.getAllSingleChallenges = (req, res, next) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    connection.query(`SELECT * FROM challenges c INNER JOIN individual i ON (c.challenge_id = i.challenge_id) WHERE i.privacy ='global' 
    AND NOW() < i.end_date;`, (err, result) => {
        if (err) return next(err);
        //console.log(result);

        return res.status(200).json(result);
    })
}

exports.getPreview = (req, res) => {

    if (!req.files) {
        const data = {
            photo: false,
            routeObj: {
                route: false,
                distance: false
            }
        }
        res.json(data)
    }
    const gpxData = req.files.gps;
    const imageData = req.files.photo;

    //console.log(imageData.data);
    //image to base 64 to send back to the client and upload to the database
    let base64 = false;
    if (imageData) {
        console.log('got imagedata')
        base64 = imageData.data.toString('base64');
    }
    let encodedGpx = false;
    let distance = false;
    let time = false;
    let elevation = false;
    let pace = false
    if (gpxData) {

        const xml = Buffer.from(gpxData.data).toString();
        const json = parser.toJson(xml);
        const obj = JSON.parse(json)
        encodedGpx = gpxHelperFunctions.returnUsableGPX(obj);
        distance = gpxHelperFunctions.returnDistance(obj);
        const lowerObj = obj.gpx.trk.trkseg.trkpt
        const firstTime = lowerObj[0].time;
        const lastTime = lowerObj[lowerObj.length - 1].time;
        //console.log(firstTime,lastTime);
        time = gpxHelperFunctions.diff_hours(lastTime, firstTime);
        // console.log(lowerObj);
        const elevationPoints = lowerObj.map(el => +(el.ele / 0.3048).toFixed(2));
        elevation = gpxHelperFunctions.getElgain(elevationPoints);
        pace = gpxHelperFunctions.getPace(time, distance)
        //console.log(pace);
    }

    const data = {
        photo: base64,
        routeObj: {
            route: encodedGpx,
            distance: distance,
            time: time,
            elevationGain: elevation,
            pace: pace
        }
    }

    res.status(200).json(data);
}

exports.joinSingleChallenge = (req, res, next) => {

    const username = req.userData.username;
    //console.log(username);
    connection.query(`SELECT * FROM challenges c INNER JOIN individual i ON (c.challenge_id = i.challenge_id)
     INNER JOIN athlete_joins_challenge a ON (i.individual_id = a.individual_id) WHERE a.username =${connection.escape(username)}`, (err, result) => {
        if (err) return next(err)
        res.json(result);
    })

}

exports.getSingleCompletedChallenges = (req, res, next) => {
    const challenge_id = req.params.id;
    const isValid = 1;
    connection.query(`SELECT * FROM completes_challenge WHERE challenge_id =${connection.escape(challenge_id)} AND isValid = ${isValid}`, (err, result) => {
        if (err) return next(err);
        res.json(result)
    })
}

exports.checkUserHasSubmitted = (req, res, next) => {
    //check it doesnt exist in the database
    const challenge_id = req.params.id;
    const valid = 1
    const username = req.userData.username;
    connection.query(`SELECT * FROM completes_challenge WHERE challenge_id =${connection.escape(challenge_id)} AND isValid = ${valid} AND username =${connection.escape(username)}`, (err, result) => {
        if (err) return next(err);
        if (result.length === 0) {
            res.send({
                data: 'not answered'
            })
        } else {
            res.json(result[0]);
        }
    })
}

exports.updateAthleteScore = (req, res, next) => {
    const {
        score,
        id,
        challenge_id
    } = req.params;
    const {
        row,
        col,
        card,
        challengeSubCreator
    } = req.body
    const falsey = 0;
    const truthy = 1;
    const username = req.userData.username;
    const data = {
        submission_id: id,
        user_id: username
    }
   
    connection.query('INSERT INTO reacts_to SET ?', data, (err, result) => {
        if (err) return next(err);
        connection.query(`SELECT score from completes_challenge WHERE id = ${connection.escape(id)}`, (err, results) => {
            if (err) return next(err)
            const challengeScore = results[0].score
            if (+challengeScore === 1 && +score === -1) {
                console.log(id)
                if (row === "single") {
                    console.log(row)
                    connection.query(`UPDATE completes_challenge SET isValid = ${connection.escape(falsey)} WHERE id =${connection.escape(id)}`, (err, results) => {
                        if (err) return next(err)
                        res.redirect(`/challenges/single/all/${challenge_id}`)
                    })
                } else {
                    console.log(row,col)
                    console.log('transaction')
                    connection.beginTransaction((err) => {
                        if (err) return next(err)
                        connection.query(`UPDATE completes_challenge SET isValid = ${connection.escape(falsey)} WHERE id =${connection.escape(id)}`, (err, result) => {
                            if (err) {
                                console.log(err)
                                connection.rollback(() => next(err))
                            }
                            console.log(result, 'woop')
                            console.log(col,username,card)
                            connection.query(`DELETE FROM completes_col WHERE username = ${connection.escape(challengeSubCreator)} 
                        AND card_id = ${connection.escape(card)}
                        AND col_no =${connection.escape(col)}`, (err, ress) => {
                                if (err) {
                                    console.log(err)
                                    connection.rollback(() => next(err))
                                }
                                console.log(ress)
                                connection.query(`DELETE FROM completes_row WHERE username=${connection.escape(challengeSubCreator)}
                            AND card_id =${connection.escape(card)}
                            AND row_no = ${connection.escape(row)}`, (err, resss) => {
                                    if (err) {
                                        console.log(err)
                                        connection.rollback(() => next(err))
                                    }
                                    console.log(resss)
                                    connection.query(`DELETE FROM completes_card WHERE card_id = ${connection.escape(card)}
                                AND username=${connection.escape(challengeSubCreator)}`, (err, resultsss) => {
                                        if (err) {
                                            connection.rollback(() => next(err))
                                        }
                                        connection.commit((err) => {
                                            if (err) {
                                                connection.rollback(() => next(err))
                                            }
                                            console.log('commit')
                                            res.redirect(`/challenges/single/all/${challenge_id}`);

                                        })
                                    })
                                })
                            })
                        })
                    })
                }
            } else {
                connection.query(`UPDATE completes_challenge SET score = score + ${connection.escape(score)} WHERE id = ${connection.escape(id)}`, (err, result) => {
                    if (err) return next(err);
                    res.redirect(`/challenges/single/all/${challenge_id}`);
                })
            }


        })
    })
}
exports.submitChallengeAttempt = (req, res, next) => {
    console.log('testing')
    const {
        title,
        description,
        time,
        elevationGain,
        pace,
        personImage,
        gpsRoute,
        distance,
        challenge_id
    } = req.body;
    //console.log(req.challengeRules)
    const score = req.challengeRules.score;
    const username = req.userData.username;
    let distanceNum = 0;
    let elevationNum = 0;
    let paceNum = 0;
    let timeNum = 0;
    let descrip = 0;
    let image = 0;
    let route = 0;
    if (personImage) image = personImage
    if (gpsRoute) route = gpsRoute
    if (description) descrip = description;
    if (distance) distanceNum = +distance;
    if (elevationGain) elevationNum = +elevationGain;
    if (pace) paceNum = +pace;
    if (time) timeNum = +time;
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const data = {
        id: 0,
        challenge_id: challenge_id,
        username: username,
        elevation: elevationNum,
        score: score,
        ts: timestamp,
        subTitle: title,
        subDescription: descrip,
        distance: distanceNum,
        pace: paceNum,
        runTime: timeNum,
        image: image,
        routeMap: route,
        isValid: 1
    }
    console.log(data)
    connection.query('INSERT INTO completes_challenge SET ?', data, (err, result) => {
        if (err) return next(err)
        console.log('inserted')
        res.redirect(`/challenges/single/all/${challenge_id}`)
    })

}

/*connection.query('INSERT INTO reacts_to SET ?', data, (err, result) => {
    if (err) return next(err);
    connection.query(`SELECT score from completes_challenge WHERE id = ${connection.escape(id)}`, (err, results) => {
        if (err) return next(err)
        const challengeScore = results[0].score
        if (+challengeScore === -2 && +score === -1 ) {
            console.log(id)
            connection.query(`UPDATE completes_challenge SET isValid = ${connection.escape(falsey)} WHERE id =${connection.escape(id)}`, (err, results) => {
                if (err) return next(err)
                res.redirect(`/challenges/single/all/${challenge_id}`)
            })
        } else {
            connection.query(`UPDATE completes_challenge SET score = score + ${connection.escape(score)} WHERE id = ${connection.escape(id)}`, (err, result) => {
                if (err) return next(err);
                res.redirect(`/challenges/single/all/${challenge_id}`);
            })
        }
    })
})*/