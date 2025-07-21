const passwordResetTemplate = (name, resetURL) => `
  <html>
  <body style="margin:0; padding:0; background:#f7f7f7; font-family:'Segoe UI', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f7f7;">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background:#fff; border-radius:14px; box-shadow:0 4px 24px rgba(110,142,251,0.10); overflow:hidden;">
            <tr>
              <td align="center" style="padding: 32px 22px 24px 22px; background:linear-gradient(129deg, #6e8efb, #a777e3); color:#fff;">
                <h1 style="margin:0; font-size:30px; font-weight:600; letter-spacing:1px;">🔐 Password Reset</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px 26px 22px 26px; color:#333; text-align:center;">
                <p style="font-size:18px; margin:0 0 18px 0;">Hello <b>${name}</b>,</p>
                <p style="font-size:16px; line-height:1.55; margin:0 0 22px 0;">
                  We received a request to reset your password.<br>
                  Tap the button below to create a new password:
                </p>
                <a href="${resetURL}" style="
                  display:inline-block;
                  margin: 28px 0 16px 0;
                  padding: 14px 40px;
                  background:linear-gradient(129deg, #6e8efb 0%, #a777e3 100%);
                  color:#fff;
                  text-decoration:none;
                  border-radius:7px;
                  font-weight:500;
                  font-size:17px;
                  letter-spacing:0.5px;
                  box-shadow:0 3px 10px 0 rgba(110,142,251,0.11);
                  border:0;
                "
                target="_blank"
                >
                  🔒 Reset Password
                </a>
                <p style="font-size:14px; color:#9399a7; margin:30px 0 0 0;">
                  If you did not request this change, you can safely ignore this email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background:#f5f7fa; padding: 16px 20px; text-align:center; font-size:13px; color:#abb0be; border-top:1px solid #ebedfa;">
                &copy; ${new Date().getFullYear()} YourApp Inc. &mdash; All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

module.exports = passwordResetTemplate;
