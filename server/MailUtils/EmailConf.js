const { SESClient, SendEmailCommand, conf } = require("@aws-sdk/client-ses");
const SES_CONFIG = {
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.SES_KEY,
        secretAccessKey: process.env.SES_SEC
    }
};

const SendEmail = async (subject, body, toAddressList) => {


    const client = new SESClient(SES_CONFIG);

    const input = {
        "Destination": {
            "ToAddresses": toAddressList
        },
        "Message": {
            "Body": {
                "Html": {
                    "Charset": "UTF-8",
                    "Data": `${body}`
                }
            },
            "Subject": {
                "Charset": "UTF-8",
                "Data": `${subject}`
            }
        },
        "Source": process.env.AWS_SOURCE_EMAIL
    };

    const command = new SendEmailCommand(input);
    return (await client.send(command))
}
module.exports = { SendEmail }