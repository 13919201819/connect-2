// import { NextResponse } from 'next/server';
// import { google, calendar_v3 } from 'googleapis';
// import nodemailer from 'nodemailer';

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { name, email, phone, country, company, message, date, time, timezone } = body;

//     // 1️⃣ Google Auth
//     const auth = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET
//     );
//     auth.setCredentials({
//       refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
//     });
//     const calendar = google.calendar({ version: 'v3', auth });

//     // 2️⃣ Handle timezone conversion
//     const eventStart = new Date(`${date} ${time}`);
//     const startISO = new Date(
//       eventStart.toLocaleString('en-US', { timeZone: timezone })
//     ).toISOString();
//     const endISO = new Date(new Date(startISO).getTime() + 60 * 60 * 1000).toISOString();

//     // 3️⃣ Define event
//     const event: calendar_v3.Schema$Event = {
//       summary: `Demo with ${name} (${company})`,
//       description: `Client: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\nMessage: ${message}`,
//       start: { dateTime: startISO, timeZone: timezone },
//       end: { dateTime: endISO, timeZone: timezone },
//       attendees: [
//         { email },
//         { email: process.env.HOST_EMAIL || '' },
//       ],
//       conferenceData: {
//         createRequest: {
//           requestId: `${Date.now()}`,
//           conferenceSolutionKey: { type: 'hangoutsMeet' },
//         },
//       },
//     };

//     // 4️⃣ Insert the event into Google Calendar
//     const insertResponse = await calendar.events.insert({
//       calendarId: 'primary',
//       requestBody: event,
//       conferenceDataVersion: 1,
//       sendUpdates: 'all',
//     });

//     // 5️⃣ Extract Google Meet link
//     const meetLink = insertResponse.data.hangoutLink || 'Meet link not generated';

//     // 6️⃣ Send confirmation emails using Nodemailer
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.SMTP_EMAIL,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     // Email to client
//     await transporter.sendMail({
//       from: process.env.SMTP_EMAIL,
//       to: email,
//       subject: '✅ Your Demo is Confirmed!',
//       html: `
//         <h2>Hi ${name},</h2>
//         <p>Thank you for scheduling a demo with us!</p>
//         <p><b>Date:</b> ${date}</p>
//         <p><b>Time:</b> ${time} (${timezone})</p>
//         <p><b>Google Meet Link:</b> <a href="${meetLink}">${meetLink}</a></p>
//         <p>We look forward to connecting with you.</p>
//       `,
//     });

//     // Email to host
//     await transporter.sendMail({
//       from: process.env.SMTP_EMAIL,
//       to: process.env.HOST_EMAIL,
//       subject: `📅 New Demo Booking: ${name}`,
//       html: `
//         <h3>New Demo Booking</h3>
//         <p><b>Name:</b> ${name}</p>
//         <p><b>Email:</b> ${email}</p>
//         <p><b>Phone:</b> ${phone}</p>
//         <p><b>Company:</b> ${company}</p>
//         <p><b>Timezone:</b> ${timezone}</p>
//         <p><a href="${meetLink}">Join Meeting</a></p>
//       `,
//     });

//     return NextResponse.json({ success: true, meetLink });
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.error('Error booking meeting:', error.message);
//       return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//     } else {
//       console.error('Unknown error booking meeting:', error);
//       return NextResponse.json({ success: false, error: 'Unknown error' }, { status: 500 });
//     }
//   }
// }



// import { NextResponse } from 'next/server';
// import { google, calendar_v3 } from 'googleapis';
// import nodemailer from 'nodemailer';

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { name, email, phone, country, company, message, date, time, timezone } = body;

//     // 1️⃣ Google Auth
//     const auth = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET
//     );
//     auth.setCredentials({
//       refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
//     });
//     const calendar = google.calendar({ version: 'v3', auth });

//     // 2️⃣ Create date-time string in user's timezone
//     // The date comes as YYYY-MM-DD and time as HH:mm (24-hour format)
//     const dateTimeString = `${date}T${time}:00`;
    
//     // Create Date object in user's timezone
//     const userDateTime = new Date(dateTimeString);
    
//     // Calculate end time (1 hour later)
//     const endDateTime = new Date(userDateTime.getTime() + 60 * 60 * 1000);
    
//     // Format for Google Calendar API (ISO 8601)
//     const startISO = userDateTime.toISOString();
//     const endISO = endDateTime.toISOString();

