import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from fastapi import HTTPException
from dotenv import load_dotenv
import logging
import os

load_dotenv()

SMTP_SERVER = os.getenv('SMTP_SERVER')
SMTP_PORT = os.getenv('SMTP_PORT')
SMTP_USERNAME = os.getenv('SMTP_USERNAME')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')
EMAIL_FROM = os.getenv('EMAIL_FROM')
RESET_PASSWORD_URL = os.getenv('RESET_PASSWORD_URL')

if not all([SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, EMAIL_FROM, RESET_PASSWORD_URL]):
    raise ValueError("Some necessary environment variables are not set")

logger = logging.getLogger(__name__)

def send_email(to_address: str, subject: str, body: str):
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_FROM
        msg['To'] = to_address
        msg['Subject'] = subject

        msg.attach(MIMEText(body, 'html'))

        server = smtplib.SMTP(SMTP_SERVER, int(SMTP_PORT))
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.sendmail(EMAIL_FROM, to_address, msg.as_string())
        server.quit()

        logger.info(f"Email sent successfully to {to_address}")
    except smtplib.SMTPException as e:
        logger.error(f"Failed to send email: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email. Please try again later.")

def send_reset_password_email(email: str, token: str):
    reset_link = f"{RESET_PASSWORD_URL}?access_token={token}"
    subject = "ViperIT: Reset Your Password"
    body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;">
        <table role="presentation" style="width: 100%; background-color: #f4f4f4; padding: 20px; margin: 0;">
            <tr>
                <td style="text-align: center;">
                    <div style="max-width: 600px; background: #ffffff; margin: auto; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
                        <!-- Header Section -->
                        <table role="presentation" style="width: 100%; border-bottom: 2px solid #0056b3; margin-bottom: 20px;">
                            <tr>
                                <td style="text-align: center; padding-bottom: 15px;">
                                    <img src="https://www.viperit.com.br/wp-content/uploads/2020/09/Logo-VIper-It_vert.png" alt="ViperIT Logo" style="max-width: 100px;">
                                </td>
                            </tr>
                        </table>
                        
                        <!-- Body Section -->
                        <h2 style="color: #0056b3; margin-bottom: 20px;">Password Reset Request</h2>
                        <p style="font-size: 16px; line-height: 1.5;">Hi,</p>
                        <p style="font-size: 16px; line-height: 1.5;">You recently requested to reset your password for your ViperIT account. Click the button below to reset it:</p>
                        <p style="text-align: center;">
                            <a href="{reset_link}" style="background-color: #0056b3; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Reset Password</a>
                        </p>
                        
                        <!-- Separator -->
                        <hr style="border-top: 1px solid #ddd; margin: 20px 0;">
                        
                        <!-- Footer Section -->
                        <p style="font-size: 16px; line-height: 1.5;">If you did not request a password reset, please ignore this email or <a href="mailto:support@viperit.com" style="color: #0056b3; text-decoration: underline;">contact support</a> if you have questions.</p>
                        <p style="font-size: 16px; line-height: 1.5;">Thanks,<br>The ViperIT Team</p>
                        <hr style="border-top: 1px solid #ddd; margin: 20px 0;">
                        <p style="font-size: 12px; color: #777;">If you’re having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:<br><a href="{reset_link}" style="color: #0056b3; text-decoration: underline;">{reset_link}</a></p>
                    </div>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    send_email(email, subject, body)

def send_password_reset_confirmation_email(email: str):
    subject = "ViperIT: Your Password Has Been Reset"
    body = """
    <html>
    <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;">
        <table role="presentation" style="width: 100%; background-color: #f4f4f4; padding: 20px; margin: 0;">
            <tr>
                <td style="text-align: center;">
                    <div style="max-width: 600px; background: #ffffff; margin: auto; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
                        <!-- Header Section -->
                        <table role="presentation" style="width: 100%; border-bottom: 2px solid #0056b3; margin-bottom: 20px;">
                            <tr>
                                <td style="text-align: center; padding-bottom: 15px;">
                                    <img src="https://www.viperit.com.br/wp-content/uploads/2020/09/Logo-VIper-It_vert.png" alt="ViperIT Logo" style="max-width: 100px;">
                                </td>
                            </tr>
                        </table>
                        
                        <!-- Body Section -->
                        <h2 style="color: #0056b3; margin-bottom: 20px;">Password Reset Successful</h2>
                        <p style="font-size: 16px; line-height: 1.5;">Hi,</p>
                        <p style="font-size: 16px; line-height: 1.5;">Your password has been successfully reset. If you did not request or make this change, please <a href="mailto:support@viperit.com" style="color: #0056b3; text-decoration: underline;">contact support</a> immediately.</p>
                        
                        <!-- Separator -->
                        <hr style="border-top: 1px solid #ddd; margin: 20px 0;">
                        
                        <!-- Footer Section -->
                        <p style="font-size: 16px; line-height: 1.5;">Thanks,<br>The ViperIT Team</p>
                        <hr style="border-top: 1px solid #ddd; margin: 20px 0;">
                        <p style="font-size: 12px; color: #777;">If you did not initiate this request, please secure your account immediately.</p>
                    </div>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    send_email(email, subject, body)
