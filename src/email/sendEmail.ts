import fs from 'fs';
import nodemailer from 'nodemailer';

const sendEmail = async (clientData: User, freelancerData: User, depositId: string) => {
  let transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env['EMAIL_USERNAME'], // generated ethereal user
      pass: process.env['EMAIL_PASSWORD'], // generated ethereal password
    },
  });
  try {
    let messageToClient = await transporter.sendMail({
      from: process.env['EMAIL_USERNAME'], // sender address
      to: clientData.invoicingEmail, // list of receivers
      subject: 'Invoice', // Subject line
      text: 'Here is an invoice for work completed for you on OpenQ.', // plain text body
      html: '<p>Here is an invoice for work completed for you on OpenQ.</p>',
      attachments: [
        {
          filename: `invoice_${freelancerData?.invoiceNumber}.pdf`,
          path: `./tmp/${depositId}.pdf`,
        },
      ], // html body
    });

    let messageToFreelancer = await transporter.sendMail({
      from: process.env['EMAIL_USERNAME'], // sender address
      to: freelancerData.invoicingEmail, // list of receivers
      subject: 'Invoice', // Subject line
      text: `Here is a copy of your invoice sent to ${clientData.invoicingEmail} for work completed by you on OpenQ.`, // plain text body
      html: `<p>Here is a copy of your invoice sent to ${clientData.invoicingEmail} for work completed by you on OpenQ.</p>`,
      attachments: [
        {
          filename: `invoice_${freelancerData.invoiceNumber}.pdf`,
          path: `./tmp/${depositId}.pdf`,
        },
      ], // html body
    });

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(messageToClient));
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(messageToFreelancer));
    fs.unlink(`./tmp/${depositId}.pdf`, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  } catch (e) {
    console.log(e);
  }
};

export default sendEmail;
