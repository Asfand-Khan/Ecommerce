const nodeMailer = require("nodemailer");

exports.sendEmail = async ({ email, subject, message }) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    service: "gmail",
    auth: {
      email: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject,
    html: message,
  };

  await transporter.sendMail(mailOptions);
};
