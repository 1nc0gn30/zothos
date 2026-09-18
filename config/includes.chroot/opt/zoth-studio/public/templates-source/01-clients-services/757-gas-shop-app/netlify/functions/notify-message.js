const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // We are now expecting a direct JSON payload from the React frontend
    const { order_id, user_id, message } = JSON.parse(event.body);

    const { data, error } = await resend.emails.send({
      from: '757 Gas App <onboarding@resend.dev>', 
      to: process.env.ADMIN_EMAIL, 
      subject: `🚨 New Order Message (Order #${order_id.substring(0, 8).toUpperCase()})`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-w-md; margin: 0 auto;">
          <h2>New Message Received</h2>
          <p>A customer has sent a new message regarding their order.</p>
          
          <div style="background: #f4f4f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px;"><strong>"${message}"</strong></p>
          </div>
          
          <a href="https://app.757gas.shop/orders" style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">
            Go to Dashboard
          </a>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { statusCode: 400, body: JSON.stringify({ error }) };
    }

    return { statusCode: 200, body: JSON.stringify({ message: 'Notification sent successfully', data }) };

  } catch (error) {
    console.error('Function error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) };
  }
};