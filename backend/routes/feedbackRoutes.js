
// const express = require('express');
// const router = express.Router();
// const twilio = require('twilio');
// const { submitFeedback } = require('../controllers/feedbackController');
// require('dotenv').config(); // Load environment variables

// // Import authentication middleware
// const verifyToken = require('../middlewares/authMiddleware');

// // Initialize Twilio client
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// console.log('Twilio Account SID:', accountSid);
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// console.log('Twilio Auth Token:', authToken ? 'Loaded' : 'Missing');
// const client = new twilio(accountSid, authToken);
// console.log('Twilio Phone Number:', process.env.TWILIO_PHONE_NUMBER);

// // API Route for feedback submission
// // router.post('/feedback-submit', verifyToken, async (req, res) => {
// //   const { name, email, message } = req.body;

// //   if (!name || !email || !message) {
// //     return res.status(400).json({ error: 'All fields are required.' });
// //   }

// //   try {
// //     const response = await client.messages.create({
// //       body: `New feedback from:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
// //       from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
// //       to: 'whatsapp:+919321754089', // Replace with recipient's number
// //     });

// //     console.log('Twilio API Response:', response); // Log the response for debugging

// //     // Save feedback to DB (if applicable)
// //     await submitFeedback(name, email, message); // Adjust based on your DB model

// //     // Return the Twilio API response along with your custom message
// //     res.status(200).json({
// //       message: 'Feedback sent and saved successfully!',
// //       twilioResponse: {
// //         sid: response.sid, // Unique identifier for the message
// //         status: response.status, // Status of the message
// //         to: response.to, // Recipient's number
// //       },
// //     });
// //   } catch (error) {
// //     console.error('Error sending feedback:', error); // Log the error for debugging
// //     res.status(500).json({ error: 'Failed to send feedback. Please try again later.' });
// //   }
// // });

// router.post('/feedback-submit', verifyToken, async (req, res) => {
//   const { name, email, message } = req.body;

//   if (!name || !email || !message) {
//     return res.status(400).json({ error: 'All fields are required.' });
//   }

//   try {
//     // Send WhatsApp message using Twilio
//     const response = await client.messages.create({
//       body: `New feedback from:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
//       from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
//       to: 'whatsapp:+919321754089', // Replace with the recipient's WhatsApp number
     
//     });

//     console.log('Twilio API Response:', response); // Log the response for debugging

//     // Save feedback to DB
//     await submitFeedback(name, email, message);

//     // Respond with success message and Twilio response
//     res.status(200).json({
//       message: 'Feedback sent and saved successfully!',
//       twilioResponse: {
//         sid: response.sid, // Unique identifier for the message
//         status: response.status, // Status of the message
//         to: response.to, // Recipient's number
//       },
//     });
//   } catch (error) {
//     console.error('Error sending feedback:', error);
//     res.status(500).json({ error: 'Failed to send feedback. Please try again later.' });
//   }
// });


// module.exports = router;


const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const { submitFeedback } = require('../controllers/feedbackController');
require('dotenv').config(); // Load environment variables

// Import authentication middleware
const verifyToken = require('../middlewares/authMiddleware');

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

// API Route for feedback submission
router.post('/feedback-submit', verifyToken, async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
  // Send WhatsApp message using Twilio
  const response = await client.messages.create({
    body: `New feedback from:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
    from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`, // Twilio WhatsApp number
    to: 'whatsapp:+918866224439', // Replace with the recipient's WhatsApp number
  });

  // Log the SID for tracking
  console.log('Message sent with SID:', response.sid);

  // Check the status of the message
  console.log('Message status:', response.status);

  // Save feedback to the database
  await submitFeedback(name, email, message);

  // Respond with a simplified success message
  res.status(200).json({
    message: 'Feedback sent and saved successfully!',
    twilioResponse: {
      sid: response.sid,  // Unique identifier for the message
      status: response.status,  // Status of the message
    },
  });
} catch (error) {
  // Log detailed error response
  console.error('Error sending feedback:', error.message);
  res.status(500).json({ error: `Failed to send feedback. ${error.message}` });
}

});

module.exports = router;
