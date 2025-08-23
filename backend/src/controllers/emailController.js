import nodemailer from "nodemailer";

export const sendEmail = async (req, res) => {
  const { to, subject, text } = req.body;
  const testAccount = await nodemailer.createTestAccount();

  try {
    const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
  tls: {
    rejectUnauthorized: false
  }
});


    await transporter.sendMail({
      from: testAccount.user,
      to,
      subject,
      text,
    });

    res.json({ success: true, message: "Correo enviado" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