//     console.log('Timezone Debug:', {
//       receivedTimezone: timezone,
//       receivedDate: date,
//       receivedTime: time,
//       dateTimeString,
//       startISO,
//       endISO,
//       userLocalTime: userDateTime.toLocaleString('en-US', { timeZone: timezone })
//     });

//     // 3️⃣ Define event
//     const event: calendar_v3.Schema$Event = {
//       summary: `Demo with ${name} (${company})`,
//       description: `Client: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\nCountry: ${country}\nTimezone: ${timezone}\nMessage: ${message}`,
//       start: { 
//         dateTime: startISO,
//         timeZone: timezone
//       },
//       end: { 
//         dateTime: endISO,
//         timeZone: timezone
//       },
//       attendees: [
//         { email },
//         { email: process.env.HOST_EMAIL || '' },
//       ],
//       conferenceData: {
//         createRequest: {
//           requestId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
//           conferenceSolutionKey: { type: 'hangoutsMeet' },
//         },
//       },
//     };

//     // 4️⃣ Insert the event into Google Calendar
//     const insertResponse = await calendar.events.insert({
//       calendarId: 'primary',
//       requestBody: event,
//       conferenceDataVersion: 1,
//       sendUpdates: 'all',
//     });

//     // 5️⃣ Extract Google Meet link
//     const meetLink = insertResponse.data.hangoutLink || 'Meet link not generated';

//     // 6️⃣ Format date and time for emails
//     const formatDateForEmail = (isoString: string, tz: string) => {
//       return new Date(isoString).toLocaleString('en-US', {
//         timeZone: tz,
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//         hour: 'numeric',
//         minute: '2-digit',
//         hour12: true
//       });
//     };

//     const userLocalTime = formatDateForEmail(startISO, timezone);
    
//     // Also show time in host's timezone (adjust as needed)
//     const hostTimezone = 'Asia/Kolkata'; // Change this to your timezone
//     const hostLocalTime = formatDateForEmail(startISO, hostTimezone);

//     // 7️⃣ Send confirmation emails using Nodemailer
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.SMTP_EMAIL,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     // Email to client
//     await transporter.sendMail({
//       from: process.env.SMTP_EMAIL,
//       to: email,
//       subject: '✅ Your Demo is Confirmed!',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #4f46e5;">Hi ${name},</h2>
//           <p>Thank you for scheduling a demo with us!</p>
          
//           <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
//             <h3 style="margin-top: 0; color: #1f2937;">Meeting Details</h3>
//             <p><strong>📅 Date & Time:</strong><br>${userLocalTime}</p>
//             <p><strong>🌍 Your Timezone:</strong> ${timezone}</p>
//             <p><strong>🔗 Google Meet Link:</strong><br>
//               <a href="${meetLink}" style="color: #4f46e5; text-decoration: none;">${meetLink}</a>
//             </p>
//           </div>
          
//           <p>We look forward to connecting with you!</p>
//           <p style="color: #6b7280; font-size: 14px;">
//             A calendar invitation has been sent to your email. Please check your calendar for more details.
//           </p>
//         </div>
//       `,
//     });

//     // Email to host
//     await transporter.sendMail({
//       from: process.env.SMTP_EMAIL,
//       to: process.env.HOST_EMAIL,
//       subject: `📅 New Demo Booking: ${name} from ${company}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h3 style="color: #4f46e5;">New Demo Booking</h3>
          
//           <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
//             <p><strong>Name:</strong> ${name}</p>
//             <p><strong>Email:</strong> ${email}</p>
//             <p><strong>Phone:</strong> ${phone}</p>
//             <p><strong>Company:</strong> ${company}</p>
//             <p><strong>Country:</strong> ${country}</p>
//             <p><strong>Message:</strong> ${message || 'No message provided'}</p>
//           </div>
          
//           <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
//             <h4 style="margin-top: 0;">Meeting Schedule</h4>
//             <p><strong>Client's Time:</strong><br>${userLocalTime} (${timezone})</p>
//             <p><strong>Your Time:</strong><br>${hostLocalTime} (${hostTimezone})</p>
//             <p><strong>Google Meet:</strong><br>
//               <a href="${meetLink}" style="color: #4f46e5; text-decoration: none;">${meetLink}</a>
//             </p>
//           </div>
//         </div>
//       `,
//     });

