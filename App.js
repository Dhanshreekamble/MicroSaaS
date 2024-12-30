// app.js
require('dotenv').config(); // Load environment variables from a .env file
const express = require('express'); // Import the express framework
const nodemailer = require('nodemailer'); // Import the nodemailer package to send emails
const moment = require('moment'); // Import moment for easy date manipulation

const app = express(); // Initialize the express app
const port = process.env.PORT || 3000; // Use port from environment or default to 3000

// Sample article data - This would usually come from a database
const articles = [
  {
    title: "Understanding JavaScript Closures",
    publishDate: "2023-01-10", // Example of an article publish date
    authorEmail: "author1@example.com"
  },
  {
    title: "The Rise of AI in Marketing",
    publishDate: "2023-02-20", // Example of an article publish date
    authorEmail: "author2@example.com"
  }
];

// Function to send an email notification when content is about to expire
const sendExpiryNotification = (email, articleTitle) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your email service (e.g., SendGrid, Mailgun)
    auth: {
      user: process.env.EMAIL_USER, // Email address from the .env file
      pass: process.env.EMAIL_PASS  // Email password from the .env file
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender email
    to: email, // Recipient email
    subject: `Content Expiry Reminder: ${articleTitle}`, // Subject of the email
    text: `Hi, your article "${articleTitle}" is about to expire. Please consider updating it.` // Email body
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

// Function to check whether the content is expired based on the publication date
const checkContentExpiry = () => {
  const currentDate = moment(); // Get the current date and time
  
  // Loop through each article to check if it needs to be updated
  articles.forEach(article => {
    const publishDate = moment(article.publishDate); // Convert the publish date to a moment object
    const diffInDays = currentDate.diff(publishDate, 'days'); // Calculate the difference in days

    // If the article is older than 30 days, send an expiry notification
    if (diffInDays > 30) {
      sendExpiryNotification(article.authorEmail, article.title); // Notify the author via email
    }
  });
};

// Set up an interval to check content expiry every 24 hours (24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
setInterval(checkContentExpiry, 24 * 60 * 60 * 1000); // This runs once every 24 hours

// Define a simple route to confirm the server is running
app.get('/', (req, res) => {
  res.send('Content Expiry Notifier is running!');
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
