import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}

export const sendWelcomeEmail = async (subscriberEmail) => {
  const mailOptions = {
    from: `"FAX Collections" <${process.env.EMAIL_USER}>`,
    to: subscriberEmail,
    subject: 'Welcome to FAX Collections ✨',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#18181b;border-radius:16px;overflow:hidden;border:1px solid #27272a;">

                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg,#eab308 0%,#ca8a04 100%);padding:40px 40px 30px;text-align:center;">
                    <h1 style="margin:0;font-size:28px;font-weight:800;color:#000;letter-spacing:-0.5px;">
                      FAX COLLECTIONS
                    </h1>
                    <p style="margin:8px 0 0;font-size:12px;color:#000;text-transform:uppercase;letter-spacing:3px;font-weight:600;">
                      African Fashion · Global Style
                    </p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px;">
                    <h2 style="margin:0 0 16px;font-size:22px;color:#ffffff;font-weight:700;">
                      Welcome to the Family! 🎉
                    </h2>
                    <p style="margin:0 0 20px;font-size:15px;color:#a1a1aa;line-height:1.7;">
                      Thank you for subscribing to FAX Collections! You're now part of an exclusive community that celebrates the beauty of African fashion.
                    </p>
                    <p style="margin:0 0 20px;font-size:15px;color:#a1a1aa;line-height:1.7;">
                      Here's what you can expect from us:
                    </p>

                    <!-- Benefits -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                      <tr>
                        <td style="padding:12px 16px;background-color:#27272a;border-radius:10px;margin-bottom:8px;">
                          <p style="margin:0;font-size:14px;color:#e4e4e7;">
                            <span style="color:#eab308;font-weight:700;">✦</span>&nbsp;&nbsp;Early access to new collections & drops
                          </p>
                        </td>
                      </tr>
                      <tr><td style="height:8px;"></td></tr>
                      <tr>
                        <td style="padding:12px 16px;background-color:#27272a;border-radius:10px;">
                          <p style="margin:0;font-size:14px;color:#e4e4e7;">
                            <span style="color:#eab308;font-weight:700;">✦</span>&nbsp;&nbsp;Exclusive discounts & subscriber-only offers
                          </p>
                        </td>
                      </tr>
                      <tr><td style="height:8px;"></td></tr>
                      <tr>
                        <td style="padding:12px 16px;background-color:#27272a;border-radius:10px;">
                          <p style="margin:0;font-size:14px;color:#e4e4e7;">
                            <span style="color:#eab308;font-weight:700;">✦</span>&nbsp;&nbsp;Style inspiration & fashion tips
                          </p>
                        </td>
                      </tr>
                      <tr><td style="height:8px;"></td></tr>
                      <tr>
                        <td style="padding:12px 16px;background-color:#27272a;border-radius:10px;">
                          <p style="margin:0;font-size:14px;color:#e4e4e7;">
                            <span style="color:#eab308;font-weight:700;">✦</span>&nbsp;&nbsp;Special event invitations & updates
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding:8px 0 16px;">
                          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}"
                             style="display:inline-block;background-color:#eab308;color:#000;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;letter-spacing:0.5px;">
                            SHOP NOW →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color:#0f0f12;padding:24px 40px;border-top:1px solid #27272a;text-align:center;">
                    <p style="margin:0 0 8px;font-size:12px;color:#71717a;">
                      © ${new Date().getFullYear()} FAX Collections. All rights reserved.
                    </p>
                    <p style="margin:0;font-size:11px;color:#52525b;">
                      You received this email because you subscribed to our newsletter.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  await getTransporter().sendMail(mailOptions);
};

export default getTransporter;
