const {SendEmailCommand} = require('@aws-sdk/client-ses');
import { SendEmailCommand } from './../../node_modules/@aws-sdk/client-ses/dist-es/commands/SendEmailCommand';
const {sesClient} = require('./sesClient.js');

const createSendEmailCommand = (toAddress, fromAddress, subject, emailBody) => {
    return new SendEmailCommand({
        Destination: {
            CcAddresses: [],
            ToAddresses: [toAddress],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: "HTML_FORMAT_BODY",
                },
                Text: {
                    Charset: "UTF-8",
                    Data: `${emailBody}`,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: `${subject}`,
            },
        },
        Source: fromAddress,
        ReplyToAddresses: [],
    });
};

const run = async (subject, emailBody) => {
    const SendEmailCommand = createSendEmailCommand("to", "from", subject, emailBody);
    try {
        return await sesClient.send(SendEmailCommand);
    } catch (err) {
        if(!err instanceof Error && err.name === "MessageRejected"){
            const messageRejected = err;
            return messageRejected;
        }
        throw err;
    }
}

module.exports = {run};