//     return NextResponse.json({ 
//       success: true, 
//       meetLink,
//       scheduledTime: userLocalTime,
//       timezone: timezone
//     });
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.error('Error booking meeting:', error.message);
//       return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//     } else {
//       console.error('Unknown error booking meeting:', error);
//       return NextResponse.json({ success: false, error: 'Unknown error' }, { status: 500 });
//     }
//   }
// }


// import { NextResponse } from 'next/server';
// import { google, calendar_v3 } from 'googleapis';
// import nodemailer from 'nodemailer';

// // Handle CORS preflight requests
// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'POST, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type',
//     },
//   });
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { name, email, phone, country, company, message, date, time, timezone } = body;

//     console.log('📅 Received booking request:', { name, email, date, time, timezone });

//     // Validate required fields
//     if (!name || !email || !date || !time || !timezone) {
//       return NextResponse.json(
//         { success: false, error: 'Missing required fields' },
//         { 
//           status: 400,
//           headers: {
//             'Access-Control-Allow-Origin': '*',
//           }
//         }
//       );
//     }

//     // 1️⃣ Google Auth Setup
//     const auth = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET
//     );

//     auth.setCredentials({
//       refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
//     });

//     const calendar = google.calendar({ version: 'v3', auth });

//     // 2️⃣ Create date-time in user's timezone
//     // Input: date="2024-11-15", time="14:00" (24-hour format)
//     const dateTimeString = `${date}T${time}:00`;
//     const userDateTime = new Date(dateTimeString);
    
//     // Add 1 hour for end time
//     const endDateTime = new Date(userDateTime.getTime() + 60 * 60 * 1000);
    
//     // Convert to ISO format
//     const startISO = userDateTime.toISOString();
//     const endISO = endDateTime.toISOString();

//     console.log('🕐 Time conversion:', {
//       input: { date, time, timezone },
//       dateTimeString,
//       startISO,
//       endISO
//     });

//     // 3️⃣ Create Calendar Event
//     const event: calendar_v3.Schema$Event = {
//       summary: `Demo with ${name} (${company || 'N/A'})`,
//       description: `
// Client Information:
// - Name: ${name}
// - Email: ${email}
// - Phone: ${phone || 'Not provided'}
// - Company: ${company || 'Not provided'}
// - Country: ${country || 'Not provided'}
// - Timezone: ${timezone}

// Message:
// ${message || 'No message provided'}
//       `.trim(),
//       start: { 
//         dateTime: startISO,
//         timeZone: timezone
//       },
//       end: { 
//         dateTime: endISO,
//         timeZone: timezone
//       },
//       attendees: [
//         { email: email },
//         { email: process.env.HOST_EMAIL || '' },
//       ],
//       conferenceData: {
//         createRequest: {
//           requestId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
//           conferenceSolutionKey: { type: 'hangoutsMeet' },
//         },
//       },
//       reminders: {
//         useDefault: false,
//         overrides: [
//           { method: 'email', minutes: 24 * 60 }, // 1 day before
//           { method: 'popup', minutes: 30 }, // 30 minutes before
//         ],
//       },
//     };

//     console.log('📝 Creating calendar event...');

//     // 4️⃣ Insert Event into Google Calendar
//     const insertResponse = await calendar.events.insert({
//       calendarId: 'primary',
//       requestBody: event,
//       conferenceDataVersion: 1,
//       sendUpdates: 'all',
//     });

//     const meetLink = insertResponse.data.hangoutLink || 'Meet link not generated';
//     const eventId = insertResponse.data.id;

//     console.log('✅ Calendar event created:', { eventId, meetLink });

//     // 5️⃣ Format Times for Emails
//     const formatDateForEmail = (isoString: string, tz: string) => {
//       try {
//         return new Date(isoString).toLocaleString('en-US', {
//           timeZone: tz,
//           weekday: 'long',
//           year: 'numeric',
//           month: 'long',
//           day: 'numeric',
//           hour: 'numeric',
//           minute: '2-digit',
//           hour12: true
//         });
//       } catch (error) {
//         console.error('Error formatting date:', error);
//         return isoString;
//       }
//     };

//     const userLocalTime = formatDateForEmail(startISO, timezone);
//     const hostTimezone = 'Asia/Kolkata'; // Change to your timezone
//     const hostLocalTime = formatDateForEmail(startISO, hostTimezone);

