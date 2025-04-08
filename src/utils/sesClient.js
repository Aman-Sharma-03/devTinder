const {SESClient} = require('@aws-sdk/client-ses');
const REGION = 'ap-south-1';

// How to pass the config in v3
const sesClient = new SESClient({
    region: REGION, 
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});

// How to pass the config in v2
// const sesClient = new SESClient({
//     region: REGION, 
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_KEY,
// });

module.exports = {sesClient};