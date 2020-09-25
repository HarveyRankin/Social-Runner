const auth = require('../middleware/check-auth')
const connection = require('../db/index');
const {
    Router
} = require('express');
const router = Router();

//create a new club in the database
router.post('/createClub/:id', auth, (req, res, next) => {
    const clubname = req.params.id;
    const creator = req.userData.username;
    const data = {
        clubname,
        creator
    }
    
    //create and add to the club
    connection.query('INSERT INTO clubs SET ?', data, (err, result) => {
        if (err) return res.send({
            success: 'failed'
        })
        const formatted = {
            clubname: clubname,
            username: creator
        }
        connection.query('INSERT INTO follows_club SET ?', formatted, (err, result) => {
            if (err) return next(err)
            res.send({
                success: "Club Created"
            })
        })
    })
})
//search club from the database
router.get('/queryClubs/:id', auth, (req, res, next) => {
    const searchQuery = req.params.id;
    const query = '%' + searchQuery + '%';
    connection.query(`SELECT clubname FROM clubs WHERE clubname LIKE ${connection.escape(query)}`, (err, result) => {
        if (err) return next(err);
        res.json(result)
    })
})
//join club 
router.post('/join/:id', auth, (req, res, next) => {
    const clubname = req.params.id;
    const username = req.userData.username;
    const data = {
        clubname,
        username
    };
    connection.query(`INSERT INTO follows_club SET ?`, data, (err, result) => {
        if (err) return next(err);
        console.log(result)
        res.send("Joined");
    });
})
//check if user is follwowing the club
router.get('/checkIfFollow', auth, (req, res, next) => {
    const username = req.userData.username;
    connection.query(`SELECT clubname FROM follows_club WHERE username=${connection.escape(username)}`, (err, result) => {
        if (err) return next(err);
        console.log(result)
        res.json(result)
    })
})

module.exports = router;