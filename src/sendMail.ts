import nodemailer from "nodemailer";

export default async (res, data) => {
  const { to, subject, text } = data;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.USER_NAME,
      pass: process.env.PASSWORD
    }
  });

  try {
    await transporter.sendMail({
      from: "damian.nedelea1@gmail.com",
      to: 'damian.nedelea@gmail.com',
      subject: 'Test email',
      text: 'Test'
    });


    res.sendStatus(200);

    console.log("Email sent");
  } catch (e) {
    res.sendStatus(500);

    console.log("Email was not sent. ", e);
  }
};
