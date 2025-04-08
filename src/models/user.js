const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 50,
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(val) {
            return validator.isEmail(val);
        }
    },
    password: {
        type: String,
        required: true,
        validate(val) {
            if(!validator.isStrongPassword(val)){
                throw new Error('Please enter a strong password');
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'Other'],
            message: '{VALUE} is not valid'
        },
        validate(value) {
            if(!['male', 'female', 'Other'].includes(value)){
                throw new Error('Gender data is not valid');
            }
        }
    },
    photoUrl: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCpY5LtQ47cqncKMYWucFP41NtJvXU06-tnQ&s',
        validate(val) {
            if(!validator.isURL(val)){
                throw new Error('Photo URL is not valid');
            }
        }
    },
    about: {
        type: String,
        default: 'This is the default about of the user!',
    },
    skills: {
        type: [String],
        validate(val) {
            return val.length <= 10;
        }
    }
}, {
    timestamps: true,
});

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({ _id: user._id }, 'Abrakadabra', {expiresIn: '7d'});

    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
};

const User = mongoose.model('User', userSchema);
module.exports = User;