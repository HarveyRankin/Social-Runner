const {Router} = require('express');
const athletes = require('./athletes');
const challenges = require('./challenges');
const clubs = require('./clubs');


const router = Router();

router.use('/athletes',athletes);
router.use('/challenges', challenges);
router.use('/clubs',clubs)

module.exports = router;