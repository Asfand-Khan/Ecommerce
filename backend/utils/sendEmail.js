const nodeMailer = require("nodemailer");

exports.sendEmail = async ({ email, subject, message }) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    service: "gmail",
    auth: {
      email: "khanasfand174@gmail.com",
      pass: "7s3p4x4c1y1j8w2tjnoykrpi",
    },
  });

  const mailOptions = {
    from: "khanasfand174@gmail.com",
    to: email,
    subject,
    html: message,
  };

  await transporter.sendMail(mailOptions);
};
