const nodemailer = require("nodemailer")
const ejs = require("ejs")
const path = require("path")
const logger = require("../logger/logger")
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
        auth:{
            user: "846086001@smtp-brevo.com",
            pass: "SPBnmO0zpITsxA9d"
        }
    
})

exports.sendEmail = (templateName, data) => {

    return new Promise((resolve, reject) => {
        const templatePath = path.join(__dirname, "../templates", `${templateName}.ejs`)
        ejs.renderFile(templatePath, data, (err, html) => {
            if (err) {
                logger.warn(err.message)
            }
            const mailOptions = {
                from: "dentaleducation189@gmail.com",
                to: data.to,
                subject: data.subject,
                html
            }
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err)
                    logger.warn("Failed to send email")
                }
                logger.info(`sending email with this data: ${JSON.stringify(data)}`)
                resolve(info)
            })
        })
    })
}