//     console.log('⏰ Formatted times:', { userLocalTime, hostLocalTime });

//     // 6️⃣ Send Confirmation Emails
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.SMTP_EMAIL,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     console.log('📧 Sending confirmation emails...');

//     // Email to Client
//     try {
//       await transporter.sendMail({
//         from: `"Demo Scheduler" <${process.env.SMTP_EMAIL}>`,
//         to: email,
//         subject: '✅ Your Demo is Confirmed!',
//         html: `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="utf-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
// </head>
// <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
//   <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    
//     <!-- Header -->
//     <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
//       <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Demo Confirmed!</h1>
//     </div>
    
//     <!-- Content -->
//     <div style="padding: 30px;">
//       <h2 style="color: #333; margin-top: 0;">Hi ${name}! 👋</h2>
//       <p style="color: #666; font-size: 16px; line-height: 1.6;">
//         Thank you for scheduling a demo with us! We're excited to show you what we can do for your business.
//       </p>
      
//       <!-- Meeting Details Card -->
//       <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 25px 0; border-radius: 5px;">
//         <h3 style="color: #333; margin-top: 0; font-size: 18px;">📅 Meeting Details</h3>
        
//         <div style="margin: 15px 0;">
//           <strong style="color: #667eea;">📅 Date & Time:</strong><br>
//           <span style="color: #333; font-size: 16px;">${userLocalTime}</span>
//         </div>
        
//         <div style="margin: 15px 0;">
//           <strong style="color: #667eea;">🌍 Your Timezone:</strong><br>
//           <span style="color: #333;">${timezone}</span>
//         </div>
        
//         <div style="margin: 15px 0;">
//           <strong style="color: #667eea;">🔗 Google Meet Link:</strong><br>
//           <a href="${meetLink}" style="color: #667eea; text-decoration: none; word-break: break-all;">${meetLink}</a>
//         </div>
//       </div>
      
//       <!-- CTA Button -->
//       <div style="text-align: center; margin: 30px 0;">
//         <a href="${meetLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px;">
//           Join Meeting 🚀
//         </a>
//       </div>
      
//       <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 30px;">
//         💡 <strong>Tip:</strong> A calendar invitation has been sent to your email. Please add it to your calendar so you don't miss it!
//       </p>
      
//       <p style="color: #666; font-size: 14px; line-height: 1.6;">
//         If you need to reschedule or have any questions, feel free to reply to this email.
//       </p>
//     </div>
    
//     <!-- Footer -->
//     <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
//       <p style="color: #999; font-size: 12px; margin: 0;">
//         Looking forward to meeting with you! 🎯
//       </p>
//     </div>
//   </div>
// </body>
// </html>
//         `,
//       });

//       console.log('✅ Client email sent');
//     } catch (emailError) {
//       console.error('❌ Error sending client email:', emailError);
//     }

//     // Email to Host
//     try {
//       await transporter.sendMail({
//         from: `"Demo Scheduler" <${process.env.SMTP_EMAIL}>`,
//         to: process.env.HOST_EMAIL,
//         subject: `📅 New Demo Booking: ${name} from ${company || 'N/A'}`,
//         html: `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="utf-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
// </head>
// <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
//   <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    
//     <!-- Header -->
//     <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; text-align: center;">
//       <h1 style="color: white; margin: 0; font-size: 28px;">🆕 New Demo Booking</h1>
//     </div>
    
//     <!-- Content -->
//     <div style="padding: 30px;">
//       <h3 style="color: #333; margin-top: 0;">Client Information</h3>
      
//       <!-- Client Details Card -->
//       <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
//         <p style="margin: 10px 0;"><strong>👤 Name:</strong> ${name}</p>
//         <p style="margin: 10px 0;"><strong>✉️ Email:</strong> ${email}</p>
//         <p style="margin: 10px 0;"><strong>📱 Phone:</strong> ${phone || 'Not provided'}</p>
//         <p style="margin: 10px 0;"><strong>🏢 Company:</strong> ${company || 'Not provided'}</p>
//         <p style="margin: 10px 0;"><strong>🌍 Country:</strong> ${country || 'Not provided'}</p>
        
//         ${message ? `
//         <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
//           <strong>💬 Message:</strong><br>
//           <p style="color: #666; margin: 10px 0;">${message}</p>
//         </div>
//         ` : ''}
//       </div>
      
