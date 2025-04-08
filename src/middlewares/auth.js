const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try{
        const {token} = req.cookies;
        if(!token){
            return res.status(401).send('Please Login');
        }

        const {_id} = jwt.verify(token, 'Abrakadabra');
    
        const user = await User.findOne({_id});
        if(!user) {
            throw new Error('User not found');
        }
        req.user = user;
        next();
    } catch(err) {
        res.status(400).send(err.message);
    }

};

module.exports = {userAuth};