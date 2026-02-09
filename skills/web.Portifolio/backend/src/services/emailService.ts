import nodemailer from 'nodemailer';

class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendVerificationCode(email: string, code: string) {
        const mailOptions = {
            from: `"Portfolio Admin" <${process.env.SMTP_FROM}>`,
            to: email,
            subject: 'Seu Código de Acesso ao Portfólio',
            text: `Seu código de verificação é: ${code}. Ele expira em 10 minutos.`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
                    <h2 style="color: #0A0A0A; text-align: center;">Verificação de Acesso</h2>
                    <p style="font-size: 16px; color: #333;">Olá Natan,</p>
                    <p style="font-size: 16px; color: #333;">Use o código abaixo para autenticar seu acesso ao painel administrativo do portfólio:</p>
                    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #CCFF00; background: #0A0A0A; border-radius: 8px; margin: 20px 0;">
                        ${code}
                    </div>
                    <p style="font-size: 14px; color: #666; text-align: center;">Este código expira em 10 minutos.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #999; text-align: center;">Se você não solicitou este código, por favor ignore este email.</p>
                </div>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Verification email sent to ${email}`);
        } catch (error) {
            console.error('❌ Error sending verification email:', error);
            throw new Error('Falha ao enviar email de verificação');
        }
    }
}

export const emailService = new EmailService();
