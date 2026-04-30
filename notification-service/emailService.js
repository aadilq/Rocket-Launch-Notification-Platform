const sgmail = require('@sendgrid/mail')
sgmail.setApiKey(process.env.SENDGRID_API_KEY)

function buildEmailContent(event) {
      if (event.event_type === 'T_MINUS_24HR') {
          return {
              subject: `Launch Tomorrow: ${event.launch_name}`,
              text: `${event.launch_name} by ${event.agency} is launching in 24
  hours. Scheduled for ${event.net}. Status: ${event.status}`
          }
      }

      if (event.event_type === 'T_MINUS_1HR') {
          return {
              subject: `Launch Imminent: ${event.launch_name}`,
              text: `${event.launch_name} by ${event.agency} is launching in 1
  hour. Scheduled for ${event.net}. Status: ${event.status}`
          }
      }

      if (event.event_type === 'STATUS_CHANGE') {
          return {
              subject: `Launch Update: ${event.launch_name}`,
              text: `${event.launch_name} by ${event.agency} has a status
  update. Current status: ${event.status}. Scheduled for ${event.net}`
          }
      }
  }

  async function sendNotificationEmail(toEmail, event) {
      const content = buildEmailContent(event);

      const msg = {
          to: toEmail,
          from: process.env.SENDGRID_FROM_EMAIL,
          subject: content.subject,
          text: content.text
      }

      await sgmail.send(msg);
      console.log(`Email sent to ${toEmail} for event ${event.event_type} - 
  ${event.launch_name}`);
  }

  module.exports = { sendNotificationEmail };