const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../db/index')
const atob = require('atob')


exports.register_user = (request, response, next) => {
    //get the user details sent
    const {
        username,
        email,
        password
    } = request.body;
    const newPass = atob(password); //decrypt the password
    //hash the password  
    bcrypt.hash(newPass, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            })
        } else {
            //if hash succesful
            const user = {
                username: username,
                email: email,
                pswrd: hash,
                isPrivate: 0
            }
            connection.query('INSERT INTO USERS SET ?', user,
                (err, res) => {
                    if (err) return next(err);
                    response.send('You are registered'); //if succesful- redirect the repsonse to the get request
                }
            )
        }
    })
}
exports.login_user = (request, response, next) => {
    //get the login details
    //console.log('YO')
    const arr = request.params.id.split(',')
    const username = arr[0];
    let password = arr[1];

    // console.log(username)

    //send query to the database - get user with username
    connection.query('SELECT * FROM USERS WHERE username=' + connection.escape(username),
        (err, result) => {

            if (result.length === 0) return next(err)
            if (!result[0].username) return next(err) //if doesnt exist
            //get hashed password from databse result
            let hashPass = result[0].pswrd;
            //decrypt the password sent 
            let sentPassword = atob(password);

            //compare the passwords to understnad if it is a valid user 
            bcrypt.compare(sentPassword, hashPass, (err, res) => {
                if (err) return next(err)
                if (res) {
                    //if success - create new token
                    //console.log('succesful')
                    const token = jwt.sign({
                        email: result[0].email,
                        username: result[0].username
                    }, process.env.TOKEN_KEY, {
                        expiresIn: "3h" //expire time
                    })
                    //send back username and token 
                    response.status(200).json({
                        username: result[0].username,
                        token: token
                    })
                } else {
                    //if error send error status
                    response.sendStatus(500)
                }

            })

        }

    )
}