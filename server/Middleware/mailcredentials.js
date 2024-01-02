const nodemailer = require("nodemailer");



const usersendMail = async (to, subject, text, html) => {
    try {
        const mailCredentials = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'balakrishna.g@dollarbirdinc.com',
                pass: 'syba buor xrsb aqdc',
            },
        });

        const mailOptions = {
            from: 'balakrishna.g@dollarbirdinc.com',
            to,
            subject,
            text: text || undefined,
            html: html || undefined
        };

        const Info = await mailCredentials.sendMail(mailOptions)
        return Info.response
    } catch (err) {
        // console.error('Error sending email:', err);
        throw err;
    }
}

module.exports = { usersendMail }