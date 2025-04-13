const { SendEmailCommand } = require('@aws-sdk/client-ses');
const { sesClient } = require('./sesClient.js');

const createSendEmailCommand = (toAddress, fromAddress, subject, emailBody) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: 'HTML_FORMAT_BODY',
        },
        Text: {
          Charset: 'UTF-8',
          Data: `${emailBody}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `${subject}`,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

const run = async (subject, emailBody) => {
  const SendEmailCommand = createSendEmailCommand(
    'to',
    'from',
    subject,
    emailBody
  );
  try {
    return await sesClient.send(SendEmailCommand);
  } catch (err) {
    if (err.name === 'MessageRejected') {
      console.log('Email not sent: Message rejected by SES.');
      return {
        success: false,
        message: 'Email not sent: Message rejected by SES.',
      };
    } else if (err.name === 'InvalidClientTokenId') {
      console.log('Email not sent: Invalid AWS credentials.');
      return {
        success: false,
        message: 'Email not sent: Invalid AWS credentials.',
      };
    } else if (err.name === 'AccessDenied') {
      console.log('Email not sent: Access denied.');
      return { success: false, message: 'Email not sent: Access denied.' };
    } else {
      console.log('Email not sent: An unexpected error occurred.', err.message);
      return {
        success: false,
        message: 'Email not sent: An unexpected error occurred.',
      };
    }
  }
};

module.exports = { run };
