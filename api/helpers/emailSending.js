import nodemailer from "nodemailer";

async function sendEmail(email, subject, body) {
    try {
        return new Promise((resolve, reject) => {
            // ********************* For Simple Auth gmail ***************************
            var transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                port: 465,
                pool: true,
                secure: true,
                auth: {
                    user: process.env.MAIL_SENDER_EMAIL,
                    pass: process.env.MAIL_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            var mailOptions = {
                from: `${process.env.MAIL_SENDER_NAME} <${process.env.MAIL_SENDER_EMAIL}>`,
                to: email,
                subject: subject,
                html: body
            };
            return transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error, 'error in mail')
                    return Promise.resolve(error);
                } else {
                    return resolve({ sent: true });
                }
            });

        });
    } catch (error) {
        console.log(error)
    }
};


export default sendEmail