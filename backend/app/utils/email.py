from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from fastapi import HTTPException
from dotenv import load_dotenv
import smtplib
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
    raise ValueError("Algumas variáveis de ambiente necessárias não estão definidas")

logger = logging.getLogger(__name__)

def send_email(to_address: str, subject: str, body: str, image_path: str = None):
    try:
        msg = MIMEMultipart('related')
        msg['From'] = EMAIL_FROM
        msg['To'] = to_address
        msg['Subject'] = subject

        msg_alternative = MIMEMultipart('alternative')
        msg.attach(msg_alternative)
        msg_alternative.attach(MIMEText(body, 'html'))

        if image_path:
            with open(image_path, 'rb') as img:
                mime_image = MIMEImage(img.read())
                mime_image.add_header('Content-ID', '<logo>')
                msg.attach(mime_image)

        server = smtplib.SMTP(SMTP_SERVER, int(SMTP_PORT))
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.sendmail(EMAIL_FROM, to_address, msg.as_string())
        server.quit()

        logger.info(f"E-mail enviado com sucesso para: {to_address}")
    except smtplib.SMTPException as e:
        logger.error(f"Falha ao enviar e-mail: {e}")
        raise HTTPException(status_code=500, detail="Falha ao enviar e-mail. Por favor, tente novamente mais tarde.")

def send_reset_password_email(email: str, token: str):
    reset_link = f"{RESET_PASSWORD_URL}?access_token={token}"
    subject = "Marcelo Desenvolvimento: Redefina sua Senha"
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
                                    <img src="cid:logo" alt="Logo Marcelo Desenvolvedor" style="width: 150px; height: auto; display: block; margin: 20px auto;">
                                </td>
                            </tr>
                        </table>
                        <h2 style="color: #081a89; margin-bottom: 20px;">Solicitação de redefinição de Senha</h2>
                        <p style="font-size: 16px; line-height: 1.5;">Oi,</p>
                        <p style="font-size: 16px; line-height: 1.5;">Recentemente, você solicitou a redefinição da senha da sua conta. Clique no botão abaixo para redefini-lo:</p>
                        <p style="text-align: center;">
                            <a href="{reset_link}" style="background-color: #081a89; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Redefinir Senha</a>
                        </p>
                        
                        <!-- Separator -->
                        <hr style="border-top: 1px solid #ddd; margin: 20px 0;">
                        
                        <!-- Footer Section -->
                        <p style="font-size: 16px; line-height: 1.5;">Se você não solicitou uma redefinição de senha, ignore este e-mail ou<a href="mailto:marcelojuniorbzerra12@gmail.com" style="color: #0056b3; text-decoration: underline;"> entre em contato com o suporte</a> se você tiver dúvidas.</p>
                        <p style="font-size: 16px; line-height: 1.5;">Obrigado,<br>Equipe Marcelo Desenvolvimento</p>
                        <hr style="border-top: 1px solid #ddd; margin: 20px 0;">
                        <p style="font-size: 12px; color: #777;">Se você estiver com problemas para clicar no botão "Redefinir senha", clique ou copie e cole a URL abaixo em seu navegador:<br><a href="{reset_link}" style="color: #0056b3; text-decoration: underline;">{reset_link}</a></p>
                    </div>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

    logo = os.path.join(os.path.dirname(__file__), "../static/assets/logo_marcelo_desenvolvedor.png")
    image_path = os.path.abspath(logo)
    send_email(email, subject, body, image_path)

def send_password_reset_confirmation_email(email: str):
    subject = "Marcelo Desenvolvimento: Sua senha foi redefinida"
    body = """
    <html>
    <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;">
        <table role="presentation" style="width: 100%; background-color: #f4f4f4; padding: 20px; margin: 0;">
            <tr>
                <td style="text-align: center;">
                    <div style="max-width: 600px; background: #ffffff; margin: auto; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
                        <!-- Header Section -->
                        <table role="presentation" style="width: 100%; border-bottom: 2px solid #081a89; margin-bottom: 20px;">
                            <tr>
                                <td style="text-align: center; padding-bottom: 15px;">
                                    <img src="cid:logo" alt="Logo Marcelo Desenvolvedor" style="width: 150px; height: auto; display: block; margin: 20px auto;">
                                </td>
                                </td>
                            </tr>
                        </table>
                        
                        <!-- Body Section -->
                        <h2 style="color: #081a89; margin-bottom: 20px;">Redefinição de Senha Bem-Sucedida</h2>
                        <p style="font-size: 16px; line-height: 1.5;">Oi,</p>
                        <p style="font-size: 16px; line-height: 1.5;">Sua senha foi redefinida com sucesso. Se você não solicitou ou fez essa alteração, por favor <a href="mailto:marcelojuniorbzerra12@gmail.com" style="color: #0056b3; text-decoration: underline;">entre em contato com o suporte </a> imediatamente.</p>
                        
                        <!-- Separator -->
                        <hr style="border-top: 1px solid #ddd; margin: 20px 0;">
                        
                        <!-- Footer Section -->
                        <p style="font-size: 16px; line-height: 1.5;">Obrigado,<br>Equipe Marcelo Desenvolvimento</p>
                        <hr style="border-top: 1px solid #ddd; margin: 20px 0;">
                        <p style="font-size: 12px; color: #777;">Se você não iniciou esta solicitação, proteja sua conta imediatamente.</p>
                    </div>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    
    logo = os.path.join(os.path.dirname(__file__), "../static/assets/logo_marcelo_desenvolvedor.png")
    image_path = os.path.abspath(logo)
    send_email(email, subject, body, image_path)