//       <!-- Meeting Schedule Card -->
//       <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; margin: 20px 0; border-radius: 5px; color: white;">
//         <h3 style="margin-top: 0; color: white;">⏰ Meeting Schedule</h3>
//         <p style="margin: 10px 0;">
//           <strong>Client's Time:</strong><br>
//           ${userLocalTime} (${timezone})
//         </p>
//         <p style="margin: 10px 0;">
//           <strong>Your Time:</strong><br>
//           ${hostLocalTime} (${hostTimezone})
//         </p>
//       </div>
      
//       <!-- CTA Button -->
//       <div style="text-align: center; margin: 30px 0;">
//         <a href="${meetLink}" style="display: inline-block; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px;">
//           Join Meeting 🚀
//         </a>
//       </div>
      
//       <p style="color: #666; font-size: 14px; text-align: center;">
//         Event ID: <code style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px;">${eventId}</code>
//       </p>
//     </div>
//   </div>
// </body>
// </html>
//         `,
//       });

//       console.log('✅ Host email sent');
//     } catch (emailError) {
//       console.error('❌ Error sending host email:', emailError);
//     }

//     // 7️⃣ Return Success Response
//     return NextResponse.json(
//       { 
//         success: true, 
//         meetLink,
//         eventId,
//         scheduledTime: userLocalTime,
//         timezone: timezone
//       },
//       {
//         status: 200,
//         headers: {
//           'Access-Control-Allow-Origin': '*',
//           'Access-Control-Allow-Methods': 'POST, OPTIONS',
//           'Access-Control-Allow-Headers': 'Content-Type',
//         }
//       }
//     );

//   } catch (error: unknown) {
//     console.error('❌ Error booking meeting:', error);
    
//     let errorMessage = 'Unknown error occurred';
//     if (error instanceof Error) {
//       errorMessage = error.message;
//     }

//     return NextResponse.json(
//       { 
//         success: false, 
//         error: errorMessage,
//         details: process.env.NODE_ENV === 'development' ? error : undefined
//       },
//       { 
//         status: 500,
//         headers: {
//           'Access-Control-Allow-Origin': '*',
//         }
//       }
//     );
//   }
// }


