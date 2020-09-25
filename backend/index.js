
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Protectedroutes = require('./routes');
const path = require('path');
const authController = require('./controllers/authController');
const jwt = require('jsonwebtoken');
const checkAuth = require('./middleware/check-auth');

function ignoreFavicon(req, res, next) {
    if (req.originalUrl === '/favicon.ico') {
      res.status(204).json({nope: true});
    } else {
      next();
    }
  }
app.use(ignoreFavicon); //this removes the favicon error

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000})); //this was increased to accommodate the size of parameter 
app.use(express.static(path.join(__dirname, 'public')));

app.post('/authcheck/me', (req,res) => {
  const token = req.body.token;
  //verify 
  
  try {
    var decoded = jwt.verify(token, process.env.TOKEN_KEY);
    if(decoded)return res.status(200).send({message: 'authenticated'});
  } catch(err) {
    // errr 
    console.log(err);
    return res.status(408).send({message: 'invalid token'});
  }
})
//unauthenicated routes register end point
app.post('/register', authController.register_user);
//login end point
app.get('/login/:id', authController.login_user);

//all other routes channl through the protected routes middleware
app.use('/',Protectedroutes);

//test to see how the headers work
app.get('/headerTest', checkAuth, (req,res) => {
  
 
  console.log('it is auth')
  console.log(req.userData)


})


app.use((err,req,res,next) => {
  //error middleware
  return res.status(401).json(err);
});


app.listen(22048);
console.log('listening');

//need to do routes, but this will do for now
