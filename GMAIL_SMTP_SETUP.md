# Gmail SMTP Setup Guide

## Option 1: Continue with EmailJS (Recommended)

**Why EmailJS is better for your use case:**
- ✅ No OAuth setup required
- ✅ Works directly from frontend
- ✅ Handles Gmail authentication automatically
- ✅ Free tier: 200 emails/month
- ✅ Your current setup should work

**Your current EmailJS setup:**
- Public Key: `hbRBbF9PK94NMxJT3`
- Service ID: `service_j1o9d1q`
- Template ID: `template_daxlmp4`

## Option 2: Direct Gmail SMTP (Advanced)

If you want to use your Gmail client ID/secret directly, you'll need a backend server because:
- Gmail OAuth requires server-side authentication
- Client ID/Secret cannot be used directly in frontend (security risk)
- Need to implement OAuth flow

### Backend Setup Required

You'll need to create a backend API endpoint that:
1. Receives form data from your frontend
2. Uses your Gmail credentials to authenticate
3. Sends email via Gmail SMTP
4. Returns success/error response

### Example Backend Code (Node.js)

```javascript
const express = require('express');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const app = express();
app.use(express.json());

// Your Gmail OAuth credentials
const CLIENT_ID = 'your-gmail-client-id';
const CLIENT_SECRET = 'your-gmail-client-secret';
const REDIRECT_URI = 'https://yourdomain.com/auth/callback';
const REFRESH_TOKEN = 'your-refresh-token'; // You'll get this after OAuth flow

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Create transporter
async function createTransporter() {
    const accessToken = await oauth2Client.getAccessToken();
    
    return nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'your-email@gmail.com', // Your Gmail address
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken
        }
    });
}

// API endpoint to send email
app.post('/api/send-email', async (req, res) => {
    try {
        const { name, email, phone, service, date, message } = req.body;
        
        const transporter = await createTransporter();
        
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: 'your-business-email@gmail.com', // Where you want to receive bookings
            subject: `New Booking Inquiry from ${name} - ${service}`,
            html: `
                <h2>New Booking Inquiry</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Service:</strong> ${service}</p>
                <p><strong>Preferred Date:</strong> ${date}</p>
                <p><strong>Message:</strong> ${message || 'No additional message'}</p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
                
                <hr>
                <p><em>You can reply directly to this email to contact the client.</em></p>
            `
        };
        
        const result = await transporter.sendMail(mailOptions);
        res.json({ success: true, messageId: result.messageId });
        
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

### Frontend Changes Required

You'd need to modify your JavaScript to call your backend API instead of EmailJS:

```javascript
// Replace the sendEmailNotification function
async function sendEmailNotification(formData) {
    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            console.log('✅ Email sent successfully');
            return Promise.resolve();
        } else {
            throw new Error('Failed to send email');
        }
        
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw error;
    }
}
```

## Recommendation: Stick with EmailJS

**For your beauty studio website, I recommend continuing with EmailJS because:**

1. **✅ Much Simpler**: No backend server needed
2. **✅ Secure**: No credentials exposed in frontend
3. **✅ Reliable**: Handles OAuth automatically
4. **✅ Free**: 200 emails/month is plenty for most businesses
5. **✅ Already Set Up**: Your credentials are configured

## Next Steps

### If you want to continue with EmailJS (Recommended):
1. Test your current setup
2. Check EmailJS dashboard to ensure everything is connected
3. Submit a test form to see if emails are received

### If you want to use Gmail SMTP directly:
1. Set up a backend server (Node.js, Python, PHP, etc.)
2. Implement OAuth flow with your Gmail credentials
3. Create API endpoint to send emails
4. Modify frontend to call your API

**Which option would you prefer?** EmailJS (easier) or direct Gmail SMTP (more complex but gives you full control)?