import { NextResponse } from 'next/server';
import { google, calendar_v3 } from 'googleapis';
import nodemailer from 'nodemailer';

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      name,
      email,
      phone,
      company,
      message,
      date,
      time,
      timezone
    } = body;

    console.log('📅 Received demo booking request:', { 
      date, 
      time, 
      name 
    });

    // Validate required fields
    if (!date || !time || !name || !email || !company) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }
    
    // Parse additional details from message
    const messageLines = message.split('\n');
    let jobTitle = '';
    let companySize = '';
    let specificInterest = '';
    let additionalNotes = '';
    
    messageLines.forEach((line: string) => {
      if (line.startsWith('Job Title:')) jobTitle = line.replace('Job Title:', '').trim();
      if (line.startsWith('Company Size:')) companySize = line.replace('Company Size:', '').trim();
      if (line.startsWith('Product Interest:')) specificInterest = line.replace('Product Interest:', '').trim();
    });
    
    const notesIndex = message.indexOf('Additional Notes:');
    if (notesIndex !== -1) {
      additionalNotes = message.substring(notesIndex + 'Additional Notes:'.length).trim();
    }

    // 1️⃣ Google Auth Setup
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    auth.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // 2️⃣ Create date-time (time is already in 24hr format from frontend)
    const tz = timezone || 'America/New_York';
    const dateTimeString = `${date}T${time}:00`;
    
    // Create Date object in specified timezone
    const startDateTime = new Date(dateTimeString);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 hour
    
    const startISO = startDateTime.toISOString();
    const endISO = endDateTime.toISOString();

    console.log('🕐 Time conversion:', {
      input: { date, time, timezone: tz },
      dateTimeString,
      startISO,
      endISO
    });

    // 3️⃣ Create Calendar Event
    const event: calendar_v3.Schema$Event = {
      summary: `Enterprise Demo: ${company} - ${name}`,
      description: `
ENTERPRISE DEMO BOOKING

Client Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Name: ${name}
💼 Job Title: ${jobTitle || 'Not provided'}
🏢 Company: ${company}
📊 Company Size: ${companySize || 'Not provided'}
✉️ Email: ${email}
📱 Phone: ${phone || 'Not provided'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Product Interest:
${specificInterest || 'General AI Enterprise Solutions'}

📝 Additional Notes:
${additionalNotes || 'No additional notes provided'}

⏰ Scheduled Time: ${time} ${tz}
📅 Date: ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      `.trim(),
      start: { 
        dateTime: startISO,
        timeZone: tz
      },
      end: { 
        dateTime: endISO,
        timeZone: tz
      },
      attendees: [
        { email: email, displayName: name },
        { email: process.env.HOST_EMAIL || '' },
      ],
      conferenceData: {
        createRequest: {
          requestId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'email', minutes: 60 }, // 1 hour before
          { method: 'popup', minutes: 30 }, // 30 minutes before
        ],
      },
    };

    console.log('📝 Creating calendar event...');

    // 4️⃣ Insert Event into Google Calendar
    const insertResponse = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
    });

    const meetLink = insertResponse.data.hangoutLink || 'Meet link not generated';
    const eventId = insertResponse.data.id;

    console.log('✅ Calendar event created:', { eventId, meetLink });

    // 5️⃣ Format Times for Emails
    const formatDateForEmail = (isoString: string, tz: string) => {
      try {
        return new Date(isoString).toLocaleString('en-US', {
          timeZone: tz,
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZoneName: 'short'
        });
      } catch (error) {
        console.error('Error formatting date:', error);
        return isoString;
      }
    };

    const clientLocalTime = formatDateForEmail(startISO, tz);
    const hostTimezone = process.env.HOST_TIMEZONE || 'America/New_York';
    const hostLocalTime = formatDateForEmail(startISO, hostTimezone);

    console.log('⏰ Formatted times:', { clientLocalTime, hostLocalTime });

    // 6️⃣ Send Confirmation Emails
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log('📧 Sending confirmation emails...');

    // Email to Client
    try {
      await transporter.sendMail({
        from: `"MistrAI" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: '✅ Your Enterprise AI Demo is Confirmed!',
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
  <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(to bottom, #1a1a1a, #0a0a0a); border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 40px 30px; text-align: center; position: relative;">
      <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 32px;">
        ✨
      </div>
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Demo Confirmed!</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Your personalized AI demonstration is scheduled</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #ffffff; margin-top: 0; font-size: 22px; font-weight: 600;">Hi ${name}! 👋</h2>
      <p style="color: #a0a0a0; font-size: 16px; line-height: 1.6; margin: 20px 0;">
        Thank you for scheduling an Enterprise AI demo with us. We're excited to demonstrate how our AI solutions can transform <strong style="color: #c4b5fd;">${company}</strong>'s operations and drive measurable ROI.
      </p>
      
      <!-- Meeting Details Card -->
      <div style="background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(168, 85, 247, 0.05)); border: 1px solid rgba(124, 58, 237, 0.3); border-left: 4px solid #7c3aed; padding: 24px; margin: 30px 0; border-radius: 12px;">
        <h3 style="color: #c4b5fd; margin-top: 0; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
          📅 Meeting Details
        </h3>
        
        <div style="margin: 20px 0;">
          <div style="color: #7c3aed; font-weight: 600; margin-bottom: 8px; font-size: 14px;">📆 DATE & TIME</div>
          <div style="color: #ffffff; font-size: 18px; font-weight: 600;">${clientLocalTime}</div>
        </div>
        
        <div style="margin: 20px 0; padding-top: 20px; border-top: 1px solid rgba(124, 58, 237, 0.2);">
          <div style="color: #7c3aed; font-weight: 600; margin-bottom: 8px; font-size: 14px;">🔗 GOOGLE MEET LINK</div>
          <a href="${meetLink}" style="color: #a855f7; text-decoration: none; word-break: break-all; font-size: 14px; display: inline-block; background: rgba(124, 58, 237, 0.1); padding: 8px 12px; border-radius: 6px; margin-top: 4px;">${meetLink}</a>
        </div>

        ${specificInterest ? `
        <div style="margin: 20px 0; padding-top: 20px; border-top: 1px solid rgba(124, 58, 237, 0.2);">
          <div style="color: #7c3aed; font-weight: 600; margin-bottom: 8px; font-size: 14px;">🎯 FOCUS AREAS</div>
          <div style="color: #e0e0e0; font-size: 15px;">${specificInterest}</div>
        </div>
        ` : ''}
      </div>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 35px 0;">
        <a href="${meetLink}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 16px 48px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);">
          Add to Calendar 🚀
        </a>
      </div>
      
      <!-- What to Expect -->
      <div style="background: rgba(255, 255, 255, 0.02); border-radius: 12px; padding: 24px; margin: 30px 0;">
        <h3 style="color: #c4b5fd; margin-top: 0; font-size: 16px; font-weight: 600;">What to Expect:</h3>
        <ul style="color: #a0a0a0; font-size: 14px; line-height: 1.8; margin: 16px 0; padding-left: 20px;">
          <li>Personalized demonstration tailored to ${company}</li>
          <li>Live Q&A with our enterprise solutions team</li>
          <li>Discussion of your specific use cases and requirements</li>
          <li>Custom ROI analysis for your organization</li>
        </ul>
      </div>
      
      <div style="background: rgba(124, 58, 237, 0.1); border-left: 3px solid #7c3aed; padding: 16px; border-radius: 8px; margin: 25px 0;">
        <p style="color: #c4b5fd; font-size: 14px; margin: 0; line-height: 1.6;">
          <strong>💡 Pro Tip:</strong> A calendar invitation has been sent to your email. We recommend preparing a list of specific challenges or use cases you'd like to discuss during the demo.
        </p>
      </div>
      
      <p style="color: #808080; font-size: 14px; line-height: 1.6; margin-top: 30px; text-align: center;">
        Need to reschedule? Simply reply to this email or contact us at <a href="mailto:${process.env.SMTP_EMAIL}" style="color: #7c3aed; text-decoration: none;">${process.env.SMTP_EMAIL}</a>
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background: rgba(255, 255, 255, 0.02); padding: 24px 30px; text-align: center; border-top: 1px solid rgba(124, 58, 237, 0.2);">
      <p style="color: #808080; font-size: 13px; margin: 0;">
        Looking forward to showing you the future of AI! 🎯
      </p>
      <p style="color: #606060; font-size: 12px; margin: 12px 0 0;">
        © ${new Date().getFullYear()} MistrAI. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
        `,
      });

      console.log('✅ Client email sent');
    } catch (emailError) {
      console.error('❌ Error sending client email:', emailError);
    }

    // Email to Host/Sales Team
    try {
      await transporter.sendMail({
        from: `"Demo Scheduler" <${process.env.SMTP_EMAIL}>`,
        to: process.env.HOST_EMAIL,
        subject: `🎯 NEW ENTERPRISE DEMO: ${company} (${companySize || 'Size Not Provided'})`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a;">
  <div style="max-width: 650px; margin: 0 auto; background: #1a1a1a; border-radius: 16px; overflow: hidden; border: 1px solid #2a2a2a;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 700;">🆕 New Enterprise Demo</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 15px;">High-Value Prospect Alert</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 35px;">
      <!-- Priority Badge -->
      <div style="display: inline-block; background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 25px;">
        ${companySize && companySize.includes('Fortune') ? '⭐ FORTUNE COMPANY' : '🔥 ENTERPRISE LEAD'}
      </div>
      
      <!-- Client Details Card -->
      <div style="background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); padding: 24px; margin: 20px 0; border-radius: 12px;">
        <h3 style="color: #10b981; margin-top: 0; font-size: 18px; font-weight: 600;">👤 Client Profile</h3>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; color: #10b981; font-weight: 600; font-size: 13px; width: 140px; vertical-align: top;">NAME</td>
            <td style="padding: 12px 0; color: #ffffff; font-size: 15px;">${name}</td>
          </tr>
          <tr style="border-top: 1px solid rgba(16, 185, 129, 0.1);">
            <td style="padding: 12px 0; color: #10b981; font-weight: 600; font-size: 13px; vertical-align: top;">TITLE</td>
            <td style="padding: 12px 0; color: #ffffff; font-size: 15px;">${jobTitle || 'Not provided'}</td>
          </tr>
          <tr style="border-top: 1px solid rgba(16, 185, 129, 0.1);">
            <td style="padding: 12px 0; color: #10b981; font-weight: 600; font-size: 13px; vertical-align: top;">COMPANY</td>
            <td style="padding: 12px 0; color: #ffffff; font-size: 15px; font-weight: 600;">${company}</td>
          </tr>
          <tr style="border-top: 1px solid rgba(16, 185, 129, 0.1);">
            <td style="padding: 12px 0; color: #10b981; font-weight: 600; font-size: 13px; vertical-align: top;">COMPANY SIZE</td>
            <td style="padding: 12px 0; color: #ffffff; font-size: 15px;">${companySize || 'Not provided'}</td>
          </tr>
          <tr style="border-top: 1px solid rgba(16, 185, 129, 0.1);">
            <td style="padding: 12px 0; color: #10b981; font-weight: 600; font-size: 13px; vertical-align: top;">EMAIL</td>
            <td style="padding: 12px 0;"><a href="mailto:${email}" style="color: #10b981; text-decoration: none;">${email}</a></td>
          </tr>
          <tr style="border-top: 1px solid rgba(16, 185, 129, 0.1);">
            <td style="padding: 12px 0; color: #10b981; font-weight: 600; font-size: 13px; vertical-align: top;">PHONE</td>
            <td style="padding: 12px 0; color: #ffffff; font-size: 15px;">${phone || 'Not provided'}</td>
          </tr>
        </table>
      </div>

      ${specificInterest ? `
      <div style="background: rgba(124, 58, 237, 0.05); border: 1px solid rgba(124, 58, 237, 0.2); padding: 20px; margin: 20px 0; border-radius: 12px;">
        <h4 style="color: #a855f7; margin-top: 0; font-size: 14px; font-weight: 600;">🎯 PRODUCT INTEREST</h4>
        <p style="color: #e0e0e0; margin: 8px 0 0; font-size: 15px; line-height: 1.6;">${specificInterest}</p>
      </div>
      ` : ''}

      ${additionalNotes ? `
      <div style="background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); padding: 20px; margin: 20px 0; border-radius: 12px;">
        <h4 style="color: #60a5fa; margin-top: 0; font-size: 14px; font-weight: 600;">📝 ADDITIONAL NOTES</h4>
        <p style="color: #e0e0e0; margin: 8px 0 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${additionalNotes}</p>
      </div>
      ` : ''}
      
      <!-- Meeting Schedule Card -->
      <div style="background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(168, 85, 247, 0.05)); border: 1px solid rgba(124, 58, 237, 0.3); padding: 24px; margin: 25px 0; border-radius: 12px;">
        <h3 style="color: #c4b5fd; margin-top: 0; font-size: 18px; font-weight: 600;">⏰ Meeting Schedule</h3>
        
        <div style="margin: 16px 0;">
          <div style="color: #7c3aed; font-weight: 600; margin-bottom: 6px; font-size: 13px;">CLIENT'S TIME</div>
          <div style="color: #ffffff; font-size: 16px;">${clientLocalTime}</div>
        </div>
        
        <div style="margin: 16px 0; padding-top: 16px; border-top: 1px solid rgba(124, 58, 237, 0.2);">
          <div style="color: #7c3aed; font-weight: 600; margin-bottom: 6px; font-size: 13px;">YOUR TIME</div>
          <div style="color: #ffffff; font-size: 16px; font-weight: 600;">${hostLocalTime}</div>
        </div>

        <div style="margin: 16px 0; padding-top: 16px; border-top: 1px solid rgba(124, 58, 237, 0.2);">
          <div style="color: #7c3aed; font-weight: 600; margin-bottom: 6px; font-size: 13px;">MEETING LINK</div>
          <a href="${meetLink}" style="color: #a855f7; text-decoration: none; word-break: break-all; font-size: 13px;">${meetLink}</a>
        </div>
      </div>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${meetLink}" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 16px 48px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);">
          Join Meeting 🚀
        </a>
      </div>
      
      <div style="text-align: center; padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 8px; margin-top: 25px;">
        <p style="color: #808080; font-size: 13px; margin: 0;">
          Event ID: <code style="background: rgba(255, 255, 255, 0.05); padding: 4px 8px; border-radius: 4px; color: #a0a0a0; font-size: 12px;">${eventId}</code>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
        `,
      });

      console.log('✅ Host email sent');
    } catch (emailError) {
      console.error('❌ Error sending host email:', emailError);
    }

    // 7️⃣ Return Success Response
    return NextResponse.json(
      { 
        success: true, 
        meetLink,
        eventId,
        scheduledTime: clientLocalTime,
        message: 'Demo scheduled successfully! Check your email for confirmation.'
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );

  } catch (error: unknown) {
    console.error('❌ Error booking demo:', error);
    
    let errorMessage = 'Failed to schedule demo. Please try again.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}