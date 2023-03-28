const mailer = require('nodemailer');

//STEP 1)create a mail service for emails
const sendEmail = async (options) => {
  const transporter = mailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //STEP 2)set email options for mail
  const mailOptions = {
    from: 'Rize Kishimaro <jokerlove2671@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //STEP 3) send email to users
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
