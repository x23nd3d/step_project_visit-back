const {Router} = require('express');
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const candidate = await User.findOne({ email });

        if (candidate) {
            res.json('User already registered');
        } else {
            if (!password.length) {
                return res.json({status:"nopassword"})
            }
            if (!email.length) {
                return res.json({status:"noemail"})
            }
            const hashPassword = await bcrypt.hash(password, 10);
            const user = new User({
                email,
                password: hashPassword,
                visits:[]
            })
            await user.save();
            res.status(200).json(user);
        }

    } catch (e) {
        console.log('Error', e)
    }




});


router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        const candidate = await User.findOne({ email });

        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password);

            if (areSame) {
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) {
                        throw err;
                    } else {
                        const token = jwt.sign({
                                userId: candidate.id
                            }, 'test',
                            {expiresIn: '3h'});
                        res.json({ token, userId:candidate, status: 'Success' })
                        // res.json(req.session.user);
                    }
                });



            } else {
                res.redirect('/auth/login');
            }
        } else {
            res.redirect('/auth/login')
        }
    } catch (e) {
        console.log('Error', e)
    }
});

router.post('/sayHi', auth, async (req, res) => {

    console.log(req.session.user);
    console.log(jwt.token);
    const user = await User.findOne({
        '_id': req.jwtUserID
    });

    console.log('USer', req.jwtUserID, user)

    if (!user.visits.length) {
        res.json(
            `Hello, ${user.email}!, here is your visits list: {{You have no visits for now}}`
        )
    } else {
        res.json(
            `Hello, ${user.email}!, here is your visits list: ${user.visits}`
        )
    }

});

router.post('/check', auth, async (req, res) => {
    const user = await User.findOne({
        '_id': req.jwtUserID
    });
    if (user) {
        res.json({status: true})
    } else {
        res.json({status: false})
    }
});


router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.json('Session Destroyed');
    });
});


module.exports = router;