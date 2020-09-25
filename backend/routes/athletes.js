const {
    Router
} = require('express');
const multer = require('multer');
const upload = multer({
    dest: '../images'
})
const fileUpload = require('express-fileupload');
const togeojson = require('@mapbox/togeojson');
const domParser = require('xmldom').DOMParser;
const path = require('path');
const parseGpx = require('parse-gpx');
const parser = require('xml2json');
const checkAuth = require('../middleware/check-auth');
const {
    QuantifiedSelfLib
} = require('quantified-self-lib')
const athletesController = require('../controllers/athletesController');
const auth = require('../middleware/check-auth')
const connection = require('../db/index');
const {
    returnDistance
} = require('../helperFunctions/gpsParser');

//THESE ROUTES PERTAIN TO ATHLETE FUNCTION

const router = Router();
router.use(fileUpload())

//THIS IS TEST CODE AND NOT USED
router.post('/image', (request, response, next) => {
    //https://www.js-tutorials.com/nodejs-tutorial/nodejs-example-upload-store-image-mysql-express-js/
    const file = request.files.file
    const fileName = file.name
    const gpx = request.files.gpx;

    //console.log(gpx);
    console.log(gpx.data)
    //FIT FILE TRANSFER
    //QuantifiedSelfLib.importFromFit(gpx.data).then((event)=>{
    // do Stuff with the file
    //  console.log(event.activities[0].streams);
    //});

    //THIS IS FOR GPX to change to xml
    const xml = Buffer.from(gpx.data).toString();
    //transfer to json
    const json = parser.toJson(xml);
    const obj = JSON.parse(json)
    response.json(obj)

    //console.log(xml)


    // got the file 
    // const name = 'Billy' //got the body
    // file.mv(`public/images/profile_image/${fileName}`);
    //console.log(fileName);
    //inser the file and the users name 
    /* pool.query(
         `INSERT INTO userimage (img,name) VALUES($1,$2)`,[file,name], (err,res) => {
             if(err) return next(err)

             response.send('image added');

         }
     )*/
})
//TEST CODE
router.get('/image', (request, response, next) => {
    //console.log('yo')
    //this is a test 
    //get the image from the database
    const name = 'Billy'

    pool.query(`SELECT img FROM userimage WHERE name=$1`, [name], (err, res) => {
        if (res.rows.length === 0) return next(err)

        response.json({
            success: true,
            data: res.rows[0]
        })
    })
});
//Gets peronal profile
router.get('/profile/personal', auth, athletesController.fetchPersonalProfile)
//Updates privacy on profile (not used but maybe in the future)
router.put('/update/privacy', auth, (req, res, next) => {
    const username = req.userData.username
    const {
        private
    } = req.body;
    let setter;
    private ? setter = 1 : setter = 0;
    console.log(setter)
    connection.query('UPDATE USERS SET isPrivate = ? WHERE username =  ? ', [setter, username], (err, result) => {
        if (err) return next(err)
        //console.log('working')
        //console.log(result);
        res.send({
            message: 'private'
        })
    })


})
//get all single joined
router.get('/check/userJoin/:id', auth, (req, res, next) => {
    const completeId = req.params.id;
    const username = req.userData.username;
    console.log(completeId, username)
    connection.query(`SELECT * FROM athlete_joins_challenge WHERE username = ${connection.escape(username)} AND individual_id = ${completeId}`, (err, result) => {
        if (err) next(err);
        result.length > 0 ? res.send({
            message: true
        }) : res.send({
            message: false
        })

    })
})
//get all challenges complete from a bingo card
router.get('/checkCompleteChallenges/:id', auth, (req, res, next) => {
    console.log('arrived')
    const cardId = req.params.id;
    const username = req.userData.username;
    const valid = 1
    console.log(username)
    connection.query(`SELECT c.challenge_id From completes_challenge c INNER JOIN bingo_challenge b 
    ON (c.challenge_id = b.challenge_id)
    INNER JOIN bingo_card a ON (a.id = b.bingo_id)
    WHERE c.username=${connection.escape(username)} AND a.id = ${connection.escape(cardId)} AND c.isValid = ${connection.escape(valid)} `, (err, result) => {
        if (err) return next(err);
        res.json(result)
    })
})
//search for username 
router.get('/search/:id', (req, res, next) => {
    const searchQuery = req.params.id;
    const query = '%' + searchQuery + '%';
    connection.query(`SELECT username from USERS WHERE username LIKE ${connection.escape(query)}`, (err, result) => {
        if (err) {
            console.log(err)
            return next(err)
        };
        res.json(result)
    })

})
//add new request to the database
router.post('/sendRequest/:id', auth, (req, res, next) => {
    const requestee = req.params.id;
    const requester = req.userData.username;
    console.log(requestee, requester);
    const data = {
        id: 0,
        requstee: requestee,
        requester: requester,
        accepted: 0,
        pending: 1
    }
    connection.query(`INSERT INTO friend_requests SET ?`, data, (err, result) => {
        if (err) return next(err);
        console.log(result)
        res.send({
            success: 'success'
        })
    })
})
//get the users username
router.get('/self', auth, (req, res, next) => {
    const username = req.userData.username;
    res.send({
        username: username
    })
})
//gets all requestes sent and recieved
router.get('/checkRequests', auth, (req, res, next) => {
    const username = req.userData.username;
    console.log('checking');
    connection.query(`SELECT * FROM friend_requests WHERE requstee = ${connection.escape(username)} OR requester =${connection.escape(username)}`,
        (err, result) => {
            if (err) return next(err);
            res.json(result)
        })
})
//accepts the request end-point
router.post('/acceptRequest/:id', auth, (req, res, next) => {
    const username = req.userData.username;
    const requester = req.params.id;

    const data = {
        friend1: username,
        friend2: requester
    }
    connection.beginTransaction(err => {
        if (err) return next(err)
        connection.query('INSERT INTO Friends_with SET ?',data, (err, result) => {
            if (err) {
                connection.rollback(() => next(err))
            }
            const updateData = [0, 1, requester, username];
            connection.query(`UPDATE friend_requests SET pending=?,accepted=? WHERE requester =? AND requstee=?`, updateData, (err, result)=> {
                if(err){
                    connection.rollback(()=>next(err))
                }
                connection.commit(err => {
                    if(err){
                    connection.rollback(() => next(err))
                }
                console.log('committed')
                })
            })
            })
    })

    res.send({
        message: "success"
    });
})
//gets all the requestes
router.get('/getFriendRequests',auth,(req,res,next)=> {
    const username = req.userData.username;
    console.log(username);
    console.log('requests')
    const truth = 1;
    connection.query(`SELECT requester as username FROM friend_requests WHERE requstee = ${connection.escape(username)} AND pending=1`,(err,result) => {
        if(err)return next(err)
        res.json(result)
    })
})
//rejects the request 
router.post('/rejectRequest/:id',auth,(req,res,next) => {
    const requester = req.params.id;
    const requstee = req.userData.username;
    console.log(requester,requstee);
    connection.query(`DELETE FROM friend_requests WHERE requester = ${connection.escape(requester)} AND requstee=${connection.escape(requstee)}`,(err,result)=> {
        if(err)return next(err)
        res.send({success:'success'})
    })


})
//get all friends
router.get('/friends',auth,(req,res,next) => {
    const {username} = req.userData;
    console.log(username,'friends!')
    //console.log(username);
    connection.query(`SELECT * FROM Friends_with WHERE friend1=${connection.escape(username)} OR friend2=${connection.escape(username)}`,(err,result)=> {
        if(err){
            console.log(err)
            return next(err);
        }

        //console.log(result)
        console.log(result)
        const friends = result.map(obj => {
            const newObj = {

            }
            if(obj['friend1'] !== username)newObj.username =  obj['friend1'];
            if(obj['friend2'] !== username)newObj.username =  obj['friend2'];
            return newObj
        })
        //console.log(friends)
        console.log(friends)
        res.json(friends)
    })
    
})
//unfollow a friend
router.post('/friends/unfollow', auth,(req,res,next) => {
    const {username} =req.userData;
    const {friend} =req.body;
    //console.log(username,friend)
    connection.beginTransaction(err=>{
        if(err)return next(err)
        connection.query(`DELETE FROM Friends_with WHERE friend1=${connection.escape(username)} AND friend2 =${connection.escape(friend)}
        OR friend1=${connection.escape(friend)} AND friend2=${connection.escape(username)}`,(err,result) => {
            if(err){
                connection.rollback(() => {
                    return next(err)
                })
            }
            console.log(result)
            connection.query(`DELETE FROM friend_requests WHERE requstee=${connection.escape(username)} AND requester=${connection.escape(friend)}
            OR requstee=${connection.escape(friend)} AND requester=${connection.escape(username)}`,(err,results)=> {
                if(err){
                    connection.rollback(() => {
                        return next(err)

                    })
                }
                console.log(results)
                connection.commit((err) => {
                    if(err){
                        connection.rollback(()=>{
                            return next(err)
                        })
                    }
                    res.redirect('/athletes/friends');
                    console.log('commited')
                })
            })
         
            
        })
    })
   
})
//get all joined clubs for an athlete 
router.get('/clubs',auth,(req,res,next) => {
    const {username} = req.userData;
    //console.log(username)
    connection.query(`SELECT * FROM follows_club WHERE username = ${connection.escape(username)}`,(err,result) => {
        if(err)return next(err)
       // console.log(result)
        const clubnames = result.map(obj => {
          //  console.log(obj)
          const newObj = {}
            newObj.username = obj.clubname;
            return newObj
        })
        //console.log(clubnames)
        res.json(clubnames)
    })
})
//unfollow a club
router.post('/club/unfollow',auth,(req,res,next) => {
    const {username} = req.userData;
    const {club} = req.body
    console.log(username,club)
    connection.query(`DELETE FROM follows_club WHERE clubname=${connection.escape(club)} AND username=${connection.escape(username)}
    `,(err,result) => {
        if(err)return next(err);
        console.log(result)
        res.redirect('/athletes/clubs');
    })
})
//get user total repuation
router.get('/totalReputation', auth,(req,res,next) => {
    console.log('arriving')
    const {username} = req.userData;
    
    const scores = [];
    connection.beginTransaction((err) => {
        if(err){console.log(err);return next(err)}
        console.log('started')
        const truthy = 1;
        connection.query(`SELECT SUM(score) as challengeScore FROM completes_challenge WHERE username = ${connection.escape(username)} AND isValid = ${connection.escape(truthy)} GROUP BY username`,(err,result) => {
            if(err){
                connection.rollback(()=>{console.log(err);return next(err)})
              
            }
            console.log(result)
            if(result.length > 0){
            if(result[0].challengeScore)scores.push(result[0].challengeScore)
            }

            connection.query(`SELECT SUM(score) as RowScore FROM completes_row WHERE username = ${connection.escape(username)} GROUP BY username`,(err,results)=> {
                if(err){
                    console.log(err)
                    return next(err)
                }
                console.log(results)
                if(results.length>0){
                if(results[0].RowScore)scores.push(results[0].RowScore)
                }
                
                connection.query(`SELECT SUM(score) as ColScore FROM completes_col WHERE username =${connection.escape(username)} GROUP BY username`,(err,resultss) => {
                    if(err){
                        console.log(err)
                        return next(err)
                    }
                    console.log(resultss)
                    if(resultss.length > 0){
                    if(resultss[0].ColScore)scores.push(resultss[0].ColScore);
                    }
                    console.log(scores)
                    connection.commit((err)=>{
                        if(err){
                            connection.rollback(()=> next(err))
                        }
                        console.log('commited')
                        let total = 0
                        if(scores.length > 0){
                        total = scores.reduce((acc,current)=> acc+current,0);
                        }
                        res.json({data:total})
                    })
                })
               
            })

            
        })
    } )
})
module.exports = router;