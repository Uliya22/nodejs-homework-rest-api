const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(data) {
  try {
    const email = { ...data, from: 'uliya.d@ukr.net' };

    await sgMail.send(email);
    return true;

  } catch (error) {
    throw error;
  }
}

module.exports = sendEmail;