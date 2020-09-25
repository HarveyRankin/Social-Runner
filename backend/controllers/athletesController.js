const connection = require('../db/index');

exports.fetchPersonalProfile = (req, res) => {

    const {
        username
    } = req.userData;

    connection.query(
        'SELECT * FROM USERS WHERE username=' + connection.escape(username),
        (err, result) => {
            if (err) return next(err)
            if (result) {
                //console.log(result[0])
                res.json({
                    username: result[0].username,
                    isPrivate: result[0].isPrivate
                })
            }
        }
    )

}