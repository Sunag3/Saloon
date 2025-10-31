# Email Setup Guide for Kashvi Beauty Studio

## Overview
The contact form now sends emails instead of SMS notifications. I've implemented multiple free email services with fallback options to ensure reliable email delivery.

## 🚀 **Current Features**

### ✅ **Email Integration**
- **Primary**: EmailJS (Free tier: 200 emails/month)
- **Fallback**: Formspree (Free tier: 50 submissions/month)
- **Demo Mode**: Console logging for testing

### ✅ **Email Content**
- Client's booking details (name, phone, email, service, date, message)
- Professional formatting with timestamps
- Reply-to functionality for easy responses

## 📧 **Setup Options**

### Option 1: EmailJS (Recommended - Easiest Setup)

#### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

#### Step 2: Add Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider:
   - **Gmail** (Recommended)
   - **Outlook/Hotmail**
   - **Yahoo Mail**
   - **Custom SMTP**

#### Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template:

```html
Subject: New Booking Inquiry from {{from_name}} - {{service}}

Hello {{to_name}},

You have received a new booking inquiry:

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Service: {{service}}
Preferred Date: {{preferred_date}}
Message: {{message}}

Submitted on: {{date_submitted}} at {{time_submitted}}

You can reply directly to this email to contact the client.

Best regards,
Kashvi Beauty Studio
```

#### Step 4: Get Your Keys
1. Copy your **Public Key** from "Account" → "General"
2. Copy your **Service ID** from "Email Services"
3. Copy your **Template ID** from "Email Templates"

#### Step 5: Update JavaScript
Replace these values in `js/script.js`:

```javascript
// Line 308: Replace with your EmailJS public key
emailjs.init('YOUR_PUBLIC_KEY');

// Line 315: Replace with your EmailJS service ID
const serviceId = 'YOUR_SERVICE_ID';

// Line 316: Replace with your EmailJS template ID
const templateId = 'YOUR_TEMPLATE_ID';
```

### Option 2: Formspree (Alternative Free Service)

#### Step 1: Create Formspree Account
1. Go to [https://formspree.io/](https://formspree.io/)
2. Sign up for a free account
3. Verify your email

#### Step 2: Create New Form
1. Click "New Form"
2. Give it a name: "Kashvi Beauty Studio Contact"
3. Copy the form endpoint URL (looks like: `https://formspree.io/f/xxxxxxx`)

#### Step 3: Update JavaScript
Replace this value in `js/script.js`:

```javascript
// Line 354: Replace with your Formspree endpoint
const formspreeEndpoint = 'https://formspree.io/f/YOUR_FORMSPREE_ID';
```

#### Step 4: Configure Formspree
1. Go to your form settings
2. Add these field names:
   - `name` - Client's name
   - `email` - Client's email
   - `phone` - Client's phone
   - `service` - Selected service
   - `date` - Preferred date
   - `message` - Additional message

## 🎯 **Quick Setup (Recommended)**

### For Gmail Users (Easiest):

1. **Sign up at EmailJS**: [https://www.emailjs.com/](https://www.emailjs.com/)

2. **Add Gmail Service**:
   - Click "Add New Service" → "Gmail"
   - Authorize with your Gmail account

3. **Create Template**:
   - Use the template provided above
   - Save and copy the Template ID

4. **Update JavaScript**:
   ```javascript
   // In js/script.js, replace these 3 values:
   emailjs.init('YOUR_PUBLIC_KEY');           // Line 308
   const serviceId = 'YOUR_SERVICE_ID';       // Line 315  
   const templateId = 'YOUR_TEMPLATE_ID';     // Line 316
   ```

5. **Test**: Fill out the form and check your email!

## 📊 **Free Tier Limits**

| Service | Free Tier Limit | Upgrade Cost |
|---------|----------------|--------------|
| **EmailJS** | 200 emails/month | $15/month for 1000 emails |
| **Formspree** | 50 submissions/month | $10/month for 1000 submissions |

## 🔧 **Current Demo Mode**

Right now, the form works in demo mode:
- ✅ Form validation works perfectly
- ✅ Shows "Sending Email..." loading state
- ✅ Displays success notification
- ✅ Logs email content to browser console
- ✅ Stores form data locally

## 🧪 **Testing Instructions**

### Test Without Email Service:
1. Open `index.html` in browser
2. Fill out the contact form completely
3. Click "Send Email"
4. Check browser console (F12) to see the email content
5. You should see a success notification

### Test With Email Service:
1. Set up EmailJS or Formspree (see setup guide above)
2. Update the JavaScript with your credentials
3. Fill out and submit the form
4. Check your email inbox for the booking inquiry

## 📧 **Email Preview**

When working, you'll receive emails like this:

```
Subject: New Booking Inquiry from Sarah Johnson - Wedding Makeup

Hello Kashvi Beauty Studio,

You have received a new booking inquiry:

Name: Sarah Johnson
Email: sarah@example.com
Phone: +91 98765 43210
Service: Wedding Makeup
Preferred Date: 2024-02-14
Message: I would like to book makeup for my wedding on February 14th. 
Please let me know your availability and pricing.

Submitted on: 1/15/2024 at 2:30:15 PM

You can reply directly to this email to contact the client.

Best regards,
Kashvi Beauty Studio
```

## 🛠️ **Troubleshooting**

### Common Issues:

1. **"EmailJS is not defined" error**:
   - Make sure EmailJS script is loaded before your script
   - Check if the EmailJS CDN is accessible

2. **"Failed to send email" error**:
   - Verify your EmailJS credentials are correct
   - Check if your email service is properly connected
   - Try the Formspree fallback option

3. **Formspree "Form not found" error**:
   - Verify your Formspree endpoint URL is correct
   - Make sure your form is active in Formspree dashboard

4. **Emails not received**:
   - Check spam/junk folder
   - Verify your email service configuration
   - Test with a different email address

## 🚀 **Production Deployment**

1. **Choose your email service** (EmailJS recommended)
2. **Complete the setup** following the guide above
3. **Update the JavaScript** with your credentials
4. **Test thoroughly** before going live
5. **Upload to your web server**

## 📞 **Support**

If you need help:
1. Check the browser console for error messages
2. Verify all credentials are correctly entered
3. Test with the demo mode first
4. Try the alternative service (Formspree if EmailJS fails)

The form is now ready to send professional email notifications for all your beauty studio bookings! 🎉
