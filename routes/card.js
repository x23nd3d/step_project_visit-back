const {Router} = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const authHeaders = require('../middleware/authHeaders');
const router = Router();

router.post('/add', auth, async (req, res) => {
    const user = await User.findOne({
        '_id': req.jwtUserID
    });
    console.log('USer', req.jwtUserID, user);
    console.log('CARD', req.body.card);
    await user.addToCard(req.body.card);
    console.log(user, 'UPDATED USER');


    res.json(user.visits);

});


router.get('/show', authHeaders, async (req, res) => {
    const user = await User.findOne({
        '_id': req.jwtUserIDH
    });
    console.log('userID', user)
    res.json(user.visits);
});

module.exports = router;