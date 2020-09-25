const {
    Router
} = require('express');
const fileUpload = require('express-fileupload');
const auth = require('../middleware/check-auth');
const challengeSubAuth = require('../middleware/ChallengeSubCheck')
const challenges = require('../controllers/challengesController');
const connection = require('../db/index');
const {
    check,
    validationResult
} = require('express-validator/check');
const parser = require('xml2json');
const gpxHelperFunctions = require('../helperFunctions/gpsParser');
const router = Router();
const uuid4 = require('uuid4');
const {
    Connection
} = require('pg');
const booleanCheck = (value) => {
    if (value) return 1;
    return 0;
}
const cardExpireCheck = require('../middleware/checkCardExpire'); //middleware
const singleExpireCheck = require('../middleware/checkIndividualChallenge'); //middleware
const checkCardExpire = require('../middleware/checkCardExpire'); //middleware
router.use(fileUpload());

//get friends challenges 
router.get('/single/friends', auth, (req, res, next) => {
    const username = req.userData.username
    connection.beginTransaction(err => {
        if (err) return next(err)
        connection.query(`SELECT * FROM Friends_with WHERE friend1 = ${connection.escape(username)} OR friend2=${connection.escape(username)}`, (err, result) => {
            if (err) {
                connection.rollback(() => {
                    return next(err);
                });
            }
            if (result.length === 0) return res.json([])
            const names = result.map(obj => {
                let name;
                Object.keys(obj).forEach(key => {
                    if (obj[key] !== username) name = obj[key]
                })
                return name
            })
            const club = 'club'
            connection.query(`SELECT * FROM challenges c INNER JOIN individual i ON (c.challenge_id = i.challenge_id)
            WHERE i.creator in(?) AND i.end_date > NOW() AND i.privacy<>${connection.escape(club)}`, [names], (err, result) => {
                if (err) {

                    connection.rollback(() => {
                        ;
                        console.log(err)
                        return next(err);
                    });
                }
                const friendsChallenges = result
                connection.commit(err => {
                    if (err) {
                        connection.rollback(() => {
                            return next(err);
                        });
                    }
                    console.log('committed');
                    return res.status(200).json(friendsChallenges)
                })
            })
        })

    })

})
//get friends bingo cards
router.get('/group/friends/', auth, (req, res, next) => {
    const {
        username
    } = req.userData;
    console.log(username)
    connection.beginTransaction(err => {
        if (err) return next(err)
        connection.query(`SELECT * FROM Friends_with WHERE friend1=${connection.escape(username)} OR friend2=${connection.escape(username)}`, (err, result) => {
            if (err) {
                connection.rollback(() => {
                    return next(err)
                })
            }
            if (result.length === 0) return res.json([])
            const names = result.map(obj => {
                let name;
                Object.keys(obj).forEach(key => {
                    if (obj[key] !== username) name = obj[key]
                })
                return name
            })
            const club = 'club'
            connection.query(`SELECT b.club, b.id,b.end_date,b.creator,b.description,b.title,b.id, COUNT(c.challenge_id) FROM bingo_card b 
            INNER JOIN bingo_challenge a ON (b.id = a.bingo_id)
            INNER JOIN challenges c ON (a.challenge_id = c.challenge_id) 
            WHERE b.creator IN(?) 
            AND b.end_date > NOW() 
            AND b.privacy <>${connection.escape(club)}
            GROUP BY b.id`, [names], (err, results) => {
                if (err) {
                    connection.rollback(() => {
                        return next(err)
                    })
                }
                connection.commit(err => {
                    if (err) {
                        connection.rollback(err => {
                            return next(err)
                        })
                    }
                    res.json(results)
                })
            })
        })

    })
})
//get user create bingo
router.get('/group/userCreated', auth, (req, res, next) => {
    const {
        username
    } = req.userData;
    connection.query(`SELECT title as username, id FROM bingo_card WHERE creator = ${connection.escape(username)}`, (err, result) => {
        if (err) return next(err);
        console.log(result)
        res.json(result)
    })
})
//get user created single
router.get('/single/userCreated', auth, (req, res, next) => {
    const {
        username
    } = req.userData;
    console.log(username);
    connection.query(`SELECT c.title as username,i.individual_id, c.challenge_id as id FROM challenges c INNER JOIN individual i ON (c.challenge_id = i.challenge_id)
    WHERE i.creator = ${connection.escape(username)}`, (err, result) => {
        //console.log(err)
        if (err) {
            console.log(err)
            return next(err);
        }
        console.log(result)
        res.json(result)


    })
})
//get comments for challenge sub
router.get('/single/getComments/:id', auth, (req, res, next) => {
    const id = req.params.id;
    connection.query(`SELECT * FROM comments_on WHERE challenge_complete_id = ${connection.escape(id)}`, (err, result) => {
        if (err) return next(err);
        res.json(result);
    })
});
//get single challenge tied to clubs
router.get('/single/userClubs', auth, (req, res, next) => {
    
    const {
        username
    } = req.userData;
   
    connection.beginTransaction(err => {
        console.log('error')
        if (err) return next(err)
        connection.query(`SELECT * FROM follows_club WHERE username = ${connection.escape(username)}`, (err, result) => {
            if (err) {
                console.log('error here')
                connection.rollback(() => {

                    return next(err);
                });
            }
            if (result.length === 0) return res.json([])
            const clubNames = result.map(obj => obj.clubname)
            console.log(clubNames)

            connection.query(`SELECT * FROM challenges c INNER JOIN individual i ON (c.challenge_id = i.challenge_id)
            WHERE i.club IN(?) AND i.end_date >= NOW()`, [clubNames], (err, results) => {
                if (err) {
                    connection.rollback(() => {
                        return next(err)
                    })
                }
                console.log(results)
                connection.commit(err => {
                    if (err) {
                        connection.rollback(() => {
                            return next(err);
                        });
                    }
                    console.log('committed');
                    res.json(results)
                })
            })
        })
    })
})
//get bingo card tied to joined clubs
router.get('/group/userClubs', auth, (req, res, next) => {
    const {
        username
    } = req.userData;
    console.log('reaching')
    connection.beginTransaction(err => {
        if (err) return next(err)
        console.log('here')
        console.log(username)
        connection.query(`SELECT * FROM follows_club WHERE username=${connection.escape(username)}`, (error, result) => {
            if (error) {
                connection.rollback(() => {
                    return next(error)
                })
            }
            console.log(result)
            console.log('makes it here')
            if (result.length === 0) return res.json([])
            const clubnames = result.map(obj => obj.clubname)
            console.log(clubnames)

            connection.query(`SELECT b.club, b.id,b.end_date,b.creator,b.description,b.title,b.id, COUNT(c.challenge_id) FROM bingo_card b 
            INNER JOIN bingo_challenge a ON (b.id = a.bingo_id)
            INNER JOIN challenges c ON (a.challenge_id = c.challenge_id) 
            WHERE b.club IN(?) 
            AND b.end_date > NOW() 
            GROUP BY b.id`, [clubnames], (err, results) => {
                if (err) {
                    connection.rollback(() => {
                        return next(err)
                    })
                }
                console.log(results)
                connection.commit(err => {
                    if (err) {
                        connection.rollback(() => {
                            return next(err);
                        });
                    }
                    console.log('committed');
                    res.json(results)
                })

            })

        })
    })

})
//add comments to post
router.post('/single/addComment', auth, (req, res, next) => {
    const {
        comment,
        id,
        ts
    } = req.body;
    const username = req.userData.username
    const data = {
        comment_id: 0,
        commenter: username,
        comment: comment,
        ts: ts,
        challenge_complete_id: id
    }
    connection.query('INSERT INTO comments_on SET ?', data, (err, result) => {
        if (err) return next(err);
        res.redirect(`/challenges/single/getComments/${id}`);
    });
});
//preview challenge 
router.post('/preview', (req, res) => {

    if (!req.files) {
        const data = {
            photo: false,
            routeObj: {
                route: false,
                distance: false
            }
        }
        return res.json(data)
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
    console.log(data)
    res.json(data);


});
//get all single joined
router.get('/single/joined', auth, challenges.joinSingleChallenge)
//get bingo joined
router.get('/group/joined', auth, (req, res, next) => {
    const username = req.userData.username;
    connection.query(`SELECT b.id, b.title,b.end_date,b.description,b.creator,COUNT(c.challenge_id) as count FROM bingo_card b 
INNER JOIN athlete_joins_card a 
ON (b.id = a.card_id)
INNER JOIN bingo_challenge d 
ON (b.id = d.bingo_id)
INNER JOIN challenges c 
ON (d.challenge_id = c.challenge_id)
WHERE a.username = ${connection.escape(username)}
GROUP BY b.id`, (err, result) => {
        if (err) return next(err);
        res.json(result)
    })
})
//check if user has reacted to challenge
router.get(`/completedCheck/:id`, auth, (req, res, next) => {
    const username = req.userData.username;
    const {
        id
    } = req.params
    // console.log(username,id)
    connection.query(`SELECT r.submission_id FROM reacts_to r 
    INNER JOIN completes_challenge c ON (c.id = r.submission_id) 
    WHERE r.user_id = ${connection.escape(username)} AND c.challenge_id =${connection.escape(id)}`, (err, result) => {
        
        if (err) return next(err)
        console.log(result)
        res.json(result)
    })
})
//get all single completed challenges
router.get('/single/all/:id', auth, challenges.getSingleCompletedChallenges);
//check user has submitted
router.get('/single/check/:id', auth, challenges.checkUserHasSubmitted);
//update the score 
router.post('/single/alterScore/:score/:id/:challenge_id', auth, challenges.updateAthleteScore);
//submit challenge submission
router.post('/single/submission', auth, challengeSubAuth, challenges.submitChallengeAttempt);
//upload single challenge 
router.post('/single', auth, [
    check('title').not().isEmpty().withMessage('Must have a title'),
    check('description').not().isEmpty().withMessage('Must have have a description'),
    check('startDate').not().isEmpty().withMessage('Must have a start date specified'),
    check('endDate').not().isEmpty().withMessage('Must have an end date specified'),
    check('score').not().isEmpty().isNumeric().withMessage('Must have a score'),
    check('privacy').not().isEmpty().withMessage('Privacy must be spcified'),
    check('gps').isBoolean().withMessage('GPS is wrong')
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(422).json(errors.array())
    } else {
        next()
    }
}, challenges.addSingleChallenge);
//get all single challenges
router.get('/single', auth, challenges.getAllSingleChallenges);
//get all single and expired that the athlete has joined
router.get('/single/expired', auth, (req, res, next) => {
    const {
        username
    } = req.userData;
    connection.query(`SELECT * FROM challenges c INNER JOIN individual i ON (c.challenge_id = i.challenge_id)
    INNER JOIN athlete_joins_challenge a ON (a.individual_id = i.individual_id) 
    WHERE a.username =${connection.escape(username)}
    AND NOW() > i.end_date`, (err, result) => {

        if (err) {
            console.log(err)
            return next(err)
        }
        console.log(result)
        if (result.length === 0) return res.json([])
        res.json(result)
    })

})
//get all bingo and expired 
router.get('/group/expired', auth, (req, res, next) => {
    const {
        username
    } = req.userData;
    console.log(username)
    connection.query(`SELECT b.club, b.id,b.end_date,b.creator,b.description,b.title,b.id, COUNT(c.challenge_id) FROM bingo_card b 
    INNER JOIN bingo_challenge a ON (b.id = a.bingo_id)
    INNER JOIN challenges c ON (a.challenge_id = c.challenge_id) 
    INNER JOIN athlete_joins_card h ON (h.card_id = b.id)
    WHERE h.username = ${connection.escape(username)}
    AND b.end_date < NOW()
    GROUP BY b.id`, (err, result) => {
        if (err) {
            console.log(err)
            return next(err)
        }
        console.log(result)
        if (result.length === 0) return res.json([])
        res.json(result)
    })
})
//get single challenge with id
router.get('/single/:id', singleExpireCheck, auth, challenges.getSingleChallenge);
//add user to the challenge (joined)
router.get('/addAthlete/:id', auth, /*needs middleware to check privacy*/ challenges.addUserToChallenge);
//check user has joined
router.get('/single/checkSingleJoined/:id', auth, (req, res, next) => {
    const username = req.userData.username;
    const individualId = req.params.id
    console.log(individualId)
    connection.query(`SELECT a.username, c.challenge_id FROM athlete_joins_challenge a INNER JOIN individual c ON (a.individual_id = c.individual_id) WHERE a.username=${connection.escape(username)} AND a.individual_id=${connection.escape(individualId)}`,
        (err, result) => {
            console.log(err)
            if (err) return next(err)
            console.log(result)
            if (result.length === 0) {
                res.send({
                    data: 'not Joined',
                    id: result
                })
            } else {
                res.send({
                    data: 'Joined',
                    id: result[0].challenge_id,
                })
            }
        })


})
//post bingo card to database
router.post('/group', auth, (req, res, next) => {
    //console.log('arriving')
    console.log('posting')
    const bingo_id = uuid4();
    const bingo_challenges = []
    const username = req.userData.username;
    console.log(bingo_id)

    const flaten2dArray = [].concat(...req.body.challenges)

    //console.log(req.body)
    const challengesNestedArr = flaten2dArray.map(chall => {
        const keys = ['title', 'score', 'gps', 'distance', 'elevation', 'photo', 'userDescription', 'description', 'startDate', 'endDate'];
        let values = keys.map(key => {
            if (key !== 'startDate' || key !== 'endDate') {
                return chall[key];
            }
        })
        //console.log(values)
        const id = uuid4();
        const rowNum = chall.row
        const colNum = chall.col
        const bingo_challenge = [0, id, bingo_id, rowNum, colNum];
        //console.log(bingo_challenge)
        bingo_challenges.push(bingo_challenge)
        values = [id, ...values] //add an id
        values.splice(9, 3) //remove the dates
        for (let i = 0; i < values.length; i++) {
            if (i === 2) values[i] = +values[i];
            if (i === 3) values[i] = booleanCheck(values[i]);
            if (i === 4) values[i] = +values[i];
            if (i === 5) values[i] = +values[i];
            if (i === 6) values[i] = booleanCheck(values[i]);
            if (i === 7) values[i] = booleanCheck(values[i])
        }

        return values;
    });

    const bingo_card = {
        id: bingo_id,
        start_date: req.body.startDate,
        end_date: req.body.endDate,
        privacy: req.body.privacy,
        club: req.body.club,
        creator: username,
        title: req.body.title,
        description: req.body.description,
        rowsNum: req.body.rows,
        colsNum: req.body.cols,
    }
    console.log(bingo_card)
    console.log(challengesNestedArr)
    console.log(bingo_challenges)
    connection.beginTransaction(err => {
        if (err) {
            console.log(err)
            return next(err);
        }
        connection.query('INSERT INTO bingo_card SET ?', bingo_card, (err, result) => {
            if (err) {
                console.log(err)
                console.log('failing at insert to bingo card');
                connection.rollback(() => {
                    return next(err);
                });
            }
            console.log(result)
            connection.query('INSERT INTO challenges (challenge_id,title,score,gps,distance,elevation,photo,user_description,description) VALUES ?', [challengesNestedArr], (err, results) => {
                if (err) {
                    console.log(err)
                    console.log('failing at insert into challenges');
                    connection.rollback(() => {

                        return next(err);
                    });
                }
                console.log(result)
                connection.query('INSERT INTO bingo_challenge (id,challenge_id,bingo_id,rowNum,colNum) VALUES ?', [bingo_challenges], (err, ress) => {
                    if (err) {
                        console.log(err)
                        console.log('failing at bingo challenge insert');
                        connection.rollback(() => {
                            return next(err);
                        });
                    }
                    connection.commit(err => {
                        if (err) {
                            console.log(err)
                            connection.rollback(() => {
                                return next(err);
                            });
                        }
                        console.log('committed');
                        res.send({
                            data: 'success'
                        })
                    })
                })
            })
        })
    })

})
//get all group challenges with global privacy and end date is after today
router.get('/group', auth, (req, res, next) => {
    const username = req.userData.username;
    const global = 'global'
    connection.query(`SELECT b.club, b.id,b.end_date,b.creator,b.description,b.title,b.id, COUNT(c.challenge_id) FROM bingo_card b 
    INNER JOIN bingo_challenge a ON (b.id = a.bingo_id)
    INNER JOIN challenges c ON (a.challenge_id = c.challenge_id) 
    WHERE b.end_date > NOW()
    AND b.privacy = ${connection.escape(global)}
    GROUP BY b.id`, (err, result) => {
        if (err) return next(err)
        res.json(result)
    })
});
//get bingo card 
router.get('/group/:card_id', checkCardExpire, auth, (req, res, next) => {
    const id = req.params.card_id;
    const expire = req.expire
    console.log(expire, 'expiredd')
    connection.query(`SELECT b.rowsNum,b.colsNum, a.rowNum, a.colNum,  b.id, c.challenge_id, b.start_date, b.end_date, b.title AS card_title, b.creator, b.description as card_description, c.title AS challenge_title, c.description as challenge_description, c.gps, c.photo, c.user_description, c.distance, c.elevation 
    FROM bingo_card b 
    INNER JOIN bingo_challenge a ON (b.id = a.bingo_id)
    INNER JOIN challenges c ON (a.challenge_id = c.challenge_id)
    WHERE b.id = ${connection.escape(id)}`, (err, result) => {
        if (err) return next(err);
        res.json(result)
    })
});
//add user to bingo card
router.post('/group/addUser/:id', auth, (req, res, next) => {
    const card_id = req.params.id;
    const username = req.userData.username;

    const data = {
        card_id,
        username
    }
    connection.query('INSERT INTO athlete_joins_card SET ?', data, (err, result) => {
        if (err) return next(err);
        res.redirect('/challenges/group/joined')
    })
});
//get card details
router.get('/group/details/:card_id/:id', cardExpireCheck, auth, (req, res, next) => {
    const {
        id,
        card_id
    } = req.params;
    const expired = req.expire
    // console.log(id, card_id)
    connection.query(`SELECT c.title,c.score,c.gps,c.challenge_id,c.distance,c.elevation,c.photo,c.user_description,c.description, a.start_date,a.end_date,a.creator FROM challenges c INNER JOIN bingo_challenge b
    ON (c.challenge_id = b.challenge_id)
    INNER JOIN bingo_card a ON (a.id = b.bingo_id)
    WHERE c.challenge_id = ${connection.escape(id)}`, (err, result) => {
        if (err) return next(err);
        console.log(result)
        res.json({
            data: result,
            expired: expired
        })
    })
});
//check user has joined card
router.get('/group/checkUserJoined/:id', auth, (req, res, next) => {
    const username = req.userData.username;
    const cardId = req.params.id
    connection.query(`SELECT * FROM athlete_joins_card WHERE username=${connection.escape(username)} AND card_id =${connection.escape(cardId)}`, (err, result) => {
        if (err) {
            console.log(err)
            return next(err)
        };
        result.length === 0 ? res.send({
            data: 'not Joined'
        }) : res.send({
            data: 'joined'
        })

    })
});
//add row with user attached
router.post('/group/addRow', auth, (req, res, next) => {
    console.log('adding row')
    const {
        username
    } = req.userData;
    console.log(username);
    const {
        card_id,
        row_num
    } = req.body
    console.log(card_id, row_num)
    const data = {
        row_no: row_num,
        card_id: card_id,
        username: username,
        score: 5
    }
    console.log(data)
    connection.query(`INSERT INTO completes_row SET?`, data, (err, result) => {
        if (err) {
            console.log(err)
            return next(err)
        }
        console.log(result)
        res.redirect(`/challenges/group/rowsAndCols/${card_id}`)
    })

})
//get number of rows and col for card
router.get('/group/RowsAndCols/:id', auth, (req, res, next) => {
    const {
        username
    } = req.userData;
    const cardId = req.params;
    console.log(username, cardId.id)
    let numOfRows;
    let numOfCols

    connection.beginTransaction(err => {
        if (err) return next(err)
        connection.query(`SELECT COUNT(row_no) AS numOfRows FROM completes_row WHERE username=${connection.escape(username)} AND card_id =${connection.escape(cardId.id)}
        GROUP BY username`, (err, results) => {
            if (err) {
                connection.rollback(() => {
                    return next(err)
                })
            }
            console.log(results)
            results.length === 0 ? numOfRows = 0 : numOfRows = results[0].numOfRows
            connection.query(`SELECT COUNT(col_no) AS numOfCols FROM completes_col WHERE username=${connection.escape(username)} AND card_id = ${connection.escape(cardId.id)}
            GROUP BY username`, (err, result) => {
                if (err) {
                    connection.rollback(() => {
                        return next(err)
                    })
                }
                console.log(result)
                result.length === 0 ? numOfCols = 0 : numOfCols = result[0].numOfCols
                connection.commit(err => {
                    if (err) {
                        connection.rollback(() => {
                            return next(err);
                        });
                    }
                    //console.log(numOfCols)
                    //console.log(numOfRows)
                    const data = {
                        rows: numOfRows,
                        cols: numOfCols

                    }
                    res.json(data)
                    console.log('committed')
                })
            })
        })
        //get the count of both rows and cols - send back to the client for leaderboard
    })
})
//insert user with complete card
router.post('/group/cardComplete', auth, (req, res, next) => {
    const {
        username
    } = req.userData;
    const {
        card_id
    } = req.body;
    console.log(username, "this is for completion")
    console.log(card_id)
    const data = {
        id: 0,
        card_id: card_id,
        username: username
    }
    connection.query(`INSERT INTO completes_card SET ?`, data, (err, results) => {
        if (err) {
            console.log(err)
            return next(err)
        }
        console.log(results)
        res.send({
            data: 'it worked'
        });
    })

})
//add col and username
router.post('/group/addCol', auth, (req, res, next) => {
    const {
        username
    } = req.userData;
    const {
        card_id,
        col_num
    } = req.body;
    const data = {

        col_no: col_num,
        card_id: card_id,
        username: username,
        score: 5
    }
    console.log(data)
    connection.query(`INSERT INTO completes_col SET?`, data, (err, result) => {
        if (err) return next(err);
        console.log(result);
        res.redirect(`/challenges/group/rowsAndCols/${card_id}`)

    })

})
//get overall rep score
router.get(`/group/overallScore/:id`, auth, (req, res, next) => {
    const cardId = req.params.id
    const username = req.userData.username
    connection.beginTransaction((err) => {
        if (err) return next(err)
        connection.query(`SELECT SUM(score) as overallScore, c.username FROM completes_challenge c INNER JOIN bingo_challenge i ON (c.challenge_id = i.challenge_id)
        INNER JOIN bingo_card b ON (b.id = i.bingo_id)
        WHERE b.id = ${connection.escape(cardId)}
        group by c.username;`, (err, result) => {
            if (err) return next(err);
            //
            const total = result
            console.log(total)

            connection.query(`SELECT SUM(score) as rowsScore,username FROM completes_row WHERE card_id = ${connection.escape(cardId)}
            group by username`, (err, results) => {
                if (err) {
                    connection.rollback(() => {
                        console.log(err)
                        return next(err)
                    })
                }
                console.log(results)
                total.forEach(total => {
                    results.forEach(result => {
                        if (total.username === result.username) total.overallScore += result.rowsScore;
                    })
                })
                connection.query(`SELECT SUM(score) as colsScore, username FROM completes_col WHERE card_id =${connection.escape(cardId)}
                    GROUP BY username`, (err, resultss) => {
                    if (err) {
                        connection.rollback(() => next(err))

                    }
                    total.forEach(tot => {
                        resultss.forEach(el => {
                            if (tot.username === el.username) tot.overallScore += el.colsScore;
                        })
                    })
                    connection.commit((err) => {
                        if (err) {
                            connection.rollback(() => next(errors))
                        }
                        res.json({
                            data: total,
                            username: username
                        })
                    })

                })




            })
        })
    })

})
//get total cols
router.get(`/group/allCols/:id`, auth, (req, res, next) => {
    const {
        username
    } = req.userData;
    const card_id = req.params.id;
    console.log(card_id, username);
    connection.query(`SELECT COUNT(col_no) as overallScore,username FROM completes_col WHERE card_id =${connection.escape(card_id)} GROUP BY username`, (err, result) => {
        if (err) return next(err);
        res.json(result)
    })
})
//get total rows
router.get(`/group/allRows/:id`, auth, (req, res, next) => {
    const {
        username
    } = req.userData;
    const card_id = req.params.id;
    console.log(card_id, username);
    connection.query(`SELECT COUNT(row_no) as overallScore,username FROM completes_row WHERE card_id =${connection.escape(card_id)} GROUP BY username`, (err, result) => {
        if (err) return next(err);
        res.json(result)
    })
})
//delete single challenge
router.post('/single/delete/:id', auth, (req, res, next) => {
    const {
        username
    } = req.userData;
    const challengeId = req.params.id;
    console.log(challengeId);
    connection.query(`DELETE FROM individual WHERE individual_id = ${connection.escape(challengeId)}`, (err, result) => {
        console.log(err)
        if (err) return next(err);
        console.log(result)
        res.redirect('/challenges/single/userCreated');
    })
});
router.post('/submission/delete/:id/:type', auth, (req, res, next) => {
    const sub_id = req.params.id
    const {
        type
    } = req.params
    const {
        username
    } = req.userData;
    let newType;
    type === "single" ? newType = "single" : newType = "group"
    const {
        challenge,
        cardId,
        row,
        col
    } = req.body
    console.log(newType, challenge, cardId, row, col)
    //console.log(sub_id,challenge)
    //console.log('deleting',cardId,row,col);
    const falsey = 0;
    //console.log(sub_id,type)
    if (type === 'single') {
        connection.query(`UPDATE completes_challenge SET isValid = ${connection.escape(falsey)} WHERE id =${connection.escape(sub_id)}`, (err, result) => {
            if (err) return next(err)
            console.log(result)
            res.redirect(`/challenges/single/all/${challenge}`);
        })
    }
    if (type !== "single") {
        connection.beginTransaction((err) => {
            if (err) return next(err)
            connection.query(`UPDATE completes_challenge SET isValid = ${connection.escape(falsey)} WHERE id =${connection.escape(sub_id)}`, (err, result) => {
                if (err) {
                    console.log(err)
                    connection.rollback(() => next(err))
                }
                connection.query(`DELETE FROM completes_col WHERE username = ${connection.escape(username)} 
            AND card_id = ${connection.escape(cardId)}
            AND col_no =${connection.escape(col)}`, (err, ress) => {
                    if (err) {
                        console.log(err)
                        connection.rollback(() => next(err))
                    }
                    console.log(ress)
                    connection.query(`DELETE FROM completes_row WHERE username=${connection.escape(username)}
                AND card_id =${connection.escape(cardId)}
                AND row_no = ${connection.escape(row)}`, (err, resss) => {
                        if (err) {
                            console.log(err)
                            connection.rollback(() => next(err))
                        }
                        connection.query(`DELETE FROM completes_card WHERE card_id = ${connection.escape(type)}
                    AND username=${connection.escape(username)}`, (err, resultsss) => {
                            if (err) {
                                connection.rollback(() => next(err))
                            }
                            connection.commit((err) => {
                                if (err) {
                                    connection.rollback(() => next(err))
                                }
                                console.log('commit')
                                res.redirect(`/challenges/single/all/${challenge}`);

                            })
                        })
                    })
                })
            })
        })
    }

});
//check if user has complete challenge
router.get('/group/completeCheck/:card_id', checkCardExpire, auth, (req, res, next) => {
    const {
        username
    } = req.userData;
    const {
        card_id
    } = req.params
    const expired = req.expire
    connection.query(`SELECT * FROM completes_card WHERE card_id = ${connection.escape(card_id)} AND username=${connection.escape(username)}`, (err, result) => {
        if (err) return next(err)

        if (result.length > 0) return res.json({
            data: 'complete',
            expired: expired
        })
        res.json({
            data: "incomplete",
            expired: expired
        });
    })
})

router.get('/single/completed/all', auth, (req, res, next) => {
    const {
        username
    } = req.userData
   
    connection.query(`SELECT c.title,c.challenge_id,c.score,c.gps,c.distance,c.elevation,c.photo,c.user_description,c.description,i.start_date,i.end_date,i.privacy,i.club,i.creator FROM challenges c 
    INNER JOIN individual i ON (c.challenge_id = i.challenge_id)
    INNER JOIN completes_challenge h ON (c.challenge_id = h.challenge_id)
    WHERE h.username = ${connection.escape(username)}`, (err, results) => {
        if (err) {
            console.log(err)
            return next(err)
        }
        console.log(results)
    })
})
module.exports = router;